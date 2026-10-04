# Environment Variables Reference

Ushbu hujjat Mebel Salon loyihasida ishlatiladigan barcha muhit o'zgaruvchilari (environment variables) haqida batafsil ma'lumot beradi. Loyihani ishga tushirishdan oldin loyiha ildizida `.env` faylini yarating va quyidagi qiymatlarni to'ldiring.

## .env.example shabloni

Quyidagi shablonni nusha olib, `.env` faylingizga joylashtiring:

```env
# ==========================================
# DATABASE SETTINGS
# ==========================================
DATABASE_URL="postgresql://user:password@localhost:5432/mebel_db?schema=public"
DB_USER="user"
DB_PASSWORD="password"
DB_NAME="mebel_db"

# ==========================================
# NEXT.JS SETTINGS
# ==========================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# ==========================================
# TELEGRAM BOT SETTINGS
# ==========================================
TELEGRAM_BOT_TOKEN="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
TELEGRAM_FACTORY_CHANNEL_ID="-1001234567890"
TELEGRAM_SUPPORT_GROUP_ID="-1009876543210"
ADMIN_TELEGRAM_IDS="11111111,22222222"
TELEGRAM_WEBHOOK_SECRET="super-secret-webhook-token"

# ==========================================
# MEDIA STORAGE (SUPABASE - Web va Bot)
# ==========================================
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhb...your-key-here"
SUPABASE_SERVICE_ROLE_KEY="eyJhb...your-service-role-key-here"

# ==========================================
# AUTH / SECURITY
# ==========================================
JWT_SECRET="your-super-secret-key-32-chars-min"
```

---

## O'zgaruvchilar Ta'rifi

### 1. Database Variables (Ma'lumotlar bazasi)
| Variable Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL ulanish manzili. | `postgresql://postgres:postgres@localhost:5432/mebel_db?schema=public` |
| `DB_USER` | Yes (Docker) | Ma'lumotlar bazasi foydalanuvchisi. | `postgres` |
| `DB_PASSWORD` | Yes (Docker) | Ma'lumotlar bazasi paroli. | `postgres` |
| `DB_NAME` | Yes (Docker) | Ma'lumotlar bazasi nomi. | `mebel_db` |

### 2. Next.js Variables (Web ilova)
| Variable Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Ilovaning asosiy URL manzili (frontend). | `http://localhost:3000` (Dev), `https://mebel-salon.uz` (Prod) |

### 3. Telegram Bot Variables (Bot va Bildirishnomalar)
| Variable Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `TELEGRAM_BOT_TOKEN` | Yes | BotFather dan olingan bot tokeni. | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` |
| `TELEGRAM_FACTORY_CHANNEL_ID` | Yes | Yangi buyurtmalar/lead lar tushadigan kanal ID si. | `-1001234567890` |
| `TELEGRAM_SUPPORT_GROUP_ID` | Yes | Mijozlar bilan xat yozishiladigan guruh ID si. | `-1009876543210` |
| `ADMIN_TELEGRAM_IDS` | Yes | Bot administratorlarining Telegram ID lari (vergul bilan ajratilgan). | `11111111,22222222` |
| `TELEGRAM_WEBHOOK_SECRET` | Yes | Webhook xavfsizligi uchun maxfiy kalit. | `super-secret-webhook-token` |

*Qanday olish mumkin?* Kanal yoki guruh ID sini olish uchun Telegramda veb versiyaga kiring yoki `@RawDataBot` kabi botlarga guruhdan xabar uzating (forward qiling). Guruh/Superguruh/Kanal ID lari odatda `-100` bilan boshlanadi.

### 4. Media Storage (Supabase — Web va Telegram Bot)
| Variable Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase loyihangiz manzili (Web vitrina va Telegram Bot uchun). | `https://xyz123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase Public / Anon API kaliti. | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase Service Role kaliti (Server va Bot uchun to'liq huquqli kalit). | `eyJhbGci...` |

*Qanday olish mumkin?* Supabase Dashboard -> Project Settings -> API bo'limiga kiring. Project URL va anon/service_role key'ni nusxalang.
*Muhim:* Telegram Bot orqali admin yangi mebel rasmini yuklaganda, rasm to'g'ridan-to'g'ri ushbu Supabase Storage ga joylanadi va umumiy ochiq URL saqlanadi (Telegram bot tokeni fosh bo'lmaydi).

### 5. Auth / Security (Avtorizatsiya)
| Variable Name | Required | Description | Example Value |
| --- | --- | --- | --- |
| `JWT_SECRET` | Yes | JWT (jose) va sessiyalar shifrlash uchun kamida 32 ta belgidan iborat maxfiy kalit. | `random-string-generate-with-openssl` |
| `ADMIN_INITIAL_PASSWORD` | Optional | Dastlabki admin foydalanuvchini DB seed qilishda o'rnatiladigan parol. | `StrongAdminPass2026!` |
| `TELEGRAM_WEBHOOK_SECRET` | Yes | Telegram Webhook so'rovlarini verifikatsiya qilish uchun maxfiy token (X-Telegram-Bot-Api-Secret-Token). | `random-webhook-secret-token` |

*Qanday olish mumkin?* `JWT_SECRET` va `TELEGRAM_WEBHOOK_SECRET` yaratish uchun terminalda `openssl rand -base64 32` yoki `openssl rand -hex 24` buyrug'ini ishlating.

---

## Security Notes (Xavfsizlik eslatmalari)
- `.env` faylini **HECH QACHON** Git repozitoriyasiga yuklamang (`.gitignore` da ko'rsatilganiga ishonch hosil qiling).
- `NEXT_PUBLIC_` bilan boshlanuvchi barcha o'zgaruvchilar brauzerda (frontend) ochiq ko'rinadi. Ularga hech qachon maxfiy kalitlar, parollar yoki Secret API key'larni yozmang.
- Server tomonidagi (backend, bot) maxfiy kalitlar (masalan `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`) faqat server muhitida (Node.js/Next.js API routes) o'qilishi kerak.
- `JWT_SECRET` xavfsizlik talablariga javob berishi uchun kamida **32 ta belgidan** iborat bo'lishi shart.

## Development vs Production
- **Local (Development)**: Barcha `URL` larga `localhost` ko'rsatiladi, bot uchun ehtimol "Test" bot tokeni ishlatiladi, Supabase uchun ehtimol alohida "Dev" loyiha olinadi.
- **Production**: Vercel yoki VPS da ishga tushirayotganda haqiqiy domenlar (`https://mebel-salon.uz`), haqiqiy Production Bot Token va kuchli `JWT_SECRET` ko'rsatiladi.
