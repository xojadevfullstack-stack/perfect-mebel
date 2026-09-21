# Mebel Salon — Agent Qoidalari (AGENTS.md)

> Bu fayl AI agent (Antigravity) ga loyiha bo'yicha ishlashda qanday qoidalarga amal qilish kerakligini belgilaydi.

---

## 🏗 Loyiha Haqida

Bu loyiha — zamonaviy mebel ishlab chiqaruvchi korxona uchun **narxlarsiz onlayn vitrina**, **Web Admin Panel**, **Telegram Bot** va **Telegram xizmatlari** (kanal + guruh) dan iborat yaxlit tizim.

**PRD manba fayllar:**
- `mebel web site PRD v2.0.md` — Tasdiqlangan yakuniy PRD
- `mebel web site PRD.md` — Eski v1.0 (faqat tarix uchun)

---

## 📐 Texnologiya Steki — Qat'iy Qoidalar

Agent quyidagi texnologiyalardan foydalanishi **SHART**:

| Qatlam | Texnologiya | Muqobil YO'Q |
|--------|------------|--------------|
| Frontend | **Next.js 14+ (App Router)** | Pages Router ISHLATILMASIN |
| Til | **TypeScript (strict mode)** | JavaScript ISHLATILMASIN |
| Stil | **Tailwind CSS** | CSS modules, styled-components ISHLATILMASIN |
| UI Komponentlar | **shadcn/ui** | Material UI, Ant Design ISHLATILMASIN |
| Dark/Light Mode | **next-themes** | Custom implementation ISHLATILMASIN |
| i18n | **next-intl** | next-i18next, react-intl ISHLATILMASIN |
| ORM | **Prisma** | TypeORM, Sequelize, Drizzle ISHLATILMASIN |
| DB | **PostgreSQL** | MySQL, MongoDB ISHLATILMASIN |
| Telegram Bot | **grammY** | node-telegram-bot-api, Telegraf ISHLATILMASIN |
| Bot FSM | **@grammyjs/conversations** | Boshqa FSM kutubxona ISHLATILMASIN |
| Validatsiya | **zod** | yup, joi ISHLATILMASIN |
| Forma | **react-hook-form** | formik ISHLATILMASIN |
| State | **zustand** | Redux, MobX, Jotai ISHLATILMASIN |

---

## 🚫 Qat'iy Cheklovlar

1. **Narx ko'rsatilmasin** — sayt va botda hech qayerda narx, chegirma, to'lov mexanizmi bo'lmasin.
2. **`any` type ishlatilmasin** — TypeScript da `unknown`, aniq tiplar yoki generics ishlatilsin.
3. **`console.log` production kodda qolmasin** — faqat development uchun, commit oldidan o'chirilsin.
4. **Inline styles ishlatilmasin** — faqat Tailwind CSS classlari.
5. **`var` ishlatilmasin** — faqat `const` va `let`.
6. **Hardcoded stringlar UI da bo'lmasin** — barcha matnlar `next-intl` orqali tarjima fayllaridan olinsin.
7. **Hardcoded ranglar bo'lmasin** — Tailwind theme va CSS variables orqali dark/light mode qo'llab-quvvatlansin.
8. **`.env` fayllar git ga qo'shilmasin** — faqat `.env.example` commit qilinsin.

---

## 📁 Fayl Nomlash Qoidalari

| Tur | Format | Misol |
|-----|--------|-------|
| Sahifalar, komponentlar fayli | `kebab-case.tsx` | `product-card.tsx` |
| React komponent nomi | `PascalCase` | `ProductCard` |
| Utility funksiyalar | `camelCase` | `formatPhoneNumber()` |
| Hook lar | `use` prefiksi + `PascalCase` | `useSelections()` |
| Prisma modellari | `PascalCase` singular | `Product`, `Category` |
| API route fayllar | `route.ts` | `app/api/products/route.ts` |
| i18n kalit nomlari | `camelCase` dot notation | `catalog.filterByCategory` |
| Env o'zgaruvchilari | `SCREAMING_SNAKE_CASE` | `DATABASE_URL` |

---

## 🌐 Ko'p Tillilik Qoidalari

