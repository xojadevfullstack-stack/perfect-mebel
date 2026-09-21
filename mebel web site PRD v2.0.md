# Mahsulot Talablari Hujjati (PRD) v2.0

**Loyiha nomi:** Mebel Salon Veb-vitrinasi, Web Admin Paneli va Telegram Tizimi Integratsiyasi

**Hujjat versiyasi:** 2.0 (Yakuniy / MVP)

**Holati:** Tasdiqlangan / Ishlab chiqishga tayyor

**Sana:** 20.09.2026

---

## Versiya Tarixi: v1.0 → v2.0 O'zgarishlar

| | Nima | Sabab |
|---|---|---|
| ❌ **Olib tashlandi** | Aniq narxlar, narx turlari (Fixed, Range), valyuta mexanikasi | Sayt toza vitrina sifatida ishlaydi — narxlar telefon orqali kelishiladi |
| ❌ **Olib tashlandi** | Onlayn to'lov va hisob-kitoblar | Sayt faqat lead (ariza) yig'uvchi vitrina |
| ❌ **Olib tashlandi** | Arizalardagi murakkab status tugmalari (tasdiqlash/bekor qilish inline) | Jarayon telefon orqali amalga oshiriladi |
| ➕ **Qo'shildi** | Web Admin Paneli (desktop) | Bot admin bilan parallel ishlash imkoniyati |
| ➕ **Qo'shildi** | Dark va Light mode (sayt + admin panel) | Zamonaviy UX talabi |
| ➕ **Qo'shildi** | Komplekt ichidagi interaktiv Checklist | Mijoz faqat kerakli qismlarni tanlash imkoniyati |
| ➕ **Qo'shildi** | Komplekt mebellarining umumiy katalogda mustaqil ko'rinishi | Tovar ko'rinuvchanligini oshirish |
| ➕ **Qo'shildi** | "Mening tanlovlarim" — so'rovnoma savati | An'anaviy savat o'rniga leads yig'ish mexanizmi |
| ➕ **Qo'shildi** | Saytdan modal ariza qoldirish (Gibrid oqim) | To'g'ridan-to'g'ri saytdan ariza berish imkoniyati |
| ➕ **Qo'shildi** | Zavod xodimlari uchun Telegram Kanal xabarnomasi | Arizalarni real vaqtda yetkazish |
| ➕ **Qo'shildi** | Telegram "Reply" orqali Live Chat tizimi | Mijoz-operator aloqasini tizimlashtirish |
| ➕ **Qo'shildi** | `warranty` (kafolat muddati) maydoni | Mahsulot tavsifida kafolat ko'rsatish |

---

## 1. Loyiha Umumiy Ko'rinishi va Maqsadi

Ushbu loyiha zamonaviy mebel ishlab chiqaruvchi korxona uchun **narxlarsiz onlayn vitrina (katalog)**, uni kompyuterdan boshqaruvchi **Web Admin Paneli**, telefondan tezkor boshqaruvchi **Telegram Bot Admini** hamda xaridorlar va zavod ishchilari o'rtasidagi bog'lovchi **Telegram xizmatlaridan** iborat yaxlit tizimdir.

### Asosiy Maqsad

Omborda mavjud bo'lgan tayyor mebel va to'plamlarni ko'p tilli zamonaviy veb-saytda namoyish etish, mijozlardan buyurtma va narx so'rovlarini (lead) veb-sayt va Telegram bot orqali qabul qilish hamda tushgan arizalarni tezkorlik bilan zavod xodimlari kanaliga uzatish.

### Vitrina Xarakteri

> **Saytda narxlar va onlayn to'lov bo'lmaydi.** Har bir mahsulot va to'plam bo'yicha narx mijoz ariza qoldirgach, menejer tomonidan telefon orqali shaxsan kelishiladi.

---

## 2. Foydalanuvchi Rollari va Tizim Ekotizimi

