# 🗺 Mebel Salon — 7 Kunlik MVP Roadmap

> **Hujjat versiyasi:** 1.0  
> **Yaratilgan:** 2026-09-20  
> **Deadline:** 2026-09-27  
> **Maqsad:** PRD v2.0 asosida to'liq ishlaydigan MVP yetkazib berish

---

## 📌 Umumiy Qoidalar

- Har bir kun oxirida `PROJECT_STATE.md` ni yangilash **MAJBURIY**.
- Har bir kun `npm run build` + `npx tsc --noEmit` testidan o'tishi **SHART**.
- Qadamlar tartib bilan bajariladi — keyingi qadamga o'tishdan oldin avvalgisi tugallanadi.
- Har bir kun uchun **Skill** ko'rsatilgan — agent o'sha SKILL.md ni avval o'qiydi.

---

## 📊 Sprint Umumiy Ko'rinishi

```
Kun 1  ──── Infratuzilma + DB + Config
Kun 2  ──── Admin Panel: Auth + Kategoriyalar + Mebellar
Kun 3  ──── Admin Panel: Komplektlar + Arizalar + Rasm Upload
Kun 4  ──── Vitrina: Bosh Sahifa + Katalog + i18n
Kun 5  ──── Vitrina: Komplektlar + Tanlovlar + Ariza Modal
Kun 6  ──── Telegram Bot: Mijoz + Admin + Live Chat
Kun 7  ──── Integratsiya + Deploy + QA + Polish
```

---

## 🗓 Kunlik Jadval

| Kun | Sana | Asosiy Mavzu | Skill | Status |
|-----|------|-------------|-------|--------|
| 1 | 2026-09-21 | Infratuzilma + DB | `nextjs-app-setup` | ✅ |
| 2 | 2026-09-22 | Admin Auth + CRUD | `admin-panel-crud` | ⬜ |
| 3 | 2026-09-23 | Komplektlar + Upload | `admin-panel-crud` | ⬜ |
| 4 | 2026-09-24 | Vitrina + Katalog | `vitrina-frontend` | ⬜ |
| 5 | 2026-09-25 | Komplektlar + Ariza | `vitrina-frontend` | ⬜ |
| 6 | 2026-09-26 | Telegram Bot | `telegram-bot-setup` | ⬜ |
| 7 | 2026-09-27 | Deploy + QA | `deploy-production` | ⬜ |

---

---

# 📅 KUN 1 — Loyiha Infratuzilmasi va Ma'lumotlar Bazasi

> **Sana:** 2026-09-21 | **Skill:** `.agents/skills/nextjs-app-setup/SKILL.md`  
> **Maqsad:** Loyiha skeleti va ishlaydigan DB bilan boshlaymiz.

---

## ✅ Qadamlar

### 1.1 — Monorepo Tuzilmasini Yaratish

```
Maqsad: Yagona repo ichida web va bot uchun alohida papkalar
Fayllar:
  ├── apps/
  │   ├── web/          ← Next.js 14 App Router
  │   └── bot/          ← grammY Telegram Bot (Node.js)
  ├── packages/
  │   └── db/           ← Prisma Client (shared)
  ├── package.json      ← workspace root (npm workspaces)
  └── turbo.json        ← (ixtiyoriy, Turborepo)
```

**Qadamlar:**
- [ ] Root `package.json` da `"workspaces": ["apps/*", "packages/*"]` qo'shish
- [ ] `apps/web/` papkasini yaratish
- [ ] `apps/bot/` papkasini yaratish
- [ ] `packages/db/` papkasini yaratish

---

### 1.2 — Next.js 14 App Router Sozlash

```bash
# apps/web ichida
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

**Qadamlar:**
- [ ] `apps/web/` da Next.js 14 o'rnatish
- [ ] Tailwind CSS to'g'ri ishlayotganini tekshirish
- [ ] `next.config.ts` ni PRD talablari bo'yicha sozlash (i18n, images domain)
- [ ] `tsconfig.json` da `"strict": true` tekshirish

---

### 1.3 — shadcn/ui O'rnatish

```bash
# apps/web ichida
npx shadcn@latest init
# Komponentlarni o'rnatish:
npx shadcn@latest add button input label card table badge dialog form select textarea
```

**Qadamlar:**
- [ ] shadcn/ui init (style: default, base color: slate/zinc)
- [ ] Asosiy komponentlarni o'rnatish (yuqoridagilar)
- [ ] `components/ui/` papkasini tekshirish

---

### 1.4 — next-themes va next-intl Sozlash

```bash
npm install next-themes next-intl
```

**Qadamlar:**
- [ ] `next-themes` o'rnatish va `ThemeProvider` ni `layout.tsx` ga ulash
- [ ] `next-intl` o'rnatish
- [ ] `i18n/routing.ts` fayl yaratish (locales: `['uz', 'ru', 'en']`, defaultLocale: `'uz'`)
- [ ] `messages/uz.json`, `messages/ru.json`, `messages/en.json` bo'sh fayllari yaratish
- [ ] `middleware.ts` ni next-intl uchun sozlash
- [ ] `[locale]/layout.tsx` tuzilmasini yaratish

---

### 1.5 — Prisma + PostgreSQL Sozlash

```bash
# packages/db ichida
npm install prisma @prisma/client
npx prisma init
```

**Qadamlar:**
- [ ] `packages/db/prisma/schema.prisma` faylini PRD v2.0 dan to'liq ko'chirish (6 model: Category, Collection, Product, Lead, SupportMessage, AdminUser)
- [ ] `StockStatus` enum qo'shish
- [ ] PostgreSQL Docker container ishga tushirish:
  ```bash
  docker run -d --name mebel-db -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=mebel_db -p 5432:5432 postgres:15
  ```
- [ ] `packages/db/.env` fayl yaratish (`DATABASE_URL`)

---

### 1.6 — Migratsiya va Prisma Client Generatsiya

```bash
npx prisma migrate dev --name init
npx prisma generate
```

**Qadamlar:**
- [ ] `npx prisma migrate dev --name init` ishga tushirish
- [ ] `npx prisma validate` — xatolik yo'qligini tekshirish
- [ ] `npx prisma studio` — DB jadvallarini vizual ko'rish
- [ ] Prisma clientni `packages/db/index.ts` dan export qilish

---

### 1.7 — Environment Variables Sozlash

**Qadamlar:**
- [ ] Root `.env.example` fayl yaratish:
  ```env
  DATABASE_URL=postgresql://postgres:secret@localhost:5432/mebel_db
  NEXTAUTH_SECRET=your-secret-here
  JWT_SECRET=your-jwt-secret
  TELEGRAM_BOT_TOKEN=
  ADMIN_TELEGRAM_IDS=
  FACTORY_CHANNEL_ID=
  SUPPORT_GROUP_ID=
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  NEXT_PUBLIC_BASE_URL=http://localhost:3000
  ```
- [ ] `.env` faylni `.gitignore` ga qo'shilganligini tekshirish
- [ ] `apps/web/.env.local` faylini yaratish

---

### 1.8 — ESLint, Prettier, TypeScript Config

```bash
npm install -D prettier eslint-config-prettier
```

**Qadamlar:**
- [ ] `.prettierrc` fayl yaratish (tabWidth: 2, singleQuote: true)
- [ ] `.eslintrc.json` da strict qoidalar: `"@typescript-eslint/no-explicit-any": "error"`
- [ ] `.gitignore` tekshirish (node_modules, .env, .next, dist)
- [ ] Git repo init: `git init && git add . && git commit -m "chore: initial project setup"`

---

### 1.9 — Kun 1 Tekshiruvi

- [x] `npx tsc --noEmit` — 0 xatolik
- [x] `npm run dev` — `http://localhost:3000` ochiladi
- [x] `npx prisma studio` — barcha 6 ta jadval ko'rinadi
- [x] `PROJECT_STATE.md` yangilash (Kun 1 → ✅)

