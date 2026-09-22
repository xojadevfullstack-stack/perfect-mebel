# 📊 Loyiha Holati (Project State)

> **Oxirgi yangilanish:** 2026-09-21  
> **Sprint:** MVP (7 kun)  
> **Deadline:** 2026-09-27

---

## 🎯 Umumiy Progress

| Komponent | Holat | Progress |
|-----------|-------|----------|
| 📁 Loyiha Setup (monorepo, config) | 🟩 Bajarildi | 100% |
| 🗃 Ma'lumotlar Bazasi (Prisma + PostgreSQL) | 🟩 Bajarildi | 100% |
| 🔧 Web Admin Panel | 🟩 Bajarildi | 100% |
| 🌐 Veb-Vitrina (Mijoz sahifasi) | 🟩 Bajarildi | 100% |
| 🤖 Telegram Bot (Mijoz) | 🟩 Bajarildi | 100% |
| 🤖 Telegram Bot (Admin) | 🟩 Bajarildi | 100% |
| 📢 Telegram Kanal integratsiya | 🟩 Bajarildi | 100% |
| 💬 Live Chat (Support guruh) | 🟩 Bajarildi | 100% |
| 🚀 Deploy | ⬜ Boshlanmagan | 0% |

---

## 📅 Sprint Rejasi

### Kun 1 — Loyiha Infratuzilmasi
- [x] Monorepo tuzilishi yaratish (`apps/web`, `apps/bot`, `packages/db`)
- [x] TypeScript, ESLint, Prettier config
- [x] Next.js 14 + Tailwind CSS + shadcn/ui setup
- [x] Prisma schema yozish (PRD v2.0 dan)
- [x] PostgreSQL bazasini sozlash (Neon Cloud PostgreSQL ulangan)
- [x] `prisma migrate deploy` — bazani yaratish va migratsiyalarni qo'llash
- [x] Dastlabki ma'lumotlarni seed qilish (Admin + Kategoriyalar)
- [x] `.env` va `.env.example` tayyorlash
- [x] Git repo init + `.gitignore`

### Kun 2 — Admin Panel: Auth + Kategoriyalar + Mebellar
- [x] Admin login sahifasi (JWT auth)
- [x] Auth middleware (protected routes, Edge-compatible jose)
- [x] Kategoriyalar CRUD API (Admin + Public)
- [x] Mebellar CRUD API (Admin + Public)
- [x] Dark/Light mode toggle (next-themes)
- [x] Kategoriyalar & Mebellar boshqaruv UI (jadval + forma + react-hook-form + zod)

### Kun 3 — Admin Panel: Komplektlar + Arizalar
- [x] Komplektlar CRUD (tarkibiy mebellarni biriktirish)
- [x] Rasm galereyasi boshqaruvi
- [x] Arizalar (Leads) jadvali (faqat ko'rish)
- [x] Admin panel responsive tuning
- [x] Supabase Storage yoki Cloudinary integratsiya

### Kun 4 — Veb-Vitrina: Bosh sahifa + Katalog
- [x] Layout: Header (til, tema, navigatsiya), Footer
- [x] Bosh sahifa: Hero, ommabop mebellar, komplektlar slayderi
- [x] Katalog sahifasi: toifalar tabs, filtrlar, qidiruv
- [x] Mahsulot karta komponenti
- [x] `next-intl` setup (UZ/RU/EN tarjima fayllari)
- [x] `next-themes` setup

### Kun 5 — Veb-Vitrina: Komplektlar + Ariza tizimi
- [x] Komplektlar sahifasi + ichki checklist
- [x] "Mening tanlovlarim" (zustand store + floating widget)
- [x] Ariza modali (react-hook-form + zod)
- [x] `POST /api/leads` endpoint
- [x] Telegram kanaliga xabarnoma yuborish
- [x] Aloqa sahifasi

### Kun 6 — Telegram Bot
- [x] grammY bot setup + `/start` buyrug'i
- [x] Deep link ariza FSM (4 bosqich)
- [x] Ichki katalog (inline keyboard bilan)
- [x] Admin bot: Kategoriya/Mebel/Komplekt CRUD FSM
- [x] Live Chat: Mijoz → Support guruh → Reply → Mijoz
- [x] Zavod kanaliga xabarnoma

### Kun 7 — Integratsiya, Deploy, QA
- [ ] End-to-end test: Sayt ariza → DB → Kanal xabarnoma
- [ ] End-to-end test: Bot ariza → DB → Kanal xabarnoma
- [ ] Live Chat test
- [ ] Vercel deploy (web)
- [ ] VPS Docker deploy (bot + DB)
- [ ] Webhook setup
- [ ] Admin user seed
- [ ] Bug fix va polish
- [ ] Final QA

---

## 🐛 Ma'lum Muammolar

| # | Muammo | Holat | Prioritet |
|---|--------|-------|-----------|
| — | Hozircha muammo yo'q | — | — |

---

## 📝 Qarorlar Jurnali

| Sana | Qaror | Sabab |
|------|-------|-------|
| 2026-09-20 | PRD v2.0 tasdiqlandi | Narxlar olib tashlandi, vitrina modeli qabul qilindi |
| 2026-09-20 | Texnologiya steki aniqlandi | Next.js + grammY + Prisma + PostgreSQL |
| 2026-09-20 | Barcha MD hujjatlar yaratildi | Loyiha dokumentatsiyasi to'liq tayyorlandi |
| 2026-09-21 | Baza Neon Cloud PostgreSQL ga ulandi | Bulutli ma'lumotlar bazasi va serverless ulanish uchun |

---

## 🔗 Muhim Havolalar

| Hujjat | Manzil |
|--------|--------|
| MVP Roadmap | `MVP_ROADMAP.md` |
| PRD v2.0 | `mebel web site PRD v2.0.md` |
| Arxitektura | `docs/ARCHITECTURE.md` |
| API Hujjat | `docs/API.md` |
| DB Hujjat | `docs/DATABASE.md` |
| Deploy | `docs/DEPLOYMENT.md` |
| Telegram Bot | `docs/TELEGRAM_BOT.md` |
| Coding Standards | `docs/CODING_STANDARDS.md` |
| Setup | `docs/SETUP.md` |
| ENV Variables | `docs/ENV_VARIABLES.md` |
| i18n | `docs/I18N.md` |
| Admin Panel | `docs/ADMIN_PANEL.md` |

---

> ⚠️ **Bu fayl har kuni yangilanishi kerak.** Agent yoki dasturchi progress bo'yicha checkboxlarni belgilab borishi shart.