| Rol / Ishtirokchi | Platforma | Huquqlar va Vazifalar |
|---|---|---|
| **Mijoz (Mehmon)** | Veb-sayt | Mahsulot va komplektlarni ko'rish, filtrlash, tilni va mavzuni (Dark/Light) o'zgartirish, komplekt ichidan kerakli mebellarni tanlash, sayt modalidan ariza yuborish yoki Telegram botga o'tish. |
| **Mijoz** | Telegram Bot | Bot orqali toifalar bo'yicha mebellarni ko'rish, saytdan o'tganda arizani 4 bosqichda rasmiylashtirish, botga savol yozib jonli yordam (Live Chat) olish. |
| **Admin / Ma'mur** | Web Admin Panel | Kompyuter orqali tovarlar, toifalar va komplektlar bazasini boshqarish (CRUD), tushgan arizalar jadvalini ko'rish, Dark/Light rejimda ishlash. |
| **Admin / Ma'mur** | Telegram Bot Admin | Telefondan turib FSM dialoglari orqali yangi kategoriya, komplekt va mebellarni tezkor qo'shish/tahrirlash, rasmlar yuklash. |
| **Zavod jamoasi** | Telegram Kanal | Yangi tushgan barcha arizalarni real vaqtda ko'rish, bo'sh xodim mijoz bilan darhol telefon orqali bog'lanishi. |
| **Operator / Menejer** | Telegram Support Guruhi | Mijoz botga savol yozganda kelib tushadigan xabarga «Reply» (javob) yozish orqali mijozga botdan javob qaytarish. |

---

## 3. Asosiy Modellar va Biznes-Mantiq

### 3.1. Kategoriyalar (Toifalar)

- Mebellar o'z toifasiga ko'ra ajratiladi: Divanlar, Stullar, Shkaflar, Stollar, Krovatlar va h.k.
- Saytda **gorizontal tugmalar (tabs)** va **yon filtrlar** orqali toifalar bo'yicha tezkor saralash amalga oshiriladi.

### 3.2. Komplektlar (To'plamlar) va Checklist Mexanikasi

- Komplekt bir nechta alohida mebellardan tashkil topadi *(masalan, "Modern Yotoqxona to'plami": krovat, 2 ta tumba, shkaf)*.

**Katalogdagi mustaqillik:**
> Komplektga biriktirilgan har bir mebel umumiy katalogdagi o'z toifasida (masalan, to'plamdagi stul «Stullar» bo'limida) **alohida tovar sifatida ham avtomatik ko'rinadi**.

**Interaktiv Checklist:**
> Mijoz komplekt sahifasida barcha mebellarni to'liq tanlashi yoki faqat o'ziga kerakli mebellarni **checkbox (✅) orqali belgilab**, aynan o'sha tanlangan qismlar bo'yicha ariza yuborishi mumkin.

### 3.3. "Mening Tanlovlarim" (So'rovnoma Savati)

An'anaviy to'lov savati o'rniga xizmat qiladi:

1. Mijoz katalog bo'ylab mebellarni ko'rib yurib, yoqqanlariga **«Tanlash ➕»** tugmasini bosadi.
2. Ekranda **suzuvchi (floating) 📋 Tanlanganlar (N)** vidjeti hosil bo'ladi.
3. Mijoz barcha tanlagan tovarlarini bitta umumiy so'rovga jamlab, **ariza qoldiradi**.

> ⚠️ Bu savatda narx hisobi yo'q — faqat mebellar ro'yxati yig'iladi va lead (ariza) sifatida yuboriladi.

### 3.4. Mahsulot Tavsifi (Gibrid Ko'rinish)

- **Oddiy ko'rinish:** Rasm, nom, asosiy parametrlar — vizual va ixcham.
- **«Batafsil ma'lumot» tugmasi** orqali to'liq texnik parametrlar bloki ochiladi:
  - Aniq o'lchamlar: bo'yi, eni, chuqurligi
  - Karkas va qoplama materiali
  - Kafolat muddati

### 3.5. Mavjudlik Holati

- `IN_STOCK` — Omborda tayyor
- `MADE_TO_ORDER` — Buyurtma asosida tayyorlanadi

---

## 4. Funksional Talablar

### 4.1. Veb-sayt (Frontend — Next.js)

#### Dizayn va Mavzular

- Zamonaviy, toza UI/UX.
- **Dark Mode va Light Mode** rejimlarini qo'llab-quvvatlash (`next-themes`).
- Header qismida quyosh/oy rejim almashtirgichi.

#### Ko'p Tillilik (i18n)

- 3 ta to'liq til: **O'zbekcha** (asosiy), **Ruscha**, **Inglizcha** (`next-intl`).
- Til almashtirgich orqali kontent dinamik o'zgaradi.

#### Sahifalar Tuzilishi

| Sahifa | Tarkib |
|---|---|
| **Bosh sahifa** | Kompaniya haqida qisqa ma'lumot, ommabop komplektlar va yangi mebellar slayderi, aloqa ma'lumotlari |
| **Katalog** | Gorizontal toifalar paneli, kategoriya / material / o'lcham bo'yicha filtrlar, qidiruv tizimi |
| **Komplektlar** | To'plamlar vitrinasi; ichiga kirilganda tarkibiy mebellarning interaktiv checklisti |
| **Aloqa** | Telefon raqamlar, do'kon/zavod manzili, xarita va Telegram botga o'tish tugmasi |

