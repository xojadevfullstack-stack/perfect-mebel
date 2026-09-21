---
name: prisma-db-management
description: >-
  Use this skill when working with Prisma ORM and PostgreSQL database —
  creating migrations, seeding data, writing queries, managing the schema,
  backing up and restoring the database for the Mebel Salon project.
---

# Prisma + PostgreSQL Boshqaruvi

Bu skill ma'lumotlar bazasi bilan ishlash uchun yo'riqnoma.

## Schema Joylashuvi

```
packages/db/prisma/schema.prisma   # Shared Prisma schema (monorepo)
# yoki
apps/web/prisma/schema.prisma      # Agar monorepo bo'lmasa
```

## Asosiy Buyruqlar

### Migration

```bash
# Yangi migration yaratish
npx prisma migrate dev --name <migration_nomi>

# Misol:
npx prisma migrate dev --name init
npx prisma migrate dev --name add_warranty_field

# Production da migration
npx prisma migrate deploy
```

### Generate

```bash
# Prisma Client qayta yaratish (schema o'zgarganda)
npx prisma generate
```

### Studio

```bash
# DB ni vizual ko'rish (GUI)
npx prisma studio
```

### Validate

```bash
# Schema to'g'riligini tekshirish
npx prisma validate
```

### Reset

```bash
# DB ni to'liq tozalab, qaytadan migrate qilish (DIQQAT!)
npx prisma migrate reset
```

## Seed (Boshlang'ich Ma'lumotlar)

`prisma/seed.ts` fayli:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user yaratish
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Administrator",
    },
  });

  // Kategoriyalar yaratish
  const categories = [
    { slug: "divanlar", nameUz: "Divanlar", nameRu: "Диваны", nameEn: "Sofas", order: 1 },
    { slug: "krovatlar", nameUz: "Krovatlar", nameRu: "Кровати", nameEn: "Beds", order: 2 },
    { slug: "shkaflar", nameUz: "Shkaflar", nameRu: "Шкафы", nameEn: "Wardrobes", order: 3 },
    { slug: "stollar", nameUz: "Stollar", nameRu: "Столы", nameEn: "Tables", order: 4 },
    { slug: "stullar", nameUz: "Stullar", nameRu: "Стулья", nameEn: "Chairs", order: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Seed muvaffaqiyatli tugadi");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

`package.json` ga qo'shish:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Seed ishga tushirish:

```bash
npx prisma db seed
```

## Tez-tez Ishlatiladigan Querylar

### Kategoriyalar

```typescript
// Barcha kategoriyalar (tartib bo'yicha)
const categories = await prisma.category.findMany({
  orderBy: { order: "asc" },
});

// Kategoriya + uning mahsulotlari
const category = await prisma.category.findUnique({
  where: { slug: "divanlar" },
  include: { products: true },
});
```

### Mahsulotlar

```typescript
// Filtrlangan mahsulotlar
const products = await prisma.product.findMany({
  where: {
    categoryId: categoryId || undefined,
    stockStatus: stockStatus || undefined,
    OR: search ? [
      { titleUz: { contains: search, mode: "insensitive" } },
      { titleRu: { contains: search, mode: "insensitive" } },
      { titleEn: { contains: search, mode: "insensitive" } },
    ] : undefined,
  },
  include: { category: true, collection: true },
  orderBy: { createdAt: "desc" },
  skip: (page - 1) * limit,
  take: limit,
});
```

### Komplektlar

```typescript
// Komplekt tarkibiy mebellar bilan
const collection = await prisma.collection.findUnique({
  where: { slug: "modern-yotoqxona" },
  include: { products: { include: { category: true } } },
});
```

### Arizalar (Lead)

```typescript
// Yangi ariza yaratish
const lead = await prisma.lead.create({
  data: {
    customerName: "Karim Aliyev",
    phone: "+998901234567",
    address: "Toshkent, Chilonzor",
    source: "WEB", // yoki "BOT"
    itemsSummary: "Modern Yotoqxona to'plami (Krovat, Shkaf)",
    notes: "Yetkazib berish muddati?",
  },
});
```

## Backup va Restore

### Backup

```bash
# Docker orqali
docker exec mebel-postgres pg_dump -U mebel mebel_db > backup_$(date +%Y%m%d).sql

# Lokal PostgreSQL
pg_dump -U mebel mebel_db > backup.sql
```

### Restore

```bash
# Docker orqali
docker exec -i mebel-postgres psql -U mebel mebel_db < backup.sql

# Lokal PostgreSQL
psql -U mebel mebel_db < backup.sql
```

## Muhim Qoidalar

1. Schema o'zgartirgandan keyin doim `npx prisma migrate dev` ishlatish.
2. Production da faqat `npx prisma migrate deploy` ishlatish.
3. Bog'liq operatsiyalarda `prisma.$transaction()` ishlatish.
4. `@prisma/client` ni singleton pattern bilan import qilish (dev da hot-reload muammolarni oldini olish).
5. Indekslar: tez-tez qidiriladigan maydonlarga `@@index` qo'shish.
