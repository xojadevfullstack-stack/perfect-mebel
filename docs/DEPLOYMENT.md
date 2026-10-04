# Production Deployment Guide (Mebel Salon)

Ushbu qo'llanma Mebel Salon loyihasini ishlab chiqarish (production) muhitiga to'liq va xatosiz joylashtirish bo'yicha bosqichma-bosqich yo'riqnomadir.

---

## 🏛 Arxitektura Umumiy Ko'rinishi

| Qatlam | Xizmat / Platforma | Tavsif & Sozlama |
| :--- | :--- | :--- |
| **Web Vitrina & Admin** | **Vercel** (`apps/web`) | Next.js 14 App Router, Serverless / Edge Functions |
| **Telegram Bot** | **Render** (`apps/bot`) | Background Worker (bitta instansiya, Polling rejimida) |
| **Ma'lumotlar Bazasi** | **Neon PostgreSQL** | Serverless Postgres (Pooled URL + Direct Migration URL) |
| **Media Storage** | **Supabase Storage** | Mahsulot rasmlari uchun public bucket (`products`) |
| **Xabarnomalar** | **Telegram Bot API** | Web o'zi bevosita ariza tushganda kanalga yuboradi (bot qulasa ham yo'qolmaydi) |

---

## 1. Neon PostgreSQL Sozlash

Neon boshqaruv panelida (`console.neon.tech`):
1. Yangi loyiha (Project) yarating.
2. Dashboard'dan **Connect** tugmasini bosing va **2 xil ulanish satrini** oling:
   - **`DATABASE_URL` (Pooled):** `ep-*-pooler.aws.neon.tech` bilan tugaydi. Vercel va Render'da doimiy so'rovlar uchun ishlatiladi.
   - **`DIRECT_URL` (Direct / Non-pooled):** `-pooler` bo'lmagan to'g'ridan-to'g'ri ulanish. Faqat migratsiyalar (`prisma migrate deploy`) uchun ishlatiladi.

### Prisma konfiguratsiyasi (`packages/db/prisma/schema.prisma`):
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

### Migratsiya va Boshlang'ich Ma'lumotlar (Seed):
Migratsiyalarni Vercel ichida emas, o'z kompyuteringizdan bir marta ishga tushiring:

```bash
# Migratsiyalarni production bazaga qo'llash
DATABASE_URL="<DIRECT_URL>" DIRECT_URL="<DIRECT_URL>" pnpm --filter @mebel-salon/db exec prisma migrate deploy

# Faqat yangi bo'sh bazada (boshlang'ich toifalar va admin yaratish):
DATABASE_URL="<DIRECT_URL>" DIRECT_URL="<DIRECT_URL>" pnpm --filter @mebel-salon/db exec tsx prisma/seed.ts
```

---

## 2. Vercel Sozlash (Web Vitrina & Admin)