#### Gibrid Ariza Qoldirish

**Saytning o'zida (Modal):**
- «Narxini bilish / Buyurtma berish» tugmasi bosilganda modal forma ochiladi.
- Modal maydonlari: Ism *(majburiy)*, Telefon raqami *(majburiy)*, Manzil *(ixtiyoriy)*, Izoh *(ixtiyoriy)*.
- Forma yuborilganda ariza `Lead` sifatida bazaga saqlanadi va Telegram Kanaliga xabarnoma ketadi.

**Telegram orqali:**
- «Telegram orqali buyurtma berish» tugmasi mijozni botga deep link bilan yo'naltiradi.
- Havola formati: `t.me/<BOT>?start=order_product_<ID>` yoki `t.me/<BOT>?start=order_set_<ID>`.

---

### 4.2. Web Admin Paneli (Desktop Boshqaruv)

- **Xavfsiz kirish:** Login / Parol (bcrypt hash), JWT sessiya.
- **Dark va Light mode** qo'llab-quvvatlash.

#### Asosiy Bo'limlar

| Bo'lim | Funksiyalar |
|---|---|
| **Toifalar** | CRUD — toifa qo'shish, tahrirlash, o'chirish, tartib o'zgartirish |
| **Komplektlar** | CRUD — komplekt yaratish, rasmlar va tarkibiy mebellarni boshqarish |
| **Mebellar** | CRUD — mebel qo'shish, tahrirlash, o'chirish; jadval va karta ko'rinishlari |
| **Arizalar** | Sayt va bot orqali tushgan barcha leadlar jadvali: sana, mijoz ismi, telefon, manzil, tanlangan mebellar |

> Arizalar jadvalida **faqat ko'rish** imkoniyati mavjud — status o'zgartirish yoki bekor qilish tugmalari yo'q (telefon orqali hal qilinadi).

---

### 4.3. Telegram Bot: Mijoz Qismi

#### Deep Link Orqali Ariza Berish (4 Bosqich)

```
1. Bot tanlangan mebel yoki komplekt fotosi va nomini ko'rsatadi.
2. Mijoz ismini so'raydi.
3. Telefon raqamini so'raydi (Telegram kontakt tugmasi yoki matn).
4. Manzilni so'raydi (geolokatsiya yoki yozma manzil) + ixtiyoriy izoh.
→ Ariza bazaga saqlanadi + Zavod kanaliga xabarnoma yuboriladi.
→ Mijozga: "Arizangiz qabul qilindi! Menejerimiz tez orada siz bilan bog'lanadi." ✅
```

#### Ichki Katalog

- Bot menyusida toifalar bo'yicha mebellarni inline klaviaturalar orqali ko'rish.
- Har bir mebel kartasida rasm, nom, parametrlar va «Ariza berish» tugmasi.

#### Live Chat (Jonli Aloqa)

- Mijoz botga har qanday erkin savol yozsa → xabar **Support guruhiga** yo'naltiriladi.
- Menejer guruhdagi xabarga **«Reply»** qilib javob yozsa → bot orqali mijozga qaytariladi.

---

### 4.4. Telegram Bot: Admin Paneli (Mobile Boshqaruv)

- Faqat vakolatli Telegram ID egasi uchun ochiq.
- FSM dialoglari (`@grammyjs/conversations`) orqali boshqaruv.

#### A. Kategoriyalar Boshqaruvi (CRUD)

- **Qo'shish:** UZ nom *(majburiy)* → RU nom *(ixtiyoriy)* → EN nom *(ixtiyoriy)*.
- RU/EN o'tkazib yuborilsa — UZ nomi fallback sifatida ishlatiladi.
- **Tahrirlash/O'chirish:** Ro'yxatdan tanlanadi.

#### B. Komplektlar Boshqaruvi (CRUD)

- Nom va tavsif (UZ majburiy, RU/EN ixtiyoriy).
- Komplektga tegishli rasmlar galereyasi (1-rasm asosiy muqova).
- **Tahrirlash/O'chirish:** Ro'yxat yoki qidiruv orqali.

#### C. Mebellar Boshqaruvi (CRUD)

```
1. Tegishlilik: Komplektga biriktirilsinmi yoki mustaqil mebelmi?
2. Kategoriya tanlash.
3. Nom va tavsif (UZ/RU/EN).
4. Atributlar: O'lchamlari, materiali, kafolat muddati.
5. Mavjudlik holati: IN_STOCK / MADE_TO_ORDER.
6. Fotogalereya: Bir nechta rasm, "Tayyor" tugmasini bosish.
```

