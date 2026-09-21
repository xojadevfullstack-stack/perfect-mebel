# Mahsulot Talablari Hujjati (PRD)

**Loyiha nomi:** Mebel Salon Veb-sayti va Telegram Bot Integratsiyasi

  

**Hujjat versiyasi:** 1.0

  

**Holati:** Tasdiqlangan / Ishlab chiqishga tayyor

  

## 1. Loyiha umumiy ko‘rinishi va Maqsadi

Ushbu loyiha zamonaviy mebel ishlab chiqaruvchi/savdo kompaniyasi uchun veb-sayt (vitrina/katalog) va unga uzviy bog‘langan ko‘p funksiyali Telegram bot tizimidan iborat.

  

- **Asosiy maqsad:** Mijozlarga katalog, kolleksiyalar va alohida mebellarni qulay ko‘rsatish, buyurtmalarni Telegram bot orqali avtomatlashtirilgan tarzda qabul qilish hamda do‘kon adminiga tovarlar, kolleksiyalar va buyurtmalarni to‘g‘ridan-to‘g‘ri Telegram bot orqali to‘liq boshqarish (CRUD) imkonini berish.
    
      
    

## 2. Foydalanuvchi Rollari va Huquqlari

|**Rol**|**Platforma**|**Huquqlar va Imkoniyatlar**|
|---|---|---|
|**Mijoz (Mehmon)**|Veb-sayt|Mahsulotlar, kolleksiyalar, kompaniya va aloqa ma'lumotlarini ko'rish, filtrlash, tilni o'zgartirish, mebel/komplektni tanlab botga buyurtmaga o'tish.|
|**Mijoz**|Telegram Bot|Bot menyusida tovarlarni ko'rish, saytdan o'tganda buyurtmani shakllantirish (kontakt, lokatsiya, izoh yuborish).|
|**Admin**|Telegram Bot|Kategoriyalar, kolleksiyalar va mebellarni qo'shish/tahrirlash/o'chirish, buyurtmalarni qabul qilish/bekor qilish, xabarnoma guruhlarini sozlash.|
|**Menejerlar guruhi**|Telegram Guruh/Kanal|Tushgan yangi buyurtmalar haqida xabarnomalarni real vaqt rejimida qabul qilish.|

## 3. Asosiy Modellar va Tushunchalar

1. **Kolleksiya (Komplekt):**
    
      
    - Bir nechta alohida mebellarni o‘z ichiga olgan to‘plam (masalan, _Modern Yotoqxona to‘plami_).
        
          
        
    - O‘zining alohida yagona narxiga ega bo‘lishi mumkin.
        
          
        
    - Mijoz butun komplektni birdaniga buyurtma qilishi yoki uning ichidagi mebellarni alohida tanlashi mumkin.
        
          
        
2. **Mebel (Mahsulot):**
    
      
    - Mustaqil tovar (masalan, _Stul_, _Divan_).
        
          
        
    - Ma’lum bir kategoriyaga tegishli bo‘ladi.
        
          
        
    - Kolleksiya (komplekt) ichida bo‘lishi ham, kolleksiyasiz mustaqil sotilishi ham mumkin.
        
          
        
3. **Narx mexanikasi:**
    
      
    - **Aniq narx (Fixed):** Aniq belgilangan summa.
        
          
        
    - **Kelishiladi (Negotiable):** Aniq summa ko‘rsatilmaydi, "Kelishiladi" belgisi qo‘yiladi.
        
          
        
    - **Narx oralig‘i (Range):** Minimal va maksimal qiymat (masalan, 3 000 000 – 4 500 000 UZS).
        
          
        
    - **Valyuta:** Asosiy valyuta kiritiladi (masalan, UZS), ikkinchi valyuta (masalan, USD) ixtiyoriy.
        
          
        
4. **Mavjudlik holati:**
    
      
    - `IN_STOCK` (Omborda bor) yoki `MADE_TO_ORDER` (Buyurtmaga tayyorlanadi).
        
          
        