- **3 til:** `uz` (asosiy / default), `ru`, `en`
- Barcha UI matnlari `messages/uz.json`, `messages/ru.json`, `messages/en.json` da bo'lsin.
- DB da mahsulot nomlari: `titleUz`, `titleRu`, `titleEn` — agar RU/EN bo'sh bo'lsa, UZ fallback sifatida ishlatilsin.
- URL tuzilishi: `/uz/catalog`, `/ru/catalog`, `/en/catalog`

---

## 🎨 Dark/Light Mode Qoidalari

- **next-themes** dan `useTheme()` ishlatilsin.
- Tailwind da `dark:` prefiksi bilan qo'llab-quvvatlansin.
- Ranglar faqat CSS variables orqali (`--background`, `--foreground`, `--primary`, etc.).
- shadcn/ui ning default theme tizimiga amal qilinsin.

---

## 🗃 Prisma Qoidalari

- `schema.prisma` dagi modellar PRD v2.0 da tasdiqlangan 6 ta model: `Category`, `Collection`, `Product`, `Lead`, `SupportMessage`, `AdminUser`.
- Yangi model qo'shish uchun avval PRD ga muvofiqligini tekshirish.
- Har bir DB o'zgarishda `npx prisma migrate dev --name descriptive_name` ishlatilsin.
- Transaksiyalar (`prisma.$transaction`) — bir-biriga bog'liq operatsiyalar uchun majburiy.

---

## 🔒 Xavfsizlik Qoidalari

- Admin Panel — JWT autentifikatsiya (`jose` kutubxonasi).
- Parollar — faqat `bcryptjs` bilan hash qilinsin (min 10 rounds).
- API route larda input validatsiya — har doim `zod` schema bilan.
- Telegram Bot Admin — faqat `ADMIN_TELEGRAM_IDS` ro'yxatidagi foydalanuvchilar uchun ochiq.
- CORS — faqat o'z domeni uchun ruxsat.
- Rasm upload — faqat `image/*` MIME type, max 5MB.

---

## 📦 Komponent Tuzilishi

Har bir React komponent quyidagi tartibda yozilsin:

```tsx
// 1. Importlar
import { ... } from "..."

// 2. Tiplar / Interfeyslari
interface ProductCardProps {
  ...
}

// 3. Komponent
export function ProductCard({ ... }: ProductCardProps) {
  // hooks
  // state
  // handlers
  // return JSX
}
```

---

## 🤖 Telegram Bot Qoidalari

- Bot framework: **grammY** (TypeScript).
- Admin tekshiruvi: har bir admin buyrug'ida `ADMIN_TELEGRAM_IDS` tekshirilsin.
- FSM dialoglar: `@grammyjs/conversations` orqali.
- Xatolik handling: barcha handler larda `try/catch` va foydalanuvchiga xato xabari.
- Kanal xabarnomasi: ariza saqlangandan keyin darhol `FACTORY_CHANNEL_ID` ga yuborilsin.
- Live Chat: `SupportMessage` jadvalida `groupMessageId ↔ userTelegramId` bog'liqligi saqlansin.

---

## 📝 API Response Formati

Barcha API endpointlar quyidagi formatda javob qaytarsin:

```typescript
// Muvaffaqiyatli
{ success: true, data: T }

// Xatolik
{ success: false, error: string }

// Ro'yxat (pagination bilan)
{ success: true, data: T[], meta: { total: number, page: number, limit: number } }
```

---

## 🧪 Test va Tekshirish

- Kod yozilgandan keyin TypeScript kompilyatsiya xatolari tekshirilsin (`npx tsc --noEmit`).
- Prisma schema o'zgarishlaridan keyin `npx prisma validate` ishlatilsin.
- Build tekshiruvi: `npm run build` muvaffaqiyatli bo'lishi shart.

---

## 📋 Muhim Eslatmalar

- **PRD v2.0 — asosiy hujjat.** Barcha qarorlar shu hujjatga asoslansin.
- **Narx YO'Q** — bu vitrina sayt, do'kon emas.
- **Lead = Ariza** — sayt va botdan keladigan har qanday so'rov.
- **Komplekt mebellar ikkita joyda ko'rinadi** — to'plamda ham, katalogda ham.
- **"Mening tanlovlarim"** — an'anaviy savat emas, lead yig'ish mexanizmi.