- **Qidirish:** Nom bo'yicha, kategoriya bo'yicha, ID bo'yicha.
- **Tahrirlash:** Nomini, atributlarini, rasmlarini yangilash va o'chirish.

---

### 4.5. Telegram Kanal va Guruh Arxitekturasi

#### Zavod Telegram Kanali (Arizalar uchun)

Saytdan yoki botdan tushgan **barcha yangi arizalar** ushbu yopiq kanalga zudlik bilan yuboriladi.

**Xabar formati (murakkab tugmalarsiz, toza axborot xati):**

```
🔔 YANGI ARIZA!

👤 Mijoz: Karim Aliyev
📞 Telefon: +998901234567
📍 Manzil: Toshkent sh., Chilonzor tumani
🛋 Tanlangan mebel(lar):
   - Modern Yotoqxona to'plami (Faqat: Krovat, Shkaf)
📝 Izoh: Yetkazib berish muddati qancha?
📅 Sana: 20.09.2026 19:30
```

> Kanal a'zolari (boshliqlar, zavod xodimlari, menejerlar) xabarni ko'rib, bo'sh bo'lgan xodim mijozga zudlik bilan qo'ng'iroq qiladi.

#### Menejerlar Support Guruhi (Live Chat uchun)

- Mijoz botga savol yozganda ushbu guruhga yo'naltiriladi.
- Menejer guruhdagi xabarga **«Reply» (Ответить)** qilib yozgan javob bot orqali to'g'ridan-to'g'ri mijozga yetkaziladi.
- `SupportMessage` jadvalida `groupMessageId ↔ userTelegramId` bog'liqligi saqlanadi.

---

## 5. Ma'lumotlar Bazasi Modeli (Prisma / PostgreSQL)

> Narxlar olib tashlangan, to'liq ko'p tillilik, interaktiv tanlovlar va Live Chat integratsiyasi inobatga olingan.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ─── Enums ────────────────────────────────────────────────────────────────────

enum StockStatus {
  IN_STOCK       // Omborda tayyor
  MADE_TO_ORDER  // Buyurtma asosida tayyorlanadi
}

// ─── 1. Kategoriyalar ─────────────────────────────────────────────────────────