## 4. Funksional Talablar

### 4.1. Veb-sayt (Frontend)

- **Katalog va Sahifalar:**
    
      
    - **Bosh sahifa:** Kompaniya haqida qisqacha ma'lumot, ommabop kolleksiyalar va yangi mebellar slayderi, aloqa ma'lumotlari.
        
          
        
    - **Kolleksiyalar (Komplektlar) bo‘limi:** Har bir komplektning muqova rasmi, nomi, umumiy narxi va ichidagi mebellar soni ko‘rsatiladi. Komplekt ichiga kirilganda unga tegishli barcha mebellar ro‘yxati ochiladi.
        
          
        
    - **Mebellar katalogi:** Barcha mebellar ro‘yxati.
        
          
        
    - **Kompaniya haqida va Aloqa sahifalari:** Kompaniya tarixi, afzalliklari, telefon raqamlar, ijtimoiy tarmoqlar, xarita va manzillar.
        
          
        
- **Filtrlash va Saralash:**
    
      
    - Kategoriya bo‘yicha (Stul, Stol, Divan va h.k.).
        
          
        
    - Narx oralig‘i bo‘yicha (min — max slayder yoki input).
        
          
        
    - Materiali bo‘yicha.
        
          
        
    - Mavjudlik holati bo‘yicha (Omborda bor / Buyurtmaga tayyorlanadi).
        
          
        
- **Mahsulot / Komplekt kartochkasi (Media UI):**
    
      
    - Slayder/galereya: Birinchi rasm asosiy bo‘lib turadi, qolgan rasmlar o‘ngga siljuvchi slayd-shou tarzida ko‘rsatiladi.
        
          
        
    - Har bir mahsulotda va butun komplekt kartochkasida alohida **«Telegram orqali buyurtma berish»** tugmasi mavjud bo‘ladi.
        
          
        
- **Ko‘p tillilik (i18n):**
    
      
    - Sayt 3 ta tilda ishlaydi: O‘zbekcha (asosiy), Ruscha, Inglizcha.
        
          
        
    - Til almashtirgich orqali kontent dinamik o‘zgaradi.
        
          
        

### 4.2. Saytdan Botga Buyurtma Uzatish (Deep Linking)

- Mijoz saytda alohida mebel yoki butun komplekt kartochkasidagi «Buyurtma berish» tugmasini bosganda:
    
      
    - Havola formati: `[https://t.me/](https://t.me/)<BOT_USERNAME>?start=order_product_<ID>` yoki `[https://t.me/](https://t.me/)<BOT_USERNAME>?start=order_set_<ID>`.
        
          
        
- Foydalanuvchi Telegram ilovasiga o‘tib, «Start» tugmasini bosishi bilan bot maxsus parametrni taniydi va buyurtma ssenariysini ishga tushiradi.
    
      
    

### 4.3. Telegram Bot: Mijoz Qismi

1. **Buyurtma rasmiylashtirish ssenariysi (Deep Link orqali):**
    
      
    - Bot tanlangan mebel yoki komplektning asosiy rasmi, nomi va narxini ko‘rsatadi.
        
          
        
    - **1-qadam:** Mijozdan ismini so‘raydi (yoki profil ismini tasdiqlatadi).
        
          
        
    - **2-qadam:** Telefon raqamini so‘raydi (Telegram "Kontaktni ulashish" tugmasi yoki matnli kiritish).
        
          
        
    - **3-qadam:** Yetkazib berish manzili yoki lokatsiyani so‘raydi (Telegram "Lokatsiyani yuborish" tugmasi orqali).
        
          
        
    - **4-qadam:** Ixtiyoriy izoh (matn yozish yoki "O‘tkazib yuborish" tugmasi).
        
          
        
    - Buyurtma shakllanib, adminga va xabarnoma guruhiga yuboriladi. Mijozga: _"Buyurtmangiz qabul qilindi! Menejerimiz tez orada siz bilan bog‘lanadi"_ xabari beriladi.
        
          
        
