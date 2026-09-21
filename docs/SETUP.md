# Mebel Salon - Development Setup Guide

Ushbu qo'llanma Mebel Salon (online mebel magazin) loyihasini mahalliy kompyuteringizda (local environment) ishga tushirish bo'yicha bosqichma-bosqich ko'rsatmalarni o'z ichiga oladi.

## 1. System Requirements (Tizim talablari)

Loyihani ishga tushirish uchun quyidagi dasturlar o'rnatilgan bo'lishi kerak:
- **Node.js**: v20.x yoki undan yuqori
- **Paket menejeri**: `pnpm` (tavsiya etiladi, `npm install -g pnpm` orqali o'rnatiladi)
- **Ma'lumotlar bazasi**: PostgreSQL 15+
- **Docker va Docker Compose**: (ixtiyoriy, DB va botni izolyatsiyada yurgizish uchun)
- **Git**: Kodni boshqarish uchun

## 2. IDE Setup (Dasturlash muhiti)

Tavsiya etilgan IDE: **Visual Studio Code (VS Code)**.

Kerakli kengaytmalar (Extensions):
- **ESLint**: Kod xatolarini topish va to'g'rilash
- **Prettier - Code formatter**: Kodni bir xil stilda formatlash
- **Tailwind CSS IntelliSense**: Tailwind sinflarini avtomatik to'ldirish
- **Prisma**: Prisma schema fayllari uchun sintaksis va formatlash
- **DotENV**: `.env` fayllari uchun sintaksis

## 3. Database Setup (Ma'lumotlar bazasini sozlash)

PostgreSQL ni o'rnatishning 2 xil usuli mavjud:

### Usul A: Docker orqali (Tavsiya etiladi)
Agar kompyuteringizda Docker o'rnatilgan bo'lsa, quyidagi buyruq orqali bazani ko'tarishingiz mumkin:
```bash
docker run --name mebel-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=mebel_db -p 5432:5432 -d postgres:15-alpine
```

### Usul B: Local o'rnatish
Windows uchun PostgreSQL rasmiy saytidan o'rnatuvchi dasturni yuklab oling va o'rnating. PgAdmin orqali `mebel_db` nomli yangi baza yarating.

## 4. Supabase Setup (Rasmlar uchun Storage)

Loyiha rasmlarni saqlash uchun Supabase Storage (yoki Cloudinary) ishlatadi.
1. [Supabase](https://supabase.com) saytida ro'yxatdan o'ting va yangi loyiha yarating.
2. Chap menyudan "Storage" bo'limiga o'ting.
3. `mebel-images` (yoki o'zingiz xohlagan nom) bilan yangi Public Bucket yarating.
4. "Project Settings" -> "API" bo'limidan `URL` va `anon / public` kalitlarini oling (Ular `.env` faylga yoziladi).

## 5. Telegram Bot Setup (Telegram Bot sozlash)

1. Telegramda `@BotFather` ga kiring.
2. `/newbot` buyrug'ini yuboring va botga nom va username bering.
3. BotFather bergan **HTTP API Token** ni saqlab qo'ying (bu `TELEGRAM_BOT_TOKEN`).
4. Yangi xususiy (private) Telegram Channel yarating (Yangi lead'lar tushishi uchun).
5. Yangi xususiy (private) Telegram Group yarating (Support chat uchun).
6. Botni kanal va guruhga **Admin** qilib qo'shing.
7. Kanal va guruhning ID larini oling (Buning uchun web.telegram.org yoki `@RawDataBot` kabi botlardan foydalanishingiz mumkin). Guruh/kanal ID lari odatda `-100...` bilan boshlanadi.

## 6. Environment Variables (Muhit o'zgaruvchilari)

Loyihaning root papkasida `.env` faylini yarating. Barcha kerakli o'zgaruvchilar haqida batafsil ma'lumotni [ENV_VARIABLES.md](./ENV_VARIABLES.md) faylidan topishingiz mumkin.

## 7. Installation & Migration (O'rnatish va Migratsiya)

Loyihani klonlaganingizdan va `.env` faylini yaratganingizdan so'ng terminalda quyidagi buyruqlarni bajaring:

```bash
# 1. Qaramliklarni o'rnatish
pnpm install

# 2. Prisma migratsiyalarini qo'llash (jadvallarni yaratish)
pnpm prisma migrate dev --name init

# 3. Prisma client ni generatsiya qilish
pnpm prisma generate
```

## 8. Running the Project (Loyihani ishga tushirish)

### Web qismini ishga tushirish
```bash
pnpm dev
```
Sayt `http://localhost:3000` manzilida ishga tushadi.

### Telegram Bot qismini ishga tushirish
Botni alohida jarayon sifatida ishga tushirishingiz kerak. Odatda loyihada bot uchun alohida script bo'ladi:
```bash
pnpm bot:dev
```
Yoki ikkalasini birgalikda ishga tushirish uchun (agar `package.json` da `dev:all` kabi script bo'lsa):
```bash
pnpm dev:all
```

## 9. Common Issues and Troubleshooting (Ko'p uchraydigan muammolar)

- **Prisma "Database connection error"**: PostgreSQL ishlayotganiga va `.env` dagi `DATABASE_URL` to'g'ri ekanligiga ishonch hosil qiling. Agar Docker ishlatsangiz, konteyner "running" holatda ekanligini tekshiring (`docker ps`).
- **Bot javob bermayapti**: BotToken xato kiritilmaganini va kompyuteringizda internet tarmog'i cheklanmaganini tekshiring (VPN kerak bo'lishi mumkin).
- **Rasm yuklanmayapti**: Supabase bucket public ekanligini va RLS (Row Level Security) siyosatlari ruxsat berishini tekshiring.

## 10. Development Tips (Dasturlash bo'yicha maslahatlar)

- Prisma schema fayliga (`schema.prisma`) o'zgartirish kiritgandan so'ng, albatta `pnpm prisma migrate dev --name o'zgarish_nomi` ni yurgizing.
- UI komponentlar yaratish uchun shadcn/ui CLI ishlatiladi: `pnpm dlx shadcn-ui@latest add [component-name]`.
- Ko'p tillilik (i18n) lug'atlari `/messages` yoki `/locales` papkasida (UZ/RU/EN) joylashgan. Yangi tekst qo'shganda barcha fayllarga birdek qo'shishni unutmang.
