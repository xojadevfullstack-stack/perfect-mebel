---
name: admin-panel-crud
description: >-
  Use this skill when building the Web Admin Panel CRUD operations for
  categories, products, collections, and leads. Includes JWT authentication,
  protected routes, image upload, and dark/light mode support.
---

# Web Admin Panel CRUD

Bu skill Admin Panel ning barcha CRUD sahifalarini qurish yo'riqnomasi.

## Admin Panel Tuzilishi

```
app/admin/
├── login/
│   └── page.tsx              # Login forma
├── layout.tsx                # Admin layout (sidebar + auth check)
├── page.tsx                  # Dashboard / Redirect
├── categories/
│   ├── page.tsx              # Kategoriyalar jadvali
│   └── [id]/
│       └── page.tsx          # Kategoriya tahrirlash
├── products/
│   ├── page.tsx              # Mebellar jadvali
│   ├── new/
│   │   └── page.tsx          # Yangi mebel qo'shish
│   └── [id]/
│       └── page.tsx          # Mebel tahrirlash
├── collections/
│   ├── page.tsx              # Komplektlar jadvali
│   ├── new/
│   │   └── page.tsx          # Yangi komplekt
│   └── [id]/
│       └── page.tsx          # Komplekt tahrirlash
└── leads/
    └── page.tsx              # Arizalar jadvali (faqat ko'rish)
```

## 1. JWT Autentifikatsiya

### Login Endpoint

```typescript
// app/api/admin/auth/login/route.ts
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const admin = await prisma.adminUser.findUnique({ where: { username } });
  if (!admin) return Response.json({ success: false, error: "Foydalanuvchi topilmadi" }, { status: 401 });

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) return Response.json({ success: false, error: "Parol noto'g'ri" }, { status: 401 });

  const token = await new SignJWT({ sub: admin.id, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));

  // Cookie ga saqlash
  const response = Response.json({ success: true });
  response.headers.set("Set-Cookie", `token=${token}; Path=/admin; HttpOnly; SameSite=Strict; Max-Age=604800`);
  return response;
}
```

### Auth Middleware

```typescript
// lib/auth.ts
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function getAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch {
    return null;
  }
}
```

## 2. CRUD Pattern (Misol: Kategoriyalar)

### Server Action

```typescript
// app/admin/categories/actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

const categorySchema = z.object({
  nameUz: z.string().min(1, "UZ nomi majburiy"),
  nameRu: z.string().optional().default(""),
  nameEn: z.string().optional().default(""),
  order: z.number().int().default(0),
});

export async function createCategory(formData: FormData) {
  const data = categorySchema.parse({
    nameUz: formData.get("nameUz"),
    nameRu: formData.get("nameRu") || formData.get("nameUz"),
    nameEn: formData.get("nameEn") || formData.get("nameUz"),
    order: Number(formData.get("order") || 0),
  });

  const slug = slugify(data.nameUz, { lower: true });

  await prisma.category.create({
    data: { ...data, slug },
  });

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
```

### Jadval Sahifasi

shadcn/ui `<Table>` komponenti + Server Component:

```tsx
// app/admin/categories/page.tsx
import { prisma } from "@/lib/db";
import { columns } from "./columns";
import { DataTable } from "@/components/admin/data-table";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kategoriyalar</h1>
        <AddCategoryDialog />
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
```

## 3. Rasm Upload

### Supabase Storage orqali

```typescript
// app/api/upload/route.ts
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return Response.json({ error: "Fayl topilmadi" }, { status: 400 });
  if (!file.type.startsWith("image/")) return Response.json({ error: "Faqat rasm" }, { status: 400 });
  if (file.size > 5 * 1024 * 1024) return Response.json({ error: "Max 5MB" }, { status: 400 });

  const fileName = `${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("products")
    .upload(fileName, file, { contentType: file.type });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const { data: urlData } = supabase.storage.from("products").getPublicUrl(data.path);

  return Response.json({ success: true, url: urlData.publicUrl });
}
```

## 4. Arizalar Jadvali (Faqat Ko'rish)

```tsx
// app/admin/leads/page.tsx
export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Arizalar</h1>
      <DataTable
        columns={leadColumns}
        data={leads}
        searchField="customerName"
      />
    </div>
  );
}
```

> ⚠️ Arizalar jadvalida FAQAT ko'rish — status o'zgartirish yoki bekor qilish tugmalari yo'q (PRD v2.0 talabi).

## 5. Admin Layout

```tsx
// app/admin/layout.tsx
import { getAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="flex h-screen">
      <AdminSidebar adminName={admin.name as string} />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  );
}
```

## Tekshirish Ro'yxati

- [ ] Login/Logout ishlaydi
- [ ] JWT cookie to'g'ri saqlanadi
- [ ] Kategoriyalar CRUD ishlaydi
- [ ] Mebellar CRUD + rasm upload ishlaydi
- [ ] Komplektlar CRUD + mebel biriktirish ishlaydi
- [ ] Arizalar jadvali to'g'ri ko'rinadi
- [ ] Dark/Light mode barcha sahifalarda ishlaydi
- [ ] Ruxsatsiz kirish redirect qilinadi
