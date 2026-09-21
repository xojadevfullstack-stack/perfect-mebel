---
name: vitrina-frontend
description: >-
  Use this skill when building the customer-facing web vitrina (showcase) pages —
  home page, catalog with filters, collections with interactive checklist,
  "Mening tanlovlarim" (my selections) basket, and the lead application modal.
---

# Veb-Vitrina (Mijoz Frontend)

Bu skill saytning mijozlarga ko'rinadigan sahifalarini qurish uchun yo'riqnoma.

## Sahifalar Xaritasi

```
app/[locale]/
├── page.tsx                  # Bosh sahifa
├── layout.tsx                # Umumiy layout (Header, Footer)
├── catalog/
│   └── page.tsx              # Katalog (filtrlar + qidiruv)
├── catalog/[slug]/
│   └── page.tsx              # Mahsulot batafsil sahifasi
├── collections/
│   └── page.tsx              # Komplektlar ro'yxati
├── collections/[slug]/
│   └── page.tsx              # Komplekt batafsil + checklist
└── contact/
    └── page.tsx              # Aloqa sahifasi
```

## 1. Layout Komponentlar

### Header

```tsx
// components/layout/header.tsx
"use client";

import { ThemeSwitcher } from "./theme-switcher";   // next-themes
import { LanguageSwitcher } from "./language-switcher"; // next-intl
import { SelectionsWidget } from "./selections-widget"; // zustand
import { Navigation } from "./navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <Navigation />
        <div className="flex items-center gap-3">
          <SelectionsWidget />
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
```

### Navigatsiya (sahifalar)

| Sahifa | URL | Kalit |
|--------|-----|-------|
| Bosh sahifa | `/[locale]` | `nav.home` |
| Katalog | `/[locale]/catalog` | `nav.catalog` |
| Komplektlar | `/[locale]/collections` | `nav.collections` |
| Aloqa | `/[locale]/contact` | `nav.contact` |

## 2. Bosh Sahifa

Komponentlar:
1. **Hero Banner** — slayder yoki statik banner
2. **Ommabop mebellar** — `embla-carousel-react` bilan slayder
3. **Yangi komplektlar** — 3-4 ta karta grid
4. **CTA** — "Katalogni ko'rish" tugmasi
5. **Kompaniya haqida** — qisqa matn + rasm

## 3. Katalog Sahifasi

### Filtrlar

```tsx
// Gorizontal toifalar paneli (tabs)
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">Barchasi</TabsTrigger>
    {categories.map((cat) => (
      <TabsTrigger key={cat.id} value={cat.slug}>
        {cat[`name${locale}`]}
      </TabsTrigger>
    ))}
  </TabsList>
</Tabs>

// Yon filtrlar
- Kategoriya (agar tabs bo'lmasa)
- Material
- Mavjudlik holati (IN_STOCK / MADE_TO_ORDER)
- Qidiruv (matn bo'yicha)
```

### Mahsulot Karta

```tsx
// components/catalog/product-card.tsx
export function ProductCard({ product, locale }: ProductCardProps) {
  const { addSelection } = useSelections();

  return (
    <Card className="group overflow-hidden">
      {/* Rasm */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product[`title${locale}`]}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.stockStatus === "MADE_TO_ORDER" && (
          <Badge className="absolute top-2 right-2">Buyurtmaga</Badge>
        )}
      </div>

      {/* Ma'lumot */}
      <CardContent className="p-4">
        <h3 className="font-semibold">{product[`title${locale}`]}</h3>
        <p className="text-sm text-muted-foreground">{product.category[`name${locale}`]}</p>
      </CardContent>

      {/* Tugmalar */}
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button variant="outline" size="sm" onClick={() => addSelection(product)}>
          Tanlash ➕
        </Button>
        <Button size="sm">Batafsil</Button>
      </CardFooter>
    </Card>
  );
}
```

## 4. "Mening Tanlovlarim" (Zustand Store)

```typescript
// store/selections.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SelectionsStore {
  items: Product[];
  addSelection: (product: Product) => void;
  removeSelection: (productId: string) => void;
  clearSelections: () => void;
  isSelected: (productId: string) => boolean;
}

export const useSelections = create<SelectionsStore>()(
  persist(
    (set, get) => ({
      items: [],
      addSelection: (product) => {
        if (!get().isSelected(product.id)) {
          set((state) => ({ items: [...state.items, product] }));
        }
      },
      removeSelection: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      clearSelections: () => set({ items: [] }),
      isSelected: (productId) => get().items.some((item) => item.id === productId),
    }),
    { name: "mebel-selections" }
  )
);
```

### Suzuvchi Widget

```tsx
// components/layout/selections-widget.tsx
"use client";

export function SelectionsWidget() {
  const { items } = useSelections();
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      >
        📋 Tanlanganlar ({items.length})
      </Button>
      <SelectionsSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
```

## 5. Komplekt Checklist

```tsx
// app/[locale]/collections/[slug]/page.tsx
export function CollectionChecklist({ products, locale }) {
  const [checked, setChecked] = useState<Set<string>>(
    new Set(products.map((p) => p.id))  // default: hammasi tanlangan
  );

  const toggle = (id: string) => {
    const next = new Set(checked);
    next.has(id) ? next.delete(id) : next.add(id);
    setChecked(next);
  };

  return (
    <div className="space-y-3">
      {products.map((product) => (
        <label key={product.id} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent">
          <Checkbox
            checked={checked.has(product.id)}
            onCheckedChange={() => toggle(product.id)}
          />
          <Image src={product.images[0]} width={60} height={60} alt="" className="rounded" />
          <span>{product[`title${locale}`]}</span>
        </label>
      ))}
      <Button onClick={() => openOrderModal(checked)}>
        Ariza berish ({checked.size} ta tanlangan)
      </Button>
    </div>
  );
}
```

## 6. Ariza Modali

```tsx
// components/order-modal.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const leadSchema = z.object({
  customerName: z.string().min(2, "Ism majburiy"),
  phone: z.string().min(9, "Telefon raqam majburiy"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

export function OrderModal({ items, open, onClose }) {
  const form = useForm({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data) => {
    await fetch("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        ...data,
        source: "WEB",
        itemsSummary: items.map((i) => i.titleUz).join(", "),
      }),
    });
    toast.success("Arizangiz qabul qilindi! ✅");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ariza qoldirish</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input {...form.register("customerName")} placeholder="Ismingiz *" />
          <Input {...form.register("phone")} placeholder="Telefon raqam *" />
          <Input {...form.register("address")} placeholder="Manzil (ixtiyoriy)" />
          <Textarea {...form.register("notes")} placeholder="Izoh (ixtiyoriy)" />
          <Button type="submit" className="w-full">Yuborish</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

## 7. Telegram ga O'tish Tugmasi

```tsx
<Button asChild>
  <a href={`https://t.me/${BOT_USERNAME}?start=order_product_${product.id}`} target="_blank">
    📱 Telegram orqali buyurtma
  </a>
</Button>
```

## Tekshirish

- [ ] Bosh sahifa to'g'ri yuklanadi
- [ ] Katalog filtrlar ishlaydi
- [ ] "Tanlash ➕" tugmasi mahsulotni savatga qo'shadi
- [ ] Suzuvchi widget ko'rinadi
- [ ] Komplekt checklist ishlaydi
- [ ] Ariza modali validatsiya bilan ishlaydi
- [ ] Lead bazaga saqlanadi va kanalga ketadi
- [ ] 3 tilda to'g'ri ishlaydi
- [ ] Dark/Light mode to'g'ri ishlaydi
- [ ] Mobile responsive