2. **Bot ichki katalogi:**
    
      
    - Mijoz bot ichida ham «Katalog», «Kolleksiyalar», «Aloqa» menyulari orqali mebellarni rasmi va parametrlari bilan ko‘ra oladi.
        
          
        

### 4.4. Telegram Bot: Admin Paneli

- **Kirish xavfsizligi:** Faqat belgilangan yagona Admin Telegram ID foydalanuvchisi uchun ochiq.
    
      
    
- **Interfeys formati:** Bosqichma-bosqich FSM (Finite State Machine) dialoglari va qulay Inline klaviaturalar.
    
      
    

#### A. Kategoriyalar boshqaruvi (CRUD)

- **Qo‘shish:** Kategoriya nomi ketma-ket so‘raladi:
    
      
    1. O‘zbekcha nom (Majburiy).
        
          
        
    2. Ruscha nom (Ixtiyoriy — «O‘tkazib yuborish» bosilsa, o‘zbekchasi saqlanadi).
        
          
        
    3. Inglizcha nom (Ixtiyoriy — «O‘tkazib yuborish» bosilsa, o‘zbekchasi saqlanadi).
        
          
        
- **Tahrirlash/O‘chirish:** Kategoriyalar ro‘yxatidan tanlanadi va tahrirlanadi yoki o‘chiriladi.
    
      
    

#### B. Kolleksiyalar / Komplektlar boshqaruvi (CRUD)

- **Qo‘shish:**
    
      
    1. Nomi va tavsifi (UZ majburiy, RU va EN o‘tkazib yuborish fallbacki bilan).
        
          
        
    2. Umumiy komplekt narxi (Aniq narx / Oraliq / Kelishiladi).
        
          
        
    3. Valyuta (Asosiy, ikkinchi valyuta ixtiyoriy).
        
          
        
    4. Komplektga tegishli rasmlar galereyasi (birinchi rasm avtomatik asosiy qilib olinadi).
        
          
        
- **Tahrirlash/O‘chirish:** Ro‘yxat yoki nom bo‘yicha qidiruv orqali amalga oshiriladi.
    
      
    

#### C. Mebellar boshqaruvi (CRUD)

- **Qo‘shish bosqichlari:**
    
      
    1. **Tegishlilik:** Kolleksiyaga biriktiriladimi yoki mustaqil mebelmi? (Kolleksiyalar ro‘yxatidan tanlanadi yoki "Kolleksiyasiz").
        
          
        
    2. **Kategoriya:** Mavjud kategoriyalardan biri tanlanadi.
        
          
        
    3. **Nom va Tavsif:**
        
          
        - UZ nom va tavsif kiritiladi.
            
              
            
        - RU nom va tavsif so‘raladi («O‘tkazib yuborish» tugmasi bilan).
            
              
            
        - EN nom va tavsif so‘raladi («O‘tkazib yuborish» tugmasi bilan).
            
              
            
    4. **Narx turi:** «Aniq narx», «Narx oralig‘i» yoki «Kelishiladi».
        
          
        - Aniq narx bo‘lsa: Summa kiritiladi.
            
              
            
        - Oraliq bo‘lsa: Minimal va maksimal summa kiritiladi.
            
              
            
    5. **Valyuta:** Asosiy valyuta tanlanadi (UZS), 2-valyuta kiritish yoki o‘tkazib yuborish.
        
          
        
    6. **Atributlar:** O‘lchamlari, materiali kiritiladi.
        
          
        
    7. **Mavjudlik:** «Omborda bor» yoki «Buyurtmaga tayyorlanadi».
        
          
        
    8. **Fotogalereya:** Admin bir nechta rasm yuboradi va «Tayyor» tugmasini bosadi (1-rasm asosiy/muqova bo‘ladi).
        
          
        
- **Qidirish va Tahrirlash:**
    
      
    - Admin mebelni 3 xil usulda topishi mumkin: Nomini yozib qidirish, Kategoriya bo‘yicha saralash, Mebel ID raqamini kiritish.
        
          
        
    - Kartochka ostida «Nomini tahrirlash», «Narxni o‘zgartirish», «Rasmlarni yangilash», «O‘chirish» inline tugmalari chiqadi.
        
          
        