---

**⏱ Taxminiy vaqt:** 6–8 soat  
**📦 Output:** Ishlaydigan Next.js 14 loyihasi + PostgreSQL DB + Prisma migrasiyalari

---

---

# 📅 KUN 2 — Web Admin Panel: Autentifikatsiya + Kategoriyalar + Mebellar

> **Sana:** 2026-09-22 | **Skill:** `.agents/skills/admin-panel-crud/SKILL.md`  
> **Maqsad:** Admin kirish tizimi va asosiy CRUD sahifalari.

---

## ✅ Qadamlar

### 2.1 — Admin Layout va Routing

```
app/[locale]/admin/
├── layout.tsx          ← AdminLayout (sidebar, header, theme)
├── page.tsx            ← Dashboard (redirect → /admin/products)
├── login/
│   └── page.tsx        ← Login sahifasi
├── categories/
│   └── page.tsx        ← Kategoriyalar sahifasi
└── products/
    └── page.tsx        ← Mebellar sahifasi
```

**Qadamlar:**
- [ ] `app/[locale]/admin/` routing tuzilmasini yaratish
- [ ] Admin layout: yon panel (sidebar) + yuqori panel (header)
- [ ] Sidebar: Kategoriyalar, Mebellar, Komplektlar, Arizalar havolalari
- [ ] Dark/Light mode toggle Admin headerda (next-themes `useTheme()`)

---

### 2.2 — JWT Autentifikatsiya Tizimi

```bash
npm install jose bcryptjs
npm install -D @types/bcryptjs
```

**Qadamlar:**
- [ ] `lib/auth/jwt.ts` — token yaratish va tekshirish (`jose` bilan)
- [ ] `lib/auth/password.ts` — `bcryptjs` bilan hash va compare (min 10 rounds)
- [ ] `app/api/admin/auth/login/route.ts` — POST endpoint:
  - Input: `{ username, password }` (zod bilan validatsiya)
  - Jarayon: DB dan user topish → bcrypt compare → JWT imzolash
  - Output: `{ success: true, data: { token } }`
- [ ] `middleware.ts` ga admin route himoyasi qo'shish (token tekshirish)
- [ ] `lib/auth/session.ts` — cookie orqali token saqlash yordamchi funksiya

---

### 2.3 — Admin Login Sahifasi

**Qadamlar:**
- [ ] `app/[locale]/admin/login/page.tsx` — login forma
- [ ] `react-hook-form` + `zod` bilan validatsiya
- [ ] Xato holatlari: noto'g'ri parol, server xatosi
- [ ] Muvaffaqiyatli login → `/admin/categories` ga redirect
- [ ] Cookie da JWT token saqlash (httpOnly)
- [ ] Login sahifa Dark/Light mode qo'llab-quvvatlashi

---

### 2.4 — Admin Seed Skripti

```bash
# packages/db/seed.ts
npx ts-node packages/db/seed.ts
```

**Qadamlar:**
- [ ] `packages/db/seed.ts` fayl yaratish
- [ ] Default admin user yaratish:
  - username: `admin`, password: `Admin123!` (bcrypt hash)
- [ ] `package.json` ga `"db:seed": "ts-node packages/db/seed.ts"` qo'shish
- [ ] Seed ishga tushirish va login tekshiruvi

---

### 2.5 — Kategoriyalar CRUD

**API Endpointlar:**
```
GET    /api/admin/categories       → Barcha kategoriyalar (paginated)
POST   /api/admin/categories       → Yangi kategoriya qo'shish
PATCH  /api/admin/categories/:id   → Kategoriyani tahrirlash
DELETE /api/admin/categories/:id   → Kategoriyani o'chirish
```

