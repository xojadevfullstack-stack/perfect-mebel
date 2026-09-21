# API Documentation (Mebel Salon MVP)

Ushbu hujjat "Mebel Salon" loyihasining barcha API endpointlari, ularning so'rov (request) va javob (response) formatlarini o'z ichiga oladi.

## Umumiy ma'lumotlar (General Information)

- **Base URL**: `https://your-domain.com`
- **Content-Type**: Barcha so'rovlar va javoblar uchun `application/json` formatidan foydalaniladi (rasm yuklash bundan mustasno).

### Javob formati (Response Format)
Barcha muvaffaqiyatli so'rovlar quyidagi formatda qaytariladi:
```json
{
  "success": true,
  "data": ...
}
```

### Xatolar formati (Error Response Format)
Barcha xatolar quyidagi formatda qaytariladi (Status: 400, 401, 404, 500):
```json
{
  "success": false,
  "error": "Xato xabari (Error message)"
}
```

### Sahifalash (Pagination Format)
Ko'plab ma'lumot qaytaradigan endpointlar sahifalashni qo'llab-quvvatlaydi:
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

### Rate Limiting
Public API endpointlariga DDOS va spamlarni oldini olish maqsadida rate limiting o'rnatilgan (masalan, `/api/leads` uchun 1 daqiqada 5 ta so'rov). Limit oshib ketsa, `429 Too Many Requests` qaytariladi.

### Autentifikatsiya (Authentication)
Admin API endpointlari JWT (JSON Web Token) orqali himoyalangan. Token so'rov sarlavhasida (header) yuborilishi kerak:
`Authorization: Bearer <your_jwt_token>`

---

## Public API (Vitrina)
Ushbu endpointlar mijozlar uchun (saytning ochiq qismi) mo'ljallangan va avtorizatsiya talab qilmaydi.

### 1. Kategoriyalarni olish
**GET** `/api/categories`

Barcha faol kategoriyalarni ro'yxatini qaytaradi.

- **Request Headers:** None
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "cm1a2b3c4d5e6f",
      "slug": "yumshoq-mebellar",
      "nameUz": "Yumshoq mebellar",
      "nameRu": "Мягкая мебель",
      "nameEn": "Soft furniture",
      "order": 1
    }
  ]
}
```
- **Example Usage:**
```bash
curl -X GET https://your-domain.com/api/categories
```

### 2. Mahsulotlarni olish
**GET** `/api/products`

Mahsulotlarni filtrlash va izlash imkoniyati bilan ro'yxatini qaytaradi.

- **Query Parameters:**
  - `categoryId` (string) - Kategoriya bo'yicha filtrlash
  - `search` (string) - Nomi bo'yicha qidirish
  - `stockStatus` (IN_STOCK, MADE_TO_ORDER) - Holati bo'yicha filtrlash
  - `page`, `limit` - Sahifalash uchun
- **Request Headers:** None
- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "product_123",
      "categoryId": "cm1a2b3c4d5e6f",
      "titleUz": "Kreslo 'Elegance'",
      "titleRu": "Кресло 'Elegance'",
      "titleEn": "Armchair 'Elegance'",
      "images": ["https://..."],
      "stockStatus": "IN_STOCK"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

### 3. Bitta mahsulotni olish
**GET** `/api/products/[id]`

Bitta mahsulot haqida to'liq ma'lumotni qaytaradi.

- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "product_123",
    "categoryId": "cm1a2b3c4d5e6f",
    "titleUz": "Kreslo 'Elegance'",
    "titleRu": "Кресло 'Elegance'",
    "titleEn": "Armchair 'Elegance'",
    "descUz": "Batafsil ma'lumot...",
    "descRu": "Подробная информация...",
    "descEn": "Detailed information...",
    "images": ["https://..."],
    "stockStatus": "IN_STOCK"
  }
}
```
- **Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 4. Kolleksiyalarni olish
**GET** `/api/collections`

Mebel to'plamlari ro'yxatini qaytaradi.

- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "col_123",
      "slug": "luxe-bedroom",
      "titleUz": "Yotoqxona to'plami 'Luxe'",
      "titleRu": "Спальный гарнитур 'Luxe'",
      "titleEn": "Bedroom set 'Luxe'",
      "images": ["https://..."]
    }
  ]
}
```

### 5. Kolleksiyani mahsulotlari bilan olish
**GET** `/api/collections/[id]`

Kolleksiya ichiga kiradigan barcha mahsulotlarni ro'yxati bilan birga qaytaradi.

- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "col_123",
    "slug": "luxe-bedroom",
    "titleUz": "Yotoqxona to'plami 'Luxe'",
    "titleRu": "Спальный гарнитур 'Luxe'",
    "titleEn": "Bedroom set 'Luxe'",
    "descUz": "Kolleksiya haqida...",
    "descRu": "О коллекции...",
    "descEn": "About collection...",
    "images": ["https://..."],
    "products": [
      {
        "id": "product_123",
        "titleUz": "Kravat",
        "stockStatus": "IN_STOCK"
      }
    ]
  }
}
```

