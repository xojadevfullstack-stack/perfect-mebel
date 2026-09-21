---
name: deploy-production
description: >-
  Use this skill when deploying the Mebel Salon project to production —
  Vercel for the web app, VPS with Docker for the Telegram bot and PostgreSQL,
  or Railway as an all-in-one solution.
---

# Production Deploy

Bu skill loyihani ishlab chiqarish muhitiga chiqarish yo'riqnomasi.

## Variant A: Vercel (Web) + VPS (Bot + DB)

### 1. Vercel Deploy (Web + Admin Panel)

```bash
# Vercel CLI o'rnatish
npm i -g vercel

# Deploy
cd apps/web
vercel

# Environment variables sozlash (Vercel Dashboard):
# DATABASE_URL, JWT_SECRET, BOT_TOKEN,
# FACTORY_CHANNEL_ID, NEXT_PUBLIC_SUPABASE_URL, ...
```

### 2. VPS Setup (Bot + PostgreSQL)

```bash
# SSH orqali serverga kirish
ssh root@your-server-ip

# Docker o'rnatish
curl -fsSL https://get.docker.com | sh

# Docker Compose o'rnatish
apt install docker-compose-plugin

# Loyihani klonlash
git clone <repo-url> /opt/mebel-salon
cd /opt/mebel-salon

# .env faylni sozlash
cp .env.example .env
nano .env

# Ishga tushirish
docker compose up -d

# DB migration
docker compose exec bot npx prisma migrate deploy

# Admin user seed
docker compose exec bot npx prisma db seed
```

### docker-compose.yml (VPS uchun)

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: mebel
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: mebel_db
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

  bot:
    build: ./apps/bot
    depends_on:
      - postgres
    env_file: .env
    restart: unless-stopped

volumes:
  pgdata:
```

### 3. Telegram Webhook Sozlash

```bash
# Webhook o'rnatish (Vercel endpoint)
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/webhook"}'

# Webhook holatini tekshirish
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

---

## Variant B: Railway (Hammasi Bir Joyda)

```bash
# Railway CLI
npm i -g @railway/cli
railway login

# PostgreSQL service qo'shish
railway add --plugin postgresql

# Web deploy
cd apps/web
railway up

# Bot deploy
cd apps/bot
railway up

# Environment variables Railway Dashboard dan sozlash
```

---

## Post-Deploy Tekshirish Ro'yxati

- [ ] Sayt HTTPS da ochiladi
- [ ] Admin panel login ishlaydi
- [ ] Kategoriya/Mebel CRUD ishlaydi
- [ ] Rasm upload ishlaydi
- [ ] Katalog sahifasi to'g'ri yuklanadi
- [ ] 3 tilda to'g'ri ishlaydi
- [ ] Dark/Light mode ishlaydi
- [ ] Ariza modali ishlaydi va bazaga saqlanadi
- [ ] Telegram bot `/start` ga javob beradi
- [ ] Deep link ariza ishlaydi
- [ ] Kanalga xabarnoma keladi
- [ ] Live Chat ishlaydi

---

## DB Backup Cron

```bash
# Har kuni soat 3:00 da backup
crontab -e

# Qo'shish:
0 3 * * * docker exec mebel-postgres pg_dump -U mebel mebel_db | gzip > /opt/backups/mebel_$(date +\%Y\%m\%d).sql.gz
```

## Monitoring

```bash
# Docker loglarni ko'rish
docker compose logs -f bot
docker compose logs -f postgres

# Disk va RAM tekshirish
df -h
free -m
```
