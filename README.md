<div align="center">
  <img src="public/logo.png" alt="Mebel Salon Logo" width="150"/>
  <h1>Mebel Salon MVP</h1>
  <p>Online mebel jurnali (vitrina) va boshqaruv tizimi</p>

  [![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
</div>

## 📖 Loyiha haqida

Mebel Salon - bu mebel mahsulotlarini ko'rsatish va mijozlardan arizalar (leadlar) qabul qilish uchun mo'ljallangan zamonaviy veb-platforma. Platforma to'g'ridan-to'g'ri sotuvni amalga oshirmaydi (narxlar ko'rsatilmaydi), balki katalog vazifasini bajaradi. Mijozlar o'zlariga yoqqan mebellarni "Mening tanlovlarim" (My selections) savatchasiga qo'shib, maslahat uchun ariza qoldirishlari mumkin. Loyiha shuningdek Telegram bot va to'liq boshqaruv panelini o'z ichiga oladi.

## ✨ Asosiy imkoniyatlar

- 🪑 **Katalog va Vitrina**: Narxlarsiz mebel kolleksiyalari va mahsulotlar ko'rgazmasi.
- 📝 **Arizalar (Leads) tizimi**: Mijozlar yoqtirgan mebellari bo'yicha maslahat so'rashlari mumkin.
- 🛒 **"Mening tanlovlarim"**: Yoqtirgan mebellarni saqlash va ular uchun umumiy ariza jo'natish.
- ✅ **Interaktiv checklist**: Mebel kolleksiyalari uchun qulay tanlov varaqasi.
- 🤖 **Telegram Bot (Mijozlar uchun)**: Katalog bo'ylab harakatlanish va ariza qoldirish.
- 📱 **Telegram Bot (Adminlar uchun)**: FSM orqali mahsulotlarni CRUD qilish va boshqarish.
- 📢 **Telegram Xabarnomalar**: Yangi arizalar (leadlar) to'g'ridan-to'g'ri zavod kanaliga tushadi.
- 💬 **Live Chat Support**: Mijozlar bilan Telegram guruh orqali Reply usulida muloqot qilish.
- 💻 **Web Admin Panel**: Desktop orqali ma'lumotlarni to'liq boshqarish (CRUD va leadlar jadvali).
- 🌍 **Ko'p tillik (i18n)**: O'zbek (UZ), Rus (RU) va Ingliz (EN) tillarini qo'llab-quvvatlaydi.
- 🌓 **Dark/Light Mode**: Tungi va kunduzgi rejimlar.

## 🛠 Texnologiyalar steki

| Qism | Texnologiya |
| --- | --- |
| **Frontend** | Next.js 14+ (App Router), React, Tailwind CSS, shadcn/ui |
| **Backend / DB** | Prisma ORM, PostgreSQL |
| **Telegram Bot** | grammY (TypeScript) |
| **Fayllar saqlash**| Supabase Storage / Cloudinary |
| **Holat / Tillar** | next-themes, next-intl |
| **Infratuzilma** | Vercel (Web), VPS Docker (Bot) |

## 🚀 O'rnatish va ishga tushirish (Quick Start)

### Talablar
- Node.js (v18 yoki undan yuqori)
- PostgreSQL ma'lumotlar bazasi
- Telegram Bot Token (@BotFather'dan olingan)

### 1. Repozitoriyni klonlash
```bash
git clone https://github.com/your-org/online-mebel-magazin.git
cd online-mebel-magazin
```

### 2. Paketlarni o'rnatish
```bash
npm install
# yoki
yarn install
```

### 3. Muhit o'zgaruvchilari (Environment variables)
`.env.example` faylidan nusxa olib, `.env` faylini yarating va kerakli ma'lumotlarni to'ldiring:
```bash
cp .env.example .env
```
Asosiy o'zgaruvchilar:
- `DATABASE_URL`
- `TELEGRAM_BOT_TOKEN`
- `NEXT_PUBLIC_CLOUDINARY_URL` (yoki Supabase)

### 4. Ma'lumotlar bazasini tayyorlash
```bash
npx prisma generate
npx prisma db push
# yoki migratsiyalar uchun: npx prisma migrate dev
```

### 5. Loyihani ishga tushirish
Veb qism uchun:
```bash
npm run dev
```
Botni alohida ishga tushirish (agar kerak bo'lsa):
```bash
npm run bot:dev
```

Loyiha `http://localhost:3000` manzilida ishga tushadi.

## 📁 Loyiha strukturasi

```text
📦 online-mebel-magazin
 ┣ 📂 src
 ┃ ┣ 📂 app          # Next.js App Router (frontend & admin pages)
 ┃ ┣ 📂 components   # Qayta ishlatiluvchi UI komponentlar (shadcn)
 ┃ ┣ 📂 lib          # Utilitalar, Prisma client
 ┃ ┣ 📂 bot          # grammY Telegram bot mantiqi
 ┃ ┣ 📂 i18n         # next-intl tarjima konfiguratsiyalari
 ┃ ┗ 📂 types        # TypeScript tiplari
 ┣ 📂 prisma         # Prisma schema va migratsiyalar
 ┣ 📂 public         # Statik fayllar (rasmlar, ikonlar)
 ┣ 📂 docs           # Qo'shimcha hujjatlar
 ┣ 📜 .env           # Muhit o'zgaruvchilari
 ┣ 📜 package.json   
 ┗ 📜 README.md      
```

## 📜 Skriptlar (Scripts)

| Buyruq | Ta'rif |
| --- | --- |
| `npm run dev` | Veb ilovani development rejimida ishga tushiradi |
| `npm run build` | Loyihani production uchun build qiladi |
| `npm start` | Build qilingan loyihani ishga tushiradi |
| `npm run lint` | ESLint tekshiruvini amalga oshiradi |
| `npm run bot:dev` | Telegram botni lokal ravishda ishga tushiradi |

## 🖼 Skrinshotlar

*Hozircha bo'sh. Tez orada ilovaning skrinshotlari shu yerga joylanadi.*

> Skrinshot joylash uchun: `![Sahifa nomi](/docs/images/screenshot1.png)`

## 📚 Qo'shimcha hujjatlar

Batafsil ma'lumot uchun `docs/` papkasidagi hujjatlarga qarang:
- [Hissa qo'shish qoidalari (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Bot arxitekturasi](/docs/bot-architecture.md)
- [Ma'lumotlar bazasi strukturasi](/docs/database.md)

## 📄 Litsenziya

Bu loyiha [MIT Litsenziyasi](LICENSE) ostida tarqatiladi.

## 👥 Jamoa va Aloqa

- **Loyiha menejeri**: [Ism/Username](https://t.me/username)
- **Texnik qo'llab-quvvatlash**: [Support Group](https://t.me/mebel_support)