### 6. Ariza (Lead) qoldirish
**POST** `/api/leads`

Mijoz savatchadagi mahsulotlar (yoki savollar) bilan ariza qoldirganda ishlaydi.

- **Request Body:**
```json
{
  "customerName": "Ali Valiyev",
  "phone": "+998901234567",
  "notes": "Men ushbu mebellarga qiziqyapman",
  "itemsSummary": "Mahsulotlar: Kreslo, Stol"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "lead_789",
    "customerName": "Ali Valiyev",
    "phone": "+998901234567"
  }
}
```
- **Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation Error"
}
```

---

## Admin API (Protected)
Ushbu endpointlar faqat administratorlar uchun. So'rov sarlavhasida JWT token bo'lishi shart.

### 1. Admin Login
**POST** `/api/admin/auth/login`

Admin panelga yoki bot orqali kirish uchun token beradi.

- **Request Body:**
```json
{
  "username": "admin",
  "password": "secretpassword"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "user": {
      "id": "admin_1",
      "username": "admin",
      "name": "Administrator"
    }
  }
}
```
- **Response (401 Unauthorized):** 
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### 2. Kategoriyalar (CRUD)
**GET** `/api/admin/categories` - Barcha kategoriyalar
**POST** `/api/admin/categories` - Yangi kategoriya qo'shish
**PUT** `/api/admin/categories/[id]` - Kategoriyani tahrirlash
**DELETE** `/api/admin/categories/[id]` - Kategoriyani o'chirish

- **POST Request Example:**
```json
{
  "nameUz": "Yangi kategoriya",
  "nameRu": "Новая категория",
  "nameEn": "New category",
  "slug": "yangi-kategoriya",
  "order": 2
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "new_cat_1",
    "slug": "yangi-kategoriya",
    "nameUz": "Yangi kategoriya",
    "nameRu": "Новая категория",
    "nameEn": "New category",
    "order": 2
  }
}
```

### 3. Mahsulotlar (CRUD)
**GET / POST / PUT / DELETE** `/api/admin/products`

- **POST Request Example:**
```json
{
  "titleUz": "Yangi stul",
  "descUz": "Juda qulay stul",
  "categoryId": "cm1a2b3c4d5e6f",
  "stockStatus": "IN_STOCK",
  "images": ["https://..."]
}
```
- **Response (201 Created) & (500 Internal Server Error) for failures.**

### 4. Kolleksiyalar (CRUD)
**GET / POST / PUT / DELETE** `/api/admin/collections`

### 5. Arizalarni (Leads) olish
**GET** `/api/admin/leads`

- **Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "lead_789",
      "customerName": "Ali Valiyev",
      "phone": "+998901234567",
      "notes": "Men ushbu mebellarga qiziqyapman",
      "createdAt": "2023-10-01T12:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

### 6. Rasm yuklash
**POST** `/api/upload`

Fayllarni (rasmlarni) serverga yoki bulutga (Supabase/Cloudinary) yuklash uchun ishlatiladi.

**Security talablari:**
- Maksimal fayl hajmi: 5MB
- Faqat rasm formatlari: `image/*` (jpeg, png, webp, gif)
- Fayl nomini xavfsizlantirish (UUID + original extension)

- **Request Headers:** `Content-Type: multipart/form-data`
- **Request Body:** `file` maydoni (Binary data)
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "url": "https://.../image.jpg"
  }
}
```
- **Example Usage (fetch in TypeScript):**
```typescript
const formData = new FormData();
if (fileInput.files && fileInput.files.length > 0) {
  formData.append('file', fileInput.files[0]);
}

fetch('/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

---

## Webhook

### 1. Telegram Webhook Endpoint
**POST** `/api/webhook`

Telegram bot so'rovlarini (Updates) qabul qilish uchun endpoint. Ushbu manzil `setWebhook` orqali Telegram API ga bog'lanadi.

**Webhook Security:**
- `setWebhook` orqali webhook o'rnatilganda `secret_token` parametri berilishi kerak.
- So'rovlar kelganda `X-Telegram-Bot-Api-Secret-Token` sarlavhasi (header) tekshiriladi va u muhit o'zgaruvchisidagi (env) `TELEGRAM_WEBHOOK_SECRET` bilan mos kelishi shart.

- **Request Body:** Telegram Update Object
```json
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": { "id": 987654321, "first_name": "Ali" },
    "chat": { "id": 987654321, "type": "private" },
    "date": 1696150000,
    "text": "/start"
  }
}
```
- **Response (200 OK):** 
```json
{
  "success": true,
  "data": {
    "ok": true
  }
}
```
> [!IMPORTANT] 
> Agar bot ishida xato yuz bersa ham, ushbu endpoint har doim `200 OK` javobini qaytarishi kerak. Aks holda Telegram xuddi shu xabarni botga qayta-qayta yuboraveradi.

