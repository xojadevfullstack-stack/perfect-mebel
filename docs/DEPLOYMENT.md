# Deployment Guide (O'rnatish qo'llanmasi)

Ushbu hujjat Mebel Salon loyihasini ishlab chiqarish (production) muhitiga joylashtirish bo'yicha to'liq qo'llanmani o'z ichiga oladi. Loyihani joylashtirishning turli xil usullari mavjud.

## Option A: Vercel (Web) + VPS (Bot + DB) - Tavsiya etiladi

Bu usul Next.js frontend uchun Vercel'ning afzalliklaridan foydalanish imkonini beradi va Telegram Bot hamda ma'lumotlar bazasini o'zingizning VPS serveringizda saqlashga imkon beradi.

### 1. Vercel Setup (Web)
Vercel Next.js ilovalarini joylashtirish uchun eng yaxshi platformadir.

1. Vercel.com saytida ro'yxatdan o'ting.
2. **Add New Project** (Yangi loyiha qo'shish) tugmasini bosing va GitHub reponi ulang.
3. Loyiha sozlamalarida **Environment Variables** (Muhit o'zgaruvchilari) ni sozlang:
   - `DATABASE_URL` (VPS dagi PostgreSQL havolasi)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL` va `NEXT_PUBLIC_SUPABASE_ANON_KEY` (yoki Cloudinary credentials)
4. **Build Command**: `npm run build`
5. **Output Directory**: `.next`
6. O'rnatishni boshlash (Deploy) tugmasini bosing.
7. **Custom domain setup**: Vercel'ning **Domains** bo'limidan loyihaga o'zingizning shaxsiy domeningizni ulab, DNS yozuvlarini sozlang.

### 2. VPS Setup (Bot + Database)
Bot va bazani joylashtirish uchun arzon VPS (masalan, DigitalOcean, Hetzner, AWS) kifoya qiladi.

**Talablar:** Ubuntu 22.04 LTS, kamida 1GB RAM.

**Docker va Docker Compose o'rnatish:**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl enable docker
sudo systemctl start docker
```

**Reponi klonlash va `.env` ni sozlash:**
```bash
git clone https://github.com/your-username/mebel-salon.git
cd mebel-salon
cp .env.example .env
nano .env # Barcha kerakli o'zgaruvchilarni kiriting
```

**docker-compose.yml (PostgreSQL + Bot uchun):**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432" # Eslatma: UFW orqali ushbu portni himoyalash tavsiya etiladi (masalan, faqat Vercel IP lari uchun ochiq qoldiring)
    volumes:
      - pgdata:/var/lib/postgresql/data

  bot:
    build: 
      context: .
      dockerfile: Dockerfile.bot
    restart: always
    env_file: .env
    depends_on:
      - db

volumes:
  pgdata:
```

**Nginx Reverse Proxy (Opsional):**
Nginx orqali VPS IP manzilini yashirish va tashqi API yo'naltirish imkoniyati.
**SSL with Let's Encrypt (Opsional):**
Certbot yordamida Nginx server uchun bepul SSL sertifikat olish tavsiya etiladi.

**Systemd service for auto-restart:** Docker Compose o'zining `restart: always` xususiyati orqali konteynerlarni qayta ishga tushiradi, lekin alohida jarayonlar uchun systemd service fayl (masalan `/etc/systemd/system/mebel-bot.service`) yaratish ham mumkin.

---

## Option B: Railway (All-in-one)
Railway barcha xizmatlarni (Baza, Web, Bot) bitta joyda saqlash uchun eng qulay cloud platforma hisoblanadi.

1. Railway.app saytida GitHub repo orqali yangi loyiha yarating.
2. **Setup PostgreSQL service**: Railway'dan yangi "Database -> PostgreSQL" qo'shing.
3. **Deploy Next.js**: Reponi tanlang va build komandasini ko'rsating (`npm run build`).
4. **Deploy Bot**: Bot uchun alohida xizmat yarating va loyiha sozlamalarida `Dockerfile.bot` orqali ishga tushirishni ko'rsating.
5. **Environment Variables**: Railway avtomatik ravishda `DATABASE_URL` ni barcha xizmatlarga ulaydi, boshqa `.env` o'zgaruvchilarini "Variables" bo'limida kiriting.

---

## Option C: Full VPS Docker
Barcha xizmatlarni (PostgreSQL, Next.js, Bot, Nginx) bitta VPS ga joylashtirish.

**docker-compose.yml (to'liq tizim uchun):**
```yaml
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - pgdata:/var/lib/postgresql/data

  web:
    build:
      context: .
      dockerfile: Dockerfile.web
    restart: always
    ports:
      - "3000:3000"
    env_file: .env
    depends_on:
      - db

  bot:
    build:
      context: .
      dockerfile: Dockerfile.bot
    restart: always
    env_file: .env
    depends_on:
      - db

volumes:
  pgdata:
```

### .dockerignore
Loyiha ildizida `.dockerignore` fayli yaratish tavsiya etiladi:
```text
node_modules
.next
.git
.env
.env.*
docs
*.md
.github
.agents
```

### Dockerfile.web
```dockerfile
# ===== Build Stage =====
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ===== Production Stage =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
EXPOSE 3000
CMD ["node", "server.js"]
```

### Dockerfile.bot
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "start:bot"]
```

---

## Post-deployment (O'rnatishdan keyingi qadamlar)

### 1. Database Migration (Prisma)
Production bazaga jadvallarni yaratish va strukturalash:
```bash
npx prisma migrate deploy
```

### 2. Seed Admin User
Admin panelga kirish uchun boshlang'ich admin hisobini yaratish:
```bash
npm run seed
# Yoki VPS dagi container ichida:
docker exec -it mebel_web npx prisma db seed
```

### 3. Telegram Webhook (Opsional)
Agar bot webhook orqali ishlasa (Long Polling emas), Telegram API dan foydalanib webhook url o'rnatish kerak:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-domain.com/api/bot" \
  -d "secret_token=<YOUR_WEBHOOK_SECRET>"
```

### 4. Health Check Endpoints
- `/api/health` orqali Next.js tizimi ishlashini tekshiring.

### 5. Monitoring, Logging va Backups
- **Monitoring & Logging**: Docker logs orqali bot va web xatoliklarni kuzatish: `docker logs -f mebel_bot`. CloudWatch yoki DataDog kabi xizmatlarni ulash ham tavsiya qilinadi.
- **Backup Strategy (pg_dump cron)**: Har kuni tungi soat 2 da bazani saqlash uchun cron task:
  ```bash
  0 2 * * * docker exec db pg_dump -U user mebel_db > /backups/db_backup_$(date +\%F).sql
  ```

---

## CI/CD (Optional)
GitHub Actions workflow orqali avtomatik joylashtirish (auto-deploy).
`.github/workflows/deploy.yml` fayli yaratilib, har safar `main` branch ga kod push qilinganda VPS ga SSH orqali ulanib, quyidagi amallar bajariladi:
- `git pull`
- `docker-compose build`
- `docker-compose up -d`
- `npx prisma migrate deploy`
