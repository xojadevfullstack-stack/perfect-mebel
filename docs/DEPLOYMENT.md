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
Migratsiyalarni Vercel/Render build jarayonida emas, alohida mustaqil tarzda `DIRECT_URL` orqali ishga tushiring. 
> **Nima uchun `DIRECT_URL`?** Neon yoki Supabase pooled connection string (`DATABASE_URL`, masalan port 6543) PgBouncer orqali ishlaydi va PostgreSQL transactional advisory lock yoki DDL operatsiyalarini qo'llab-quvvatlamaydi. Shuning uchun migratsiyalar faqat `DIRECT_URL` (to'g'ridan-to'g'ri 5432-port) orqali yurgiziladi.

```bash
# 1. Barcha migratsiyalarni (shu jumladan RateLimit jadvalini) production bazaga qo'llash:
DATABASE_URL="<DIRECT_URL>" DIRECT_URL="<DIRECT_URL>" pnpm --filter @mebel-salon/db exec prisma migrate deploy

# 2. Yangi bo'sh bazada boshlang'ich ma'lumotlar (kategoriyalar va admin) yaratish:
# Eslatma: seed.ts agar admin mavjud bo'lsa, uning parolini o'zgartirmaydi (update: {}).
DATABASE_URL="<DIRECT_URL>" DIRECT_URL="<DIRECT_URL>" pnpm --filter @mebel-salon/db exec tsx prisma/seed.ts

# 3. Mavjud admin parolini xavfsiz yangilash:
# Parol faqat environment o'zgaruvchisidan olinadi (hech qanday standart/hardcoded qiymat yo'q):
ADMIN_PASSWORD="sizning-kuchli-yangi-parolingiz" pnpm admin:reset-password
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
   - `ADMIN_INITIAL_PASSWORD`: Yangi admin yaratish paroli (faqat seed paytida)
   - `TELEGRAM_BOT_TOKEN`: BotFather bergan bot tokeni
   - `TELEGRAM_WEBHOOK_SECRET`: Webhook so'rovlarini himoyalash maxfiy tokeni (`openssl rand -hex 24`)
   - `TELEGRAM_FACTORY_CHANNEL_ID`: Zavod kanali ID si (masalan, `-1001234567890`)
   - `TELEGRAM_SUPPORT_GROUP_ID`: Mijozlar bilan jonli chat guruhi ID si (ixtiyoriy)
   - `NEXT_PUBLIC_APP_URL`: Vercel bergan URL yoki o'z domeningiz (masalan, `https://mebelsalon.uz`)
   - `NEXT_PUBLIC_BOT_USERNAME`: Telegram botingiz username'i (`@` belgisisiz, masalan, `mebel_salon_bot`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase loyihasi URL'i
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase service_role key

> **Eslatma:** Agar Vercel build paytida Prisma query engine topilmasa, `apps/web/next.config.mjs` da `outputFileTracingRoot` sozlamasi tekshiriladi va generatorga `binaryTargets = ["native", "rhel-openssl-3.0.x"]` qo'shiladi.

### Webhook Sozlash (Vercel orqali bepul 24/7 ishlash):
Agar Render o'rniga Vercel orqali bepul webhook ishlatmoqchi bo'lsangiz:
1. Vercel muhitiga `TELEGRAM_WEBHOOK_SECRET` ni qo'shing.
2. Vercel deploy yakunlangach, terminaldan quyidagi skriptni yurgizing:
   ```bash
   pnpm bot:set-webhook
   ```
   Bu skript avtomatik ravishda `https://<sizning-saytingiz>/api/bot` manziliga webhook o'rnatadi.

> **⚠️ Webhook va Lokal Ishlab Chiqish (Muhim Qoida):**
> - **Lokal Dev bot uchun ALOHIDA bot tokeni kerak:** Agar kompyuteringizda `pnpm dev:bot` yurgizsangiz, grammY (`bot.start()`) avtomatik tarzda Telegram serveridan `deleteWebhook` chaqiradi va production webhook'ingizni o'chirib qo'yadi! Shuning uchun lokal dev uchun `@BotFather` dan alohida test boti oching (`DEV_BOT_TOKEN`).
> - **Webhook rejimida Polling ishga tushirilmasin:** Agar Vercel orqali webhook ishlayotgan bo'lsa, Render yoki VPS da `apps/bot` polling jarayoni bir vaqtning o'zida ISHLATILMASLIGI SHART (Telegram 409 Conflict beradi).

---

## 3. Render Sozlash (Telegram Bot — Faqat Polling varianti tanlansa)

Agar Vercel Webhook ishlatilmasa va bot alohida jarayonda **Polling** rejimida to'xtovsiz ishlashi kerak bo'lsa, Render'da **Background Worker** sifatida ishga tushiriladi:

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
> 1. **409 Conflict xatosi bo'lmasligi uchun:** Bitta tokenda faqat BITTA polling jarayon ishlashi shart. Agar Vercel webhook sozlangan bo'lsa, Render bot to'xtatilgan bo'lishi shart!
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