#### D. Sozlamalar va Buyurtmalar nazorati

- **Xabarnoma guruhlari:** Admin sozlamalar bo‘limida yangi Telegram guruh/kanal ID sini kiritib xabarnomalar ro‘yxatiga qo‘shishi yoki mavjudlarini o‘chirishi mumkin.
    
      
    
- **Buyurtmani qabul qilish:** Yangi buyurtma tushganda uning ostida «✅ Tasdiqlash» va «❌ Bekor qilish» tugmalari bo‘ladi. Status o‘zgarganda buyurtmachi va menejerlar xabardor qilinadi.
    
      
    

## 5. Ma'lumotlar Bazasi Modeli (Prisma / PostgreSQL Konsepsiyasi)

Kod parchasi

```
enum PriceType {
  FIXED
  RANGE
  NEGOTIABLE
}

enum StockStatus {
  IN_STOCK
  MADE_TO_ORDER
}

enum OrderStatus {
  PENDING
  CONFIRMED
  CANCELLED
}

model Category {
  id        String    @id @default(uuid())
  nameUz    String
  nameRu    String
  nameEn    String
  products  Product[]
  createdAt DateTime  @default(now())
}

model Collection {
  id          String      @id @default(uuid())
  titleUz     String
  titleRu     String
  titleEn     String
  descUz      String?
  descRu      String?
  descEn      String?
  priceType   PriceType   @default(FIXED)
  priceMin    Float?
  priceMax    Float?
  currency    String      @default("UZS")
  secondaryPrice Float?
  secondaryCurrency String?
  images      String[]    // 1-element asosiy rasm
  products    Product[]
  createdAt   DateTime    @default(now())
}

model Product {
  id          String      @id @default(uuid())
  categoryId  String
  category    Category    @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  collectionId String?
  collection  Collection? @relation(fields: [collectionId], references: [id], onDelete: SetNull)
  titleUz     String
  titleRu     String
  titleEn     String
  descUz      String?
  descRu      String?
  descEn      String?
  priceType   PriceType   @default(FIXED)
  priceMin    Float?
  priceMax    Float?
  currency    String      @default("UZS")
  secondaryPrice Float?
  secondaryCurrency String?
  dimensions  String?
  material    String?
  stockStatus StockStatus @default(IN_STOCK)
  images      String[]    // 1-element asosiy rasm
  createdAt   DateTime    @default(now())
}

model Order {
  id           String      @id @default(uuid())
  orderNumber  Int         @default(autoincrement())
  customerName String
  phone        String
  address      String?
  latitude     Float?
  longitude    Float?
  notes        String?
  itemType     String      // "PRODUCT" yoki "COLLECTION"
  itemId       String      // Product yoki Collection ID raqami
  status       OrderStatus @default(PENDING)
  createdAt    DateTime    @default(now())
}

model NotificationChat {
  id        String   @id @default(uuid())
  chatId    String   @unique
  title     String?
  createdAt DateTime @default(now())
}
```

## 6. Tavsiya Etiladigan Texnologiyalar Steki

- **Veb-sayt:** Next.js (App Router, TailwindCSS, `next-intl` ko‘p tillilik uchun).
    
      
    
- **Ma’lumotlar bazasi va ORM:** PostgreSQL + Prisma ORM.
    
      
    
- **Telegram Bot:** Node.js (TypeScript) + `grammY` (yoki `Telegraf`), FSM dialoglari uchun `@grammyjs/conversations`.
    
      
    
- **Media xotira:** Cloudinary yoki Supabase Storage (rasmlarni avtomatik siqish, WebP formatiga o‘tkazish va tezkor CDN havolalarini taqdim etish).
    
      
    
- **Server infratuzilmasi:** Vercel (veb-sayt uchun) va Docker konteyneri (bot va ma’lumotlar bazasi uchun).