**Qadamlar:**
- [ ] `app/api/admin/categories/route.ts` — GET, POST
- [ ] `app/api/admin/categories/[id]/route.ts` — PATCH, DELETE
- [ ] Barcha endpointda zod validatsiya
- [ ] Barcha endpointda JWT auth tekshiruvi
- [ ] `app/[locale]/admin/categories/page.tsx`:
  - Jadval: nameUz, nameRu, nameEn, order, Amallar (Tahrirlash, O'chirish)
  - "Yangi Kategoriya" tugmasi → Dialog/Modal (shadcn Dialog)
  - Forma: nameUz (majburiy), nameRu (ixtiyoriy), nameEn (ixtiyoriy), order
  - Inline tahrirlash yoki dialog orqali tahrirlash
  - O'chirishda tasdiq dialogi

---

### 2.6 — Mebellar CRUD (Rasm Uploadsiz)

**API Endpointlar:**
```
GET    /api/admin/products         → Ro'yxat (category filter, search, pagination)
POST   /api/admin/products         → Yangi mebel
PATCH  /api/admin/products/:id     → Tahrirlash
DELETE /api/admin/products/:id     → O'chirish
```

**Qadamlar:**
- [ ] `app/api/admin/products/route.ts` — GET, POST
- [ ] `app/api/admin/products/[id]/route.ts` — PATCH, DELETE
- [ ] `app/[locale]/admin/products/page.tsx`:
  - Jadval: rasm (thumbnail), nom (UZ), kategoriya, stock holati, sana
  - Qidiruv input (nom bo'yicha)
  - Kategoriya filter (select)
  - "Yangi Mebel" tugmasi → katta Dialog/Sheet
  - Forma maydonlari: titleUz/Ru/En, descUz/Ru/En, categoryId, collectionId (ixtiyoriy), dimensions, material, warranty, stockStatus (IN_STOCK/MADE_TO_ORDER)
  - Rasm URLlari (hozircha text input, ertaga upload)
- [ ] `StockStatus` badge (IN_STOCK → yashil, MADE_TO_ORDER → sariq)
- [ ] Pagination (10 ta / sahifa)

---

### 2.7 — Kun 2 Tekshiruvi

- [ ] `npx tsc --noEmit` — 0 xatolik
- [ ] Login → Dashboard ishlaydi
- [ ] Kategoriya CRUD to'liq ishlaydi
- [ ] Mebel CRUD to'liq ishlaydi (rasm uploadsiz)
- [ ] Dark/Light mode toggle ishlaydi
- [ ] `PROJECT_STATE.md` yangilash (Kun 2 → ✅)

---

**⏱ Taxminiy vaqt:** 7–9 soat  
**📦 Output:** To'liq ishlaydi JWT auth + Admin CRUD (Kategoriya + Mebel)

---

---

# 📅 KUN 3 — Admin Panel: Komplektlar + Arizalar + Rasm Upload

> **Sana:** 2026-09-23 | **Skill:** `.agents/skills/admin-panel-crud/SKILL.md`  
> **Maqsad:** Komplekt boshqaruvi, ariza jadvali va Cloudinary/Supabase rasm yuklash.

---

## ✅ Qadamlar

### 3.1 — Cloudinary / Supabase Storage Integratsiya

```bash
npm install cloudinary
# yoki
npm install @supabase/supabase-js
```

**Qadamlar (Cloudinary tanlangan holat):**
- [ ] Cloudinary hisobi ochish va API kalitlarini `.env` ga qo'shish
- [ ] `lib/cloudinary.ts` — konfiguratsiya va upload helper funksiya:
  - `uploadImage(file: File): Promise<string>` — URL qaytaradi
  - Max 5MB tekshiruvi
  - Faqat `image/*` MIME type tekshiruvi
  - WebP formatga avtomatik o'tkazish
- [ ] `app/api/admin/upload/route.ts` — POST endpoint:
  - Input: `FormData` (file)
  - Output: `{ success: true, data: { url: string } }`
  - JWT auth tekshiruvi

---

### 3.2 — Rasm Upload Komponenti

**Qadamlar:**
- [ ] `components/admin/image-uploader.tsx` komponenti:
  - Drag & drop yoki fayl tanlash
  - Progress bar ko'rsatish
  - Preview (thumbnail)
  - O'chirish tugmasi
  - Multiple upload (har biri alohida URL)
- [ ] Mebel CRUD formasiga `ImageUploader` komponentini qo'shish (rasmlar array)
- [ ] Birinchi rasm avtomatik asosiy (muqova) sifatida belgilanishi

---

### 3.3 — Komplektlar CRUD

**API Endpointlar:**
```
GET    /api/admin/collections        → Ro'yxat
POST   /api/admin/collections        → Yangi komplekt
PATCH  /api/admin/collections/:id    → Tahrirlash
DELETE /api/admin/collections/:id    → O'chirish
GET    /api/admin/collections/:id/products  → Komplektdagi mebellar
POST   /api/admin/collections/:id/products  → Mebel biriktirish
DELETE /api/admin/collections/:id/products/:productId → Ajratish
```

**Qadamlar:**
- [ ] `app/api/admin/collections/route.ts` — GET, POST
- [ ] `app/api/admin/collections/[id]/route.ts` — PATCH, DELETE
- [ ] `app/api/admin/collections/[id]/products/route.ts` — mebellarni biriktirish
- [ ] `app/[locale]/admin/collections/page.tsx`:
  - Karta ko'rinishi (grid): muqova rasm, nom, tarkibdagi mebellar soni
  - "Yangi Komplekt" → Dialog
  - Forma: titleUz/Ru/En, descUz/Ru/En, rasmlar (ImageUploader)
  - Tahrirlash: rasmlar + tarkibiy mebellarni boshqarish
  - Tarkibiy mebellar: multiselect (mavjud mebellardan tanlash yoki ajratish)

---

### 3.4 — Arizalar (Leads) Jadvali

**API Endpoint:**
```
GET /api/admin/leads → Ro'yxat (sana bo'yicha tartiblash, search, pagination)
```

**Qadamlar:**
- [ ] `app/api/admin/leads/route.ts` — GET (faqat o'qish)
- [ ] `app/[locale]/admin/leads/page.tsx`:
  - Jadval ustunlari: Sana, Mijoz ismi, Telefon, Manzil, Manba (WEB/BOT), Tanlangan mebellar
  - Sana bo'yicha tartiblash (yangilar tepada)
  - Manba filtri (WEB / BOT / Barchasi)
  - Qidiruv (telefon yoki ism bo'yicha)
  - Pagination
  - Ariza tafsilotlari → Row click → Detail sheet/dialog (faqat ko'rish)
  - Hech qanday o'chirish/status o'zgartirish tugmasi YO'Q

---

### 3.5 — Admin Panel Final Polish

**Qadamlar:**
- [ ] Admin sidebar active link highlight
- [ ] Breadcrumb komponent (shadcn `Breadcrumb`)
- [ ] Loading skeleton komponent (jadval uchun)
- [ ] Error boundary komponent
- [ ] Toast xabarlar (shadcn `Toaster`): muvaffaqiyatli/xato amallar
- [ ] `components/admin/confirm-dialog.tsx` — o'chirish oldidan tasdiqlash
- [ ] Barcha formalar `react-hook-form` + `zod` bilan

---

### 3.6 — Kun 3 Tekshiruvi

- [ ] `npx tsc --noEmit` — 0 xatolik
- [ ] Rasm upload ishlaydi (Cloudinary/Supabase)
- [ ] Komplekt CRUD ishlaydi
- [ ] Tarkibiy mebellarni biriktirish/ajratish ishlaydi
- [ ] Arizalar jadvali ishlaydi (test ma'lumotlar bilan)
- [ ] `npm run build` — muvaffaqiyatli
- [ ] `PROJECT_STATE.md` yangilash (Kun 3 → ✅)

---

**⏱ Taxminiy vaqt:** 7–9 soat  
**📦 Output:** To'liq Admin Panel (Kategoriya + Mebel + Komplekt + Arizalar + Upload)

---

---

# 📅 KUN 4 — Veb-Vitrina: Bosh Sahifa + Katalog + i18n

> **Sana:** 2026-09-24 | **Skill:** `.agents/skills/vitrina-frontend/SKILL.md`  
> **Maqsad:** Mijozlar ko'radigan vitrina sahifalarining asosiy qismlari.

---

## ✅ Qadamlar

### 4.1 — i18n Tarjima Fayllarini To'ldirish

**Qadamlar:**
- [ ] `messages/uz.json` — barcha UI matnlarini UZ da yozish:
  ```json
  {
    "common": { "loading": "...", "error": "..." },
    "nav": { "home": "Bosh sahifa", "catalog": "Katalog", ... },
    "catalog": { "title": "Katalog", "filterByCategory": "Toifa bo'yicha", ... },
    "product": { "details": "Batafsil ma'lumot", "addToSelection": "Tanlash", ... },
    "lead": { "title": "Ariza qoldirish", "name": "Ism", ... },
    "collections": { "title": "Komplektlar", ... },
    "contact": { ... }
  }
  ```
- [ ] `messages/ru.json` — barcha matnlar RU da
- [ ] `messages/en.json` — barcha matnlar EN da
- [ ] next-intl `useTranslations()` to'g'ri ishlayotganini test qilish

---

### 4.2 — Public Layout: Header + Footer

**Qadamlar:**
- [ ] `app/[locale]/(public)/layout.tsx` — public sahifalar uchun alohida layout
- [ ] `components/layout/header.tsx`:
  - Logo/Brand nomi (chapda)
  - Navigatsiya: Bosh sahifa, Katalog, Komplektlar, Aloqa
  - Til almashtirgich (UZ/RU/EN) — dropdown (shadcn `Select` yoki custom)
  - Dark/Light mode toggle (quyosh/oy ikonasi)
  - "📋 Tanlovlar (N)" floating badge yoki header tugmasi
- [ ] `components/layout/footer.tsx`:
  - Kompaniya nomi, qisqa ma'lumot
  - Aloqa: telefon, manzil
  - Til va mavzu havolalari

---

### 4.3 — Bosh Sahifa (Homepage)

```
app/[locale]/(public)/page.tsx  →  /uz, /ru, /en
```

**Qadamlar:**
- [ ] **Hero sektsiya:** Katta sarlavha, qisqa tavsif, "Katalogni ko'rish" CTA tugmasi
- [ ] **Ommabop Mebellar sektsiyasi:** DB dan `stockStatus: IN_STOCK` bo'lgan 6 ta mebel fetch, karta ko'rinishi
- [ ] **Komplektlar slayderi:** DB dan 4 ta komplekt, gorizontal scroll yoki embla-carousel
- [ ] **Aloqa mini-sektsiya:** Telefon, manzil, Telegram botga o'tish tugmasi
- [ ] Server component sifatida yozish (Prisma to'g'ridan-to'g'ri)
- [ ] Loading skeleton (Suspense)

---

### 4.4 — Mahsulot Karta Komponenti

```
components/catalog/product-card.tsx
```

**Qadamlar:**
- [ ] `ProductCard` komponenti:
  - Rasm (Next.js `Image` komponenti, WebP)
  - Nom (locale bo'yicha: titleUz/titleRu/titleEn)
  - Kategoriya badge
  - Stock holati badge (IN_STOCK / MADE_TO_ORDER)
  - "Tanlash ➕" tugmasi → zustand store ga qo'shish
  - "Batafsil" tugmasi → accordion/collapse (dimensions, material, warranty)
  - "Telegram orqali buyurtma" → deep link
  - "Narxini bilish" tugmasi → Ariza modal
- [ ] Hover effekt (Tailwind `group`, `group-hover`)
- [ ] Dark/Light mode to'g'ri ko'rinishi

---

### 4.5 — Katalog Sahifasi

```
app/[locale]/(public)/catalog/page.tsx
```

**Qadamlar:**
- [ ] **URL search params** orqali filter saqlash (`?category=divans&search=...&status=IN_STOCK`)
- [ ] **Kategoriya tablar:** gorizontal scroll bo'lgan tab paneli (barcha kategoriyalar DB dan)
- [ ] **Yon filtrlar:**
  - Material bo'yicha (checkbox list)
  - Stock holati (IN_STOCK / MADE_TO_ORDER)
  - Kolleksiya bo'yicha
- [ ] **Qidiruv input** (debounce 300ms)
- [ ] **Mahsulotlar grid** (3 ustun desktop, 2 mobil, 1 kichik mobil)
- [ ] **Pagination yoki Infinite scroll** (load more tugmasi)
- [ ] Natija yo'q holati: "Mahsulot topilmadi" xabari

---

### 4.6 — Aloqa Sahifasi

```
app/[locale]/(public)/contact/page.tsx
```

**Qadamlar:**
- [ ] Telefon raqamlar (kliklanadigan `tel:` havolalar)
- [ ] Manzil (do'kon + zavod)
- [ ] Telegram botga o'tish tugmasi (katta, ko'zga tashlanadigan)
- [ ] Ixtiyoriy: Google Maps iframe embed

---

### 4.7 — Kun 4 Tekshiruvi

- [ ] `npx tsc --noEmit` — 0 xatolik
- [ ] 3 tilda (`/uz`, `/ru`, `/en`) sahifalar ochiladi
- [ ] Katalog filtrlari ishlaydi
- [ ] Dark/Light mode barcha sahifalarda ishlaydi
- [ ] Mobile responsive (375px) to'g'ri ko'rinadi
- [ ] `PROJECT_STATE.md` yangilash (Kun 4 → ✅)

---

**⏱ Taxminiy vaqt:** 8–10 soat  
**📦 Output:** To'liq vitrina: Bosh sahifa + Katalog + Aloqa + i18n + Dark/Light

---

---

# 📅 KUN 5 — Veb-Vitrina: Komplektlar + Mening Tanlovlarim + Ariza Tizimi

> **Sana:** 2026-09-25 | **Skill:** `.agents/skills/vitrina-frontend/SKILL.md`  
> **Maqsad:** Interaktiv komplekt checklisti, savat va ariza modal.

---

## ✅ Qadamlar

### 5.1 — Zustand Store: "Mening Tanlovlarim"

```bash
npm install zustand
```

```
lib/store/selections-store.ts
```

**Qadamlar:**
- [ ] `useSelectionsStore` zustand store:
  ```typescript
  interface SelectionItem {
    id: string;
    titleUz: string; titleRu: string; titleEn: string;
    images: string[];
    categoryName: string;
  }
  interface SelectionsStore {
    items: SelectionItem[];
    addItem: (item: SelectionItem) => void;
    removeItem: (id: string) => void;
    clearAll: () => void;
    isSelected: (id: string) => boolean;
  }
  ```
- [ ] `localStorage` persistatsiya (`zustand/middleware` `persist`)
- [ ] `ProductCard` da "Tanlash ➕" / "Tanlandi ✅" toggle

---

### 5.2 — Floating "Tanlovlar" Vidjeti

```
components/selections/floating-selections-widget.tsx
```

**Qadamlar:**
- [ ] Ekranning pastki o'ng burchagida floating tugma
- [ ] "📋 Tanlanganlar (N)" — N = tanlangan mebellar soni
- [ ] N = 0 bo'lganda ko'rinmaydi
- [ ] Click → Panel ochiladi:
  - Tanlangan mebellar ro'yxati (kichik kartalar)
  - Har birini o'chirish (✕)
  - "Hammasini tozalash" tugmasi
  - "Ariza qoldirish" asosiy tugmasi → Modal ochiladi
- [ ] Animatsiya (Tailwind `transition`, `transform`)

---

### 5.3 — Ariza Modal Komponenti (Lead Form)

```
components/lead/lead-modal.tsx
```

**Qadamlar:**
- [ ] shadcn `Dialog` asosida modal
- [ ] `react-hook-form` + `zod` validatsiya:
  ```typescript
  const leadSchema = z.object({
    customerName: z.string().min(2).max(100),
    phone: z.string().min(9).max(15),
    address: z.string().optional(),
    notes: z.string().max(500).optional(),
  })
  ```
- [ ] Modal sarlavhasida tanlangan mebellar soni ko'rinadi
- [ ] Form maydonlari: Ism*, Telefon*, Manzil (ixtiyoriy), Izoh (ixtiyoriy)
- [ ] Submit → `POST /api/leads`
- [ ] Loading holati (spinner tugmada)
- [ ] Muvaffaqiyatli → "Arizangiz qabul qilindi! ✅" xabari → Modal yopiladi → Store tozalanadi
- [ ] Xato → Toast xabar

---

### 5.4 — Leads API Endpointi

```
app/api/leads/route.ts
```

**Qadamlar:**
- [ ] `POST /api/leads` endpoint:
  - Input zod validatsiya (schema yuqorida)
  - `itemsSummary` — tanlangan mebellar nomi birlashtirilib string sifatida saqlanadi
  - `source: "WEB"` majburiy
  - DB ga Lead saqlash (`prisma.lead.create`)
  - Telegram Kanaliga xabarnoma yuborish (keyingi kun)
  - Output: `{ success: true, data: { id: string } }`
- [ ] CORS — faqat o'z domenidan

---

### 5.5 — Komplektlar Sahifasi

```
app/[locale]/(public)/collections/page.tsx
app/[locale]/(public)/collections/[slug]/page.tsx
```

**Qadamlar:**
- [ ] `collections/page.tsx` — komplektlar grid:
  - Muqova rasm, nom (locale bo'yicha), tarkibdagi mebellar soni
  - Karta click → `/collections/[slug]`
- [ ] `collections/[slug]/page.tsx` — Komplekt tafsilot sahifasi:
  - Komplekt rasmlari galereyasi (slayder)
  - Komplekt tavsifi
  - **Interaktiv Checklist** — asosiy funksiya:
    - Har bir tarkibiy mebel uchun checkbox
    - Barcha mebellar default tanlangan holda
    - "Barchasini tanlash" / "Hammasini bekor qilish"
    - Faqat tanlangan mebellar ariza ga kiritiladi
    - "Tanlangan mebellar bo'yicha ariza" tugmasi → Lead Modal
  - "Telegram orqali buyurtma" deep link: `t.me/<BOT>?start=order_set_<ID>`

---

### 5.6 — ProductCard uchun Telegram Deep Link

**Qadamlar:**
- [ ] `lib/telegram/deep-link.ts`:
  ```typescript
  export function buildProductDeepLink(productId: string): string
  export function buildCollectionDeepLink(collectionId: string): string
  ```
- [ ] Barcha mahsulot kartalariga "Telegram orqali" tugmasi qo'shish
- [ ] `NEXT_PUBLIC_BOT_USERNAME` env o'zgaruvchisidan username olish

---

### 5.7 — "Narxini Bilish" Tugmasi (Yagona Mahsulot Uchun)

**Qadamlar:**
- [ ] ProductCard da "Narxini bilish / Buyurtma berish" tugmasi
- [ ] Click → Lead Modal ochiladi, faqat shu mebel tanlangan holda
- [ ] Modal store ga qo'shmasdan to'g'ridan-to'g'ri product ID bilan yuborishi mumkin

---

### 5.8 — Kun 5 Tekshiruvi

- [ ] `npx tsc --noEmit` — 0 xatolik
- [ ] Tanlash → Floating widget → Ariza modal → DB ga yozildi ✅
- [ ] Komplekt checklisti → Ariza (faqat tanlangan mebellar) ✅
- [ ] Lead DB da `source: "WEB"` bilan saqlanadi ✅
- [ ] 3 tilda to'g'ri ishlaydi ✅
- [ ] `npm run build` — muvaffaqiyatli
- [ ] `PROJECT_STATE.md` yangilash (Kun 5 → ✅)

---

**⏱ Taxminiy vaqt:** 8–10 soat  
**📦 Output:** Komplektlar + Tanlovlar + Ariza tizimi to'liq ishlaydi

---

---

# 📅 KUN 6 — Telegram Bot: Mijoz + Admin + Live Chat

> **Sana:** 2026-09-26 | **Skill:** `.agents/skills/telegram-bot-setup/SKILL.md`  
> **Maqsad:** grammY bilan to'liq bot — mijoz katalogi, 4-bosqich FSM ariza, admin CRUD, Live Chat.

---

## ✅ Qadamlar

### 6.1 — Bot Loyiha Tuzilmasi

```bash
# apps/bot/
npm install grammy @grammyjs/conversations
npm install -D @types/node ts-node typescript
```

```
apps/bot/
├── src/
│   ├── bot.ts              ← Bot entry point
│   ├── middleware/
│   │   └── auth.ts         ← Admin tekshiruvi
│   ├── handlers/
│   │   ├── start.ts        ← /start + deep link parse
│   │   ├── catalog.ts      ← Ichki katalog
│   │   └── livechat.ts     ← Live chat relay
│   ├── conversations/
│   │   ├── apply.ts        ← 4-bosqich ariza FSM
│   │   ├── admin-category.ts ← Admin: kategoriya CRUD
│   │   ├── admin-product.ts  ← Admin: mebel CRUD
│   │   └── admin-collection.ts ← Admin: komplekt CRUD
│   ├── keyboards/
│   │   ├── main-menu.ts    ← Asosiy menyu keyboard
│   │   └── catalog.ts      ← Katalog inline keyboards
│   └── utils/
│       ├── channel-notify.ts ← Kanal xabarnoma
│       └── formatters.ts   ← Xabar formatlash
├── tsconfig.json
└── package.json
```

---

### 6.2 — Bot Asosi va /start Handler

**Qadamlar:**
- [ ] `bot.ts` — `new Bot(token)`, session middleware, conversations plugin ulash
- [ ] `/start` handler:
  - Oddiy `/start` → Bosh menyu (Katalog, Ariza berish, Aloqa)
  - `/start order_product_<ID>` → Deep link → To'g'ridan-to'g'ri `apply` conversation ga
  - `/start order_set_<ID>` → Komplekt bo'yicha ariza
- [ ] Asosiy menyu (ReplyKeyboard):
  - 🛋 Katalog
  - 📝 Ariza berish
  - 📞 Aloqa
  - (Admin uchun) ⚙️ Admin Panel

---

### 6.3 — Admin Tekshiruvi Middleware

**Qadamlar:**
- [ ] `middleware/auth.ts`:
  ```typescript
  export function requireAdmin(ctx: Context, next: NextFunction)
  // ADMIN_TELEGRAM_IDS env dan olib, ctx.from.id ni tekshiradi
  // Ruxsat yo'q → "Sizda ruxsat yo'q ❌" xabari
  ```
- [ ] Admin buyruqlari: `/admin`, `/add_product`, `/add_category`, `/add_collection`
- [ ] Har bir admin handler boshida `requireAdmin` chaqiriladi

---

### 6.4 — 4-Bosqich Ariza FSM (Customer)

```typescript
// conversations/apply.ts
// @grammyjs/conversations orqali
```

**Qadamlar:**
- [ ] `applyConversation` yaratish:
  ```
  Bosqich 1: Mebel/komplekt rasmi + nomi ko'rsatish
              "Ariza berishni davom ettirasizmi?" [Ha ✅ / Bekor qilish ❌]
  Bosqich 2: "Ismingizni kiriting:"
  Bosqich 3: "Telefon raqamingizni yuboring:" 
             [📱 Kontaktni ulashish] tugmasi (RequestContact keyboard)
             yoki matn ko'rinishida
  Bosqich 4: "Manzilingizni kiriting:" 
             [📍 Geolokatsiya ulashish] yoki yozma manzil
             + "Izoh qo'shishni xohlaysizmi?" (ixtiyoriy)
  → Lead DB ga saqlash (source: "BOT")
  → Kanal xabarnoma yuborish
  → "Arizangiz qabul qilindi! ✅ Menejerimiz tez orada bog'lanadi."
  ```
- [ ] Har bosqichda "🔙 Orqaga" va "❌ Bekor qilish" tugmalari
- [ ] `try/catch` har bir bosqichda

---

### 6.5 — Ichki Katalog (Customer)

**Qadamlar:**
- [ ] Katalog handler — kategoriyalar ro'yxati (inline keyboard)
- [ ] Kategoriya tanlash → mebellar ro'yxati (inline keyboard, sahifalash)
- [ ] Mebel tanlash → Mebel kartasi:
  - Rasm + nom + o'lcham + material + kafolat
  - [📝 Ariza berish] inline tugmasi → `applyConversation` ga
  - [⬅️ Orqaga] tugmasi
- [ ] Komplektlar bo'limi: komplektlar ro'yxati → ichidagi mebellar

---

### 6.6 — Kanal Xabarnomasi

```typescript
// utils/channel-notify.ts
```

**Qadamlar:**
- [ ] `sendLeadNotification(lead: Lead, items: string)` funksiya:
  ```
  🔔 YANGI ARIZA!
  
  👤 Mijoz: {name}
  📞 Telefon: {phone}
  📍 Manzil: {address || "Ko'rsatilmagan"}
  🛋 Tanlangan mebel(lar):
     - {items}
  📝 Izoh: {notes || "Yo'q"}
  📅 Sana: {date}
  ```
- [ ] `bot.api.sendMessage(FACTORY_CHANNEL_ID, message)` chaqirish
- [ ] Bu funksiya ham `POST /api/leads` dan chaqiriladi (web orqali keladiganlari uchun)

---

### 6.7 — Admin Bot: CRUD FSM Dialoglari

**Qadamlar:**
- [ ] **Kategoriya qo'shish** conversation:
  - UZ nom → RU nom (skip mumkin) → EN nom (skip mumkin) → Saqlash
- [ ] **Kategoriya o'chirish:** ro'yxatdan tanlash → tasdiq → o'chirish
- [ ] **Mebel qo'shish** conversation:
  - Kategoriya tanlash → Komplektga biriktirishmi? → Nom (UZ/RU/EN) → Tavsif → O'lcham → Material → Kafolat → Holat → Rasmlar (one-by-one, "Tayyor" tugmasi) → Saqlash
- [ ] **Mebel qidirish/tahrirlash:** nom bo'yicha qidiruv → tanlash → tahrirlash
- [ ] **Komplekt qo'shish:** nom (UZ/RU/EN) → tavsif → rasmlar → Saqlash
- [ ] Admin panel menyu (`/admin`):
  - Inline keyboard: Kategoriya, Mebel, Komplekt bo'limlari

---

### 6.8 — Live Chat Relay Tizimi

**Qadamlar:**
- [ ] `livechat.ts` handler — mijozdan kelgan har qanday erkin matn:
  - Mahsulot kartasi, ariza FSM da bo'lmagan holatda
  - Xabarni Support guruhiga forward qilish
  - `SupportMessage` DB jadvaliga `groupMessageId ↔ userTelegramId` saqlash
- [ ] Support guruhdan kelgan Reply xabarini ushlash:
  - `message.reply_to_message.message_id` → DB dan `userTelegramId` topish
  - Topilgan `userTelegramId` ga javob yuborish
- [ ] "Xabaringiz menejerimizga yuborildi! 📨" tasdiqi mijozga

---

### 6.9 — Kun 6 Tekshiruvi

- [ ] `npx tsc --noEmit` (bot uchun) — 0 xatolik
- [ ] `/start` → menyu ko'rinadi ✅
- [ ] Deep link ariza (to'liq 4 bosqich) ishlaydi ✅
- [ ] Lead DB ga `source: "BOT"` bilan saqlanadi ✅
- [ ] Kanal xabarnoma ketadi ✅
- [ ] Live Chat relay ishlaydi ✅
- [ ] Admin CRUD (kategoriya, mebel) ishlaydi ✅
- [ ] `PROJECT_STATE.md` yangilash (Kun 6 → ✅)

---

**⏱ Taxminiy vaqt:** 9–11 soat  
**📦 Output:** To'liq Telegram Bot (Mijoz + Admin + Live Chat + Kanal)

---

---

# 📅 KUN 7 — Integratsiya, Deploy va Final QA

> **Sana:** 2026-09-27 | **Skill:** `.agents/skills/deploy-production/SKILL.md`  
> **Maqsad:** Barcha komponentlar birlashtiriladi, production ga deploy qilinadi, final QA.

---

## ✅ Qadamlar

### 7.1 — Web-Dan Kanal Xabarnomasi Ulash

**Qadamlar:**
- [ ] `POST /api/leads` endpointiga `sendLeadNotification` chaqiruvini qo'shish
- [ ] Bot API ni web serverdan chaqirish uchun shared `telegram-client.ts` utility
- [ ] Web saytdan ketgan ariza ham `FACTORY_CHANNEL_ID` ga yetib borishi tekshiriladi
- [ ] Rate limit (flood protection) qo'shish: xatolikda graceful degradation

---

### 7.2 — End-to-End Integratsiya Testlari

**Scenariy 1 — Web Ariza:**
- [ ] Saytdan mebel tanla → Ariza qoldirish modal → Yuborish
- [ ] DB da Lead `source: "WEB"` bilan saqlanganmi? ✅
- [ ] Telegram kanalda xabarnoma kelganmi? ✅
- [ ] Admin panelda arizalar jadvalida ko'ringanmi? ✅

**Scenariy 2 — Bot Ariza:**
- [ ] `/start` → Katalog → Mebel → Ariza berish → 4 bosqich
- [ ] DB da Lead `source: "BOT"` bilan saqlanganmi? ✅
- [ ] Telegram kanalda xabarnoma kelganmi? ✅
- [ ] Admin panelda ko'ringanmi? ✅

**Scenariy 3 — Deep Link:**
- [ ] Saytdan "Telegram orqali buyurtma" → Bot ochiladi → Mebel ko'rinadi → Ariza ✅

**Scenariy 4 — Live Chat:**
- [ ] Bot ga erkin savol yoz → Support guruhida xabar ko'rindi? ✅
- [ ] Support guruhda Reply yoz → Bot orqali mijozga yetdi? ✅

**Scenariy 5 — Admin Panel CRUD:**
- [ ] Login → Kategoriya qo'sh → Ko'rindi? ✅
- [ ] Mebel qo'sh (rasm bilan) → Vitrinada ko'rindi? ✅
- [ ] Komplekt qo'sh → Komplektlar sahifasida ko'rindi? ✅

---

### 7.3 — TypeScript va Build Tekshiruvi

**Qadamlar:**
- [ ] `npx tsc --noEmit` (web) — 0 xatolik
- [ ] `npx tsc --noEmit` (bot) — 0 xatolik
- [ ] `npm run lint` — 0 xatolik
- [ ] `npm run build` — muvaffaqiyatli build
- [ ] `console.log` larni qidirish va o'chirish:
  ```bash
  grep -r "console.log" src/ apps/
  ```

---

### 7.4 — Vercel Deploy (Web App)

**Qadamlar:**
- [ ] Vercel CLI o'rnatish: `npm i -g vercel`
- [ ] `vercel login`
- [ ] `vercel --prod`
- [ ] Vercel dashboard da environment variables qo'shish:
  - `DATABASE_URL` (production PostgreSQL)
  - `JWT_SECRET`
  - `TELEGRAM_BOT_TOKEN`
  - `FACTORY_CHANNEL_ID`
  - `CLOUDINARY_*`
  - `NEXT_PUBLIC_BOT_USERNAME`
  - `NEXT_PUBLIC_BASE_URL`
- [ ] Custom domain ulash (agar mavjud bo'lsa)
- [ ] `https://your-domain.com` da ochilishini tekshirish

---

### 7.5 — VPS Deploy (Bot + PostgreSQL, Docker)

**Qadamlar:**
- [ ] `docker-compose.yml` yaratish:
  ```yaml
  services:
    db:
      image: postgres:15
      restart: always
      environment:
        POSTGRES_DB: mebel_db
        POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      volumes:
        - pgdata:/var/lib/postgresql/data
    bot:
      build: ./apps/bot
      restart: always
      depends_on: [db]
      env_file: .env
  volumes:
    pgdata:
  ```
- [ ] VPS da Docker va Docker Compose o'rnatish
- [ ] `.env` production faylini VPS ga nusxalash (SSH orqali)
- [ ] `docker compose up -d --build`
- [ ] `npx prisma migrate deploy` (production DB uchun)
- [ ] `npm run db:seed` — Admin user yaratish
- [ ] Bot loglarini tekshirish: `docker logs bot -f`

---

### 7.6 — Telegram Webhook Sozlash

**Qadamlar:**
- [ ] Vercel URL tayyor bo'lgach, webhook o'rnatish:
  ```
  https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://your-domain.com/api/bot/webhook
  ```
- [ ] `app/api/bot/webhook/route.ts` endpoint yaratish (bot webhookni qabul qiladi)
- [ ] Webhook o'rnatilganini tekshirish:
  ```
  https://api.telegram.org/bot<TOKEN>/getWebhookInfo
  ```

---

### 7.7 — Final QA Checklist

**Funksionallik:**
- [ ] Barcha 4 sahifa (Bosh, Katalog, Komplektlar, Aloqa) ochiladi
- [ ] 3 tilda (UZ/RU/EN) sahifalar to'g'ri ko'rinadi
- [ ] Dark/Light mode ishlaydi (barcha sahifalarda)
- [ ] Mobile (375px) da ko'rinish to'g'ri
- [ ] Tablet (768px) da ko'rinish to'g'ri
- [ ] Desktop (1280px) da ko'rinish to'g'ri

**Admin Panel:**
- [ ] Login/Logout ishlaydi
- [ ] Barcha CRUD operatsiyalar ishlaydi
- [ ] Rasm upload ishlaydi
- [ ] Arizalar jadvali ko'rinadi

**Telegram Bot:**
- [ ] `/start` ishlaydi
- [ ] Ariza FSM ishlaydi
- [ ] Admin buyruqlari ishlaydi (ADMIN_IDS tekshiruvi bilan)
- [ ] Live Chat ishlaydi
- [ ] Kanal xabarnoma keladi

**Xavfsizlik:**
- [ ] `/api/admin/*` endpointlar autentifikatsiyasiz 401 qaytaradi
- [ ] `.env` git da yo'q (`git log --all --full-history -- .env`)
- [ ] Bot admin faqat `ADMIN_TELEGRAM_IDS` dan kiradi

---

### 7.8 — Bug Fix va Polish

**Qadamlar:**
- [ ] Topilgan barcha buglarni tuzatish
- [ ] Loading holatlari barcha joy qo'shilganmi?
- [ ] Empty state (bo'sh holat) barcha jadval/gridlarda bormi?
- [ ] 404 sahifasi (`not-found.tsx`) bormi?
- [ ] Error sahifasi (`error.tsx`) bormi?
- [ ] Meta teglari (title, description) barcha sahifada bormi?

---

### 7.9 — Hujjatlar Yangilash

**Qadamlar:**
- [ ] `CHANGELOG.md` — v1.0.0 MVP release yozish
- [ ] `PROJECT_STATE.md` — barcha komponentlar 100% belgilash
- [ ] `docs/DEPLOYMENT.md` — production URL va deploy qadamlari yangilash
- [ ] `README.md` — skrinshotlar qo'shish (agar vaqt bo'lsa)

---

### 7.10 — Kun 7 Final Tekshiruvi

- [ ] Production sayt ochiladi va ishlaydi ✅
- [ ] Bot production da webhook orqali ishlaydi ✅
- [ ] End-to-end ariza oqimi ishlaydi ✅
- [ ] `PROJECT_STATE.md` barcha ✅ lar bilan to'ldiriladi

---

**⏱ Taxminiy vaqt:** 8–10 soat  
**📦 Output:** 🎉 To'liq ishlaydigan MVP — production ga deploy qilingan!

---

---

## 📋 Umumiy Progress Tracker

| Kun | Asosiy Mavzu | Holat | Sana |
|-----|-------------|-------|------|
| **Kun 1** | Infratuzilma + DB + Config | ⬜ Boshlanmagan | 2026-09-21 |
| **Kun 2** | Admin Auth + Kategoriyalar + Mebellar | ⬜ Boshlanmagan | 2026-09-22 |
| **Kun 3** | Komplektlar + Arizalar + Upload | ⬜ Boshlanmagan | 2026-09-23 |
| **Kun 4** | Vitrina + Katalog + i18n | ⬜ Boshlanmagan | 2026-09-24 |
| **Kun 5** | Komplektlar + Tanlovlar + Ariza Modal | ⬜ Boshlanmagan | 2026-09-25 |
| **Kun 6** | Telegram Bot (Mijoz + Admin + Live Chat) | ⬜ Boshlanmagan | 2026-09-26 |
| **Kun 7** | Deploy + QA + Polish | ⬜ Boshlanmagan | 2026-09-27 |

---

## 🔗 Bog'liq Hujjatlar

| Hujjat | Manzil | Maqsad |
|--------|--------|--------|
| PRD v2.0 | [`mebel web site PRD v2.0.md`](./mebel%20web%20site%20PRD%20v2.0.md) | Asosiy talablar |
| Sprint Tracker | [`PROJECT_STATE.md`](./PROJECT_STATE.md) | Kunlik progress |
| Arxitektura | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Tizim tuzilmasi |
| DB Hujjat | [`docs/DATABASE.md`](./docs/DATABASE.md) | Prisma schema |
| API Hujjat | [`docs/API.md`](./docs/API.md) | Endpoint ro'yxati |
| Setup | [`docs/SETUP.md`](./docs/SETUP.md) | O'rnatish qo'llanma |
| Deploy | [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Deploy qo'llanma |
| Bot Hujjat | [`docs/TELEGRAM_BOT.md`](./docs/TELEGRAM_BOT.md) | Bot buyruqlari |
| i18n | [`docs/I18N.md`](./docs/I18N.md) | Ko'p tillilik |
| Kodlash | [`docs/CODING_STANDARDS.md`](./docs/CODING_STANDARDS.md) | Kod standartlari |
| ENV | [`docs/ENV_VARIABLES.md`](./docs/ENV_VARIABLES.md) | Muhit o'zgaruvchilari |
| Admin Panel | [`docs/ADMIN_PANEL.md`](./docs/ADMIN_PANEL.md) | Admin qo'llanma |

---

## ⚡ Tez Eslatmalar (Quick References)

### Har Kuni Majburiy
```bash
npx tsc --noEmit          # TypeScript xatolik yo'q
npm run lint              # ESLint tekshiruvi
npm run build             # Build muvaffaqiyatli
```

### Muhim Qoidalar (AGENTS.md dan)
- ❌ `any` type ishlatilmasin → `unknown` yoki aniq tiplar
- ❌ `console.log` production kodda qolmasin
- ❌ Inline styles → faqat Tailwind CSS
- ❌ Hardcoded matnlar → faqat `next-intl`
- ❌ Hardcoded narxlar → narx YO'Q
- ✅ Barcha API: `{ success: true/false, data/error }`
- ✅ Barcha forma: `react-hook-form` + `zod`
- ✅ Barcha admin endpoint: JWT tekshiruvi

---

*MVP Roadmap v1.0 — 2026-09-20 | Deadline: 2026-09-27*
