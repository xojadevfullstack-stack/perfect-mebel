---
name: nextjs-app-setup
description: >-
  Use this skill when setting up a new Next.js 14+ App Router project with
  Tailwind CSS, shadcn/ui, next-themes, next-intl, and Prisma ORM for the
  Mebel Salon furniture showcase project.
---

# Next.js App Router Loyiha Setup

Bu skill loyihaning web qismini noldan yaratish uchun to'liq yo'riqnoma.

## Talablar

- Node.js 20+
- pnpm yoki npm
- PostgreSQL (Docker yoki lokal)

## Bosqichlar

### 1. Next.js Loyiha Yaratish

```bash
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
```

### 2. shadcn/ui O'rnatish

```bash
cd apps/web
npx shadcn-ui@latest init
# Style: Default
# Base color: Neutral
# CSS variables: Yes
```

Kerak bo'ladigan komponentlar:

```bash
npx shadcn-ui@latest add button dialog input label table card checkbox sheet dropdown-menu toast tabs badge separator
```

### 3. next-themes O'rnatish

```bash
npm install next-themes
```

`app/layout.tsx` da `<ThemeProvider>` bilan o'rash:

```tsx
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 4. next-intl O'rnatish

```bash
npm install next-intl
```

Konfiguratsiya fayllari:
- `i18n/config.ts` — tillar ro'yxati
- `i18n/request.ts` — server request config
- `messages/uz.json`, `messages/ru.json`, `messages/en.json`
- `middleware.ts` — locale routing
- `app/[locale]/layout.tsx` — locale-aware layout

### 5. Prisma O'rnatish

```bash
npm install prisma @prisma/client
npx prisma init
```

`prisma/schema.prisma` ga PRD v2.0 dagi schemani nusxalash.

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 6. Qo'shimcha Paketlar

```bash
npm install react-hook-form zod @hookform/resolvers
npm install zustand
npm install embla-carousel-react
npm install bcryptjs jose
npm install sonner
npm install slugify
npm install react-phone-number-input
npm install lucide-react
npm install clsx tailwind-merge
npm install -D @types/bcryptjs
```

### 7. Tekshirish

```bash
npx tsc --noEmit          # TypeScript xatolar yo'qligini tekshirish
npm run dev                # Development server ishga tushirish
npx prisma studio          # DB ni vizual tekshirish
```

## Natija

Tayyor loyihada quyidagilar ishlaydi:
- ✅ App Router bilan sahifalar
- ✅ Tailwind CSS + shadcn/ui komponentlar
- ✅ Dark/Light mode
- ✅ UZ/RU/EN ko'p tillilik
- ✅ PostgreSQL ga ulangan Prisma ORM
