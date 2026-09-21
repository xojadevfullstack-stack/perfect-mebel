# Admin Panel Documentation (Admin Panel Qo'llanmasi)

Mebel Salon loyihasining Admin paneli Next.js, Tailwind CSS va shadcn/ui orqali yaratilgan bo'lib, mebel katalogi, kolleksiyalar va kelib tushgan buyurtmalarni (leads) boshqarish uchun mo'ljallangan.

## 1. Login va Autentifikatsiya (Authentication Flow)
- **Login sahifasi**: `/admin/login` manzilida joylashgan bo'lib, admin username va parolni kiritishni talab qiladi.
- JWT (JSON Web Token) autentifikatsiya `jose` kutubxonasi orqali amalga oshiriladi.
- Faqatgina ma'lumotlar bazasidagi `AdminUser` rolidagi foydalanuvchilar (database dagi jadval) tizimga kira oladi.
- **Security Notes (Xavfsizlik)**:
  - Parollar `bcrypt` (kamida 12 rounds) algoritmi yordamida shifrlangan holda saqlanadi.
  - JWT token muddati (expiry) xavfsizlikni ta'minlash uchun qisqa qilib belgilangan (masalan 24 soat).
  - Kuchli parollar talab etiladi (kamida 8 ta belgi, maxsus belgilar bilan).

## 2. Dashboard Overview (Asosiy Oyna)
Dashboard tizimga kirish bilan namoyon bo'ladigan bosh sahifa bo'lib, quyidagi muhim statistikani ko'rsatadi:
- Jami faol tovarlar soni (Total Products).
- Yangi kelib tushgan arizalar (New Leads).
- Mavjud kolleksiyalar va kategoriyalar xulosasi.
- So'nggi 5-10 ta yangi arizalarning qisqacha ro'yxati (Recent Applications).

## 3. Categories Management (Kategoriyalarni boshqarish)
Mebellar uchun asosiy toifalarni boshqarish qismi (Masalan: Yumshoq mebellar, Oshxona stullari).
- **CRUD Operatsiyalari**: Yangi kategoriya yaratish, mavjudini o'zgartirish, tafsilotlarini ko'rish va o'chirish.
- *[Placeholder: Categories Table Screenshot]*
- *[Placeholder: Add Category Form Screenshot]*

## 4. Products Management (Tovarlarni boshqarish)
Katalogdagi mebellarni boshqarish bo'limi (Loyihaning asosiy maqsadi vitrina bo'lganligi sababli tovarlar narxlari ko'rsatilmaydi).
- **CRUD Operatsiyalari**: Mahsulot qo'shish, o'zgartirish, ko'rish va o'chirish.
- **Image Upload**: Mahsulot rasmlari Supabase Storage yoki Cloudinary (yoki boshqa S3-compatible xizmat) orqali yuklanadi.
- **Asosiy Maydonlar**: Nomi (UZ/RU/EN), Tavsifi, Kategoriyasi, O'lchamlari.
- **Holat**: Tovar holati `StockStatus` enumi orqali (`IN_STOCK` - Sotuvda bor, `MADE_TO_ORDER` - Buyurtma asosida) belgilanadi.
- **Filters**: Kategoriyasi bo'yicha yoki nomi yordamida izlash uchun maxsus filterlar mavjud.

## 5. Collections Management (Kolleksiyalarni boshqarish)
Bir nechta tovarlarni o'z ichiga olgan kolleksiyalarni yaratish qismi (Masalan: "Lazzat" oshxona to'plami).
- **CRUD Operatsiyalari**: Kolleksiya yaratish va boshqarish.
- **Assign Products**: Check-list (interaktiv) interfeysi yordamida tovarlarni tanlash orqali kolleksiyaga bir nechta mahsulotlarni osongina biriktirish imkoniyati.

## 6. Leads / Applications Table (Arizalar bo'limi)
Telegram bot yoki veb-vitrinadan kelib tushgan ariza va so'rovlarni boshqarish ro'yxati.
- **View-only (Faqat ko'rish)**: Arizalarni tahrirlab bo'lmaydi, chunki ular mijoz tomonidan tasdiqlangan so'rovlardir. Faqatgina ariza holatini o'qish mumkin.
- **Tarkibi**: Mijozning ismi, Telegram username yoki telefon raqami, "Mening tanlovlarim" savatidagi (wishlist) tanlagan mebellari, kelib tushgan sanasi.
- **Qidiruv va Filtrlash**:
  - Maxsus "Search" maydoni orqali mijoz nomi yoki telefon raqami bilan arizani qidirish.
  - "Date filter" orqali ma'lum bir sana oralig'idagi arizalarni saralash (Date Picker orqali).

## 7. Qo'shimcha imkoniyatlar
- **Dark/Light Mode Toggle**: Panel yuqori qismida joylashgan tugma orqali yorug' yoki qorong'u mavzuni yoqish (`next-themes` yordamida amalga oshirilgan).
- **Ko'p tillilik (i18n)**: Panel va tovarlar ma'lumotlari uch xil tilda (UZ, RU, EN) yuritilishi sababli tillarni almashtirish uchun maxsus Dropdown.
- **Keyboard Shortcuts (Opsional)**:
  - `Ctrl + K`: Tezkor qidiruv (Omnibar) panelini ochish.
  - `Esc`: Ochiq modal oynalarni yopish.
  - `Ctrl + S`: Tahrirlangan ma'lumotlarni saqlash.