model Category {
  id        String    @id @default(uuid())
  slug      String    @unique
  nameUz    String
  nameRu    String
  nameEn    String
  order     Int       @default(0)
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// ─── 2. Komplektlar ───────────────────────────────────────────────────────────

model Collection {
  id        String    @id @default(uuid())
  slug      String    @unique
  titleUz   String
  titleRu   String
  titleEn   String
  descUz    String?
  descRu    String?
  descEn    String?
  images    String[]  // 1-rasm asosiy muqova
  products  Product[] // To'plamga tegishli mebellar
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

// ─── 3. Mebellar (Mahsulotlar) ────────────────────────────────────────────────

model Product {
  id           String      @id @default(uuid())
  categoryId   String
  category     Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  collectionId String?     // Ixtiyoriy: agar komplekt ichida bo'lsa
  collection   Collection? @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  slug         String      @unique

  titleUz      String
  titleRu      String
  titleEn      String
  descUz       String?
  descRu       String?
  descEn       String?

  dimensions   String?     // O'lchamlari (masalan: 200×160×90 sm)
  material     String?     // Materiali (masalan: MDF, Rossiya qarag'ayi)
  warranty     String?     // Kafolat muddati (masalan: 2 yil)

  stockStatus  StockStatus @default(IN_STOCK)
  images       String[]    // 1-rasm asosiy, qolganlari slayder

  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}

// ─── 4. Arizalar (Lead) ───────────────────────────────────────────────────────

enum LeadSource {
  WEB
  BOT
}

model Lead {
  id           String   @id @default(uuid())
  customerName String
  phone        String
  address      String?
  latitude     Float?
  longitude    Float?
  notes        String?

  source       LeadSource
  itemsSummary String   // Tanlangan mebellar/komplektlar ro'yxati (matn)

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// ─── 5. Live Chat bog'liqligi ─────────────────────────────────────────────────

model SupportMessage {
  id             String   @id @default(uuid())
  groupMessageId Int      @unique // Support guruhidagi xabar ID raqami
  userTelegramId String            // Xabar yozgan mijozning Telegram ID
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// ─── 6. Web Admin foydalanuvchilari ──────────────────────────────────────────

model AdminUser {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String   // bcrypt hash
  name      String
  telegramId String?  // Bot orqali admin paneldan foydalanish uchun
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 6. Texnologiyalar Steki

| Qatlam | Texnologiya | Izoh |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) | Veb-vitrina + Web Admin Panel |
| **Til** | TypeScript | Butun loyiha bo'ylab |
| **Stil** | Tailwind CSS | Utility-first CSS freymvork |
| **Mavzular** | `next-themes` | Dark / Light mode |
| **Ko'p tillilik** | `next-intl` | UZ / RU / EN |
| **Ikonlar** | `lucide-react` | SVG ikona kutubxonasi |
| **Backend** | Next.js Server Actions / API Routes | Sayt va Admin API |
| **Ma'lumotlar bazasi** | PostgreSQL | Asosiy baza |
| **ORM** | Prisma ORM | Type-safe DB boshqaruvi |
| **Telegram Bot** | Node.js + TypeScript + grammY | Bot freymvork |
| **Bot FSM** | `@grammyjs/conversations` | Admin dialoglari |
| **Media xotira** | Supabase Storage yoki Cloudinary | WebP siqish + CDN |
| **Deploy — Sayt** | Vercel yoki VPS Docker | Veb-sayt va Admin panel |
| **Deploy — Bot** | VPS + Docker Compose | Bot + PostgreSQL |

---

## 7. Arxitektura Sxemasi

```
┌─────────────────────────────────────────────────────────────┐
│                      MIJOZ (XARIDOR)                        │
│  ┌─────────────────────┐    ┌──────────────────────────┐   │
│  │     VEB-SAYT        │    │     TELEGRAM BOT         │   │
│  │  (Next.js Vitrina)  │    │  (Mijoz katalog + ariza) │   │
│  └──────────┬──────────┘    └────────────┬─────────────┘   │
└─────────────┼───────────────────────────┼─────────────────┘
              │ Modal ariza               │ 4-bosqich FSM
              ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Next.js API + Node.js)                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │           PostgreSQL + Prisma ORM                     │  │
│  │  Category │ Collection │ Product │ Lead │ Support...  │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────┬───────────────────────────────────────┬─────────┘
           │                                       │
           ▼                                       ▼
┌──────────────────────┐             ┌─────────────────────────┐
│   WEB ADMIN PANEL    │             │  TELEGRAM XIZMATLARI     │
│   (Next.js Desktop)  │             │  ┌───────────────────┐   │
│  - CRUD boshqaruv    │             │  │  Zavod Kanali     │   │
│  - Arizalar jadvali  │             │  │  (Arizalar)       │   │
│  - Dark/Light mode   │             │  ├───────────────────┤   │
└──────────────────────┘             │  │  Support Guruhi   │   │
                                     │  │  (Live Chat)      │   │
┌──────────────────────┐             │  ├───────────────────┤   │
│  TELEGRAM BOT ADMIN  │             │  │  Admin Bot        │   │
│  (Mobile FSM boshq.) │             │  │  (CRUD mobile)    │   │
└──────────────────────┘             └─────────────────────────┘
```

---

## 8. Muhim Biznes Qoidalari

1. **Narxlar ko'rsatilmaydi** — saytda va botda hech qanday narx, chegirma yoki to'lov mexanizmi bo'lmaydi.
2. **Komplekt mebellar ikkita joyda ko'rinadi** — o'z to'plamida ham, umumiy katalogda ham.
3. **Ariza (Lead) — asosiy konversiya nuqtasi** — sayt yoki botdan keladigan har qanday so'rov `Lead` sifatida saqlanadi va kanalga ketadi.
4. **Kanal xabari sodda** — hech qanday inline tugma, callback yoki status yo'q; xodimlar telefon orqali o'z vazifalarini bajaradilar.
5. **Live Chat Reply mexanikasi** — guruhda faqat «Reply» qilish kifoya; bot `groupMessageId` bo'yicha mijozni topib, javobni yetkazadi.
6. **Admin panel — parallel tizim** — Web Admin va Telegram Bot Admin bir vaqtda ishlashi mumkin; ular bir xil bazani o'qiydi.

---

## 9. MVP Doirasidan Tashqarida (Kelajak Versiyalar uchun)

> Quyidagi funksiyalar MVP ga kirmaydi, lekin arxitektura ularga moslashtiriladi:

- Narxlarni ko'rsatish / narx so'rovi formi
- WhatsApp / Instagram integratsiyasi
- Admin analytics dashboard (grafik, statistika)
- Mijozlar sharhlar va reytinglari
- Push-notification tizimi
- CRM tizimi bilan integratsiya

---

*PRD v2.0 — Tasdiqlangan hujjat. Keyingi qadam: Arxitektura dizayni va sprint rejalashtirish.*