1. [vercel.com](https://vercel.com) da **Add New Project** tugmasini bosing va GitHub reponi tanlang.
2. **Project Settings**:
   - **Framework Preset:** `Next.js`
   - **Root Directory:** `apps/web`
   - **Include source files outside of the Root Directory:** ✅ **YOQILGAN** bo'lishi shart (chunki monorepoda `packages/db` va `packages/shared` ishlatiladi).
3. **Build & Development Settings**:
   - **Install Command:** `pnpm install --frozen-lockfile`
   - **Build Command:** `pnpm --filter @mebel-salon/db generate && pnpm --filter @mebel-salon/web build`
4. **Environment Variables** (Vercel Project Settings → Environment Variables):
   - `DATABASE_URL`: Neon pooled connection string
   - `DIRECT_URL`: Neon direct connection string
   - `JWT_SECRET`: 32+ belgidan iborat tasodifiy maxfiy kalit (`openssl rand -base64 32`)
   - `ADMIN_INITIAL_PASSWORD`: Admin yaratish paroli (agar kerak bo'lsa)
   - `TELEGRAM_BOT_TOKEN`: BotFather bergan bot tokeni
   - `TELEGRAM_FACTORY_CHANNEL_ID`: Zavod kanali ID si (masalan, `-1001234567890`)
   - `TELEGRAM_SUPPORT_GROUP_ID`: Mijozlar bilan jonli chat guruhi ID si (ixtiyoriy)
   - `NEXT_PUBLIC_APP_URL`: Vercel bergan URL yoki o'z domeningiz (masalan, `https://mebelsalon.uz`)
   - `NEXT_PUBLIC_BOT_USERNAME`: Telegram botingiz username'i (`@` belgisisiz, masalan, `mebel_salon_bot`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase loyihasi URL'i
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service_role key

> **Eslatma:** Agar Vercel build paytida Prisma query engine topilmasa, `apps/web/next.config.mjs` da `outputFileTracingRoot` sozlamasi tekshiriladi va generatorga `binaryTargets = ["native", "rhel-openssl-3.0.x"]` qo'shiladi.

---

## 3. Render Sozlash (Telegram Bot)

Bot alohida jarayonda **Polling** rejimida to'xtovsiz ishlashi uchun Render'da **Background Worker** sifatida ishga tushiriladi:

1. [render.com](https://render.com) da **New +** → **Background Worker** ni tanlang.
2. GitHub reponi ulang.
3. Sozlamalar:
   - **Name:** `mebel-salon-bot`
   - **Root Directory:** *(bo'sh qoldiring — repo ildizi)*
   - **Environment:** `Node`
   - **Build Command:**
     ```bash
     corepack enable && pnpm install --frozen-lockfile && pnpm --filter @mebel-salon/db generate
     ```
   - **Start Command:**
     ```bash
     pnpm --filter @mebel-salon/bot start
     ```
   - **Plan:** Background Worker (bitta instansiya / 1 instance)
4. **Environment Variables**:
   - `DATABASE_URL`: Neon pooled connection string
   - `TELEGRAM_BOT_TOKEN`: BotFather bergan bot tokeni
   - `TELEGRAM_FACTORY_CHANNEL_ID`: Zavod kanali ID si
   - `TELEGRAM_SUPPORT_GROUP_ID`: Qo'llab-quvvatlash guruhi ID si
   - `ADMIN_TELEGRAM_IDS`: Bot adminlari Telegram ID lari (vergul bilan ajratilgan, masalan `1234567,9876543`)
   - `NEXT_PUBLIC_APP_URL`: Web sayt manzili
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase loyihasi URL'i
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

> **⚠️ Muhim xavfsizlik va barqarorlik eslatmalari:**
> 1. **409 Conflict xatosi bo'lmasligi uchun:** Bitta tokenda faqat BITTA polling jarayon ishlashi shart. Render'da botni ishga tushirishdan oldin o'z kompyuteringizdagi lokal bot jarayonini o'chiring!
> 2. **Instansiyalar soni:** Render'da bot instansiyasi doimo **1** ta bo'lishi kerak.
> 3. **Bepul Web Service cheklovi:** Render'da bepul Web Service harakatsizlikdan so'ng uxlaydi (sleep), shu sababli Bot polling uchun Background Worker yoki webhook arxitekturasi tavsiya etiladi.

---

## 4. GitHub Actions (CI Tekshiruv Workflow)

Pull Request yoki Main branch ga commit qilinganda xatoliklarni oldindan ushlash uchun `.github/workflows/ci.yml`:

```yaml
name: CI Quality Gate

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Generate Prisma Client
        run: pnpm --filter @mebel-salon/db generate

      - name: Type-Check
        run: pnpm type-check

      - name: Build Web
        run: pnpm --filter @mebel-salon/web build
        env:
          DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
          DIRECT_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
          JWT_SECRET: "dummy-secret-at-least-32-chars-long-here-1234"
          TELEGRAM_BOT_TOKEN: "123:dummy"
          TELEGRAM_FACTORY_CHANNEL_ID: "-100123"
```

---

## 5. Deploydan Keyingi Smoke Test (Tekshirishlar)

1. **Web Vitrina:**
   - Brauzerda saytga kiring (`/uz`, `/ru`, `/en`).
   - Tilni almashtiring va dark/light rejimini tekshiring.
   - Katalog sahifasida toifalar bo'yicha filtrlash (`/uz/catalog?category=...`) ishlashini tekshiring.
2. **Lead (Ariza) Yuborish Testi:**
   - Web modal orqali `Ali_<b>*[x` ismi va telefon bilan ariza qoldiring.
   - Zavod kanaliga (`TELEGRAM_FACTORY_CHANNEL_ID`) xabar chiroyli formatda va buzilmasdan yetib borganini tekshiring.
3. **Telegram Bot Testi:**
   - Botga `/start` buyrug'ini yuboring.
   - Web'dagi har qanday mebel sahifasidan Telegram deep-link tugmasi orqali botga o'ting.
   - Bot orqali ariza topshiring va kanalga tushganini tekshiring.
4. **Admin Panel Testi:**
   - `/admin/login` sahifasiga o'ting va tizimga kiring.
   - Barcha tushgan arizalar (leads), katalog va kolleksiyalar to'g'ri ko'rinayotganini tasdiqlang.
   - Yangi rasm yuklash (Supabase orqali) xatosiz ishlashini tekshiring.
