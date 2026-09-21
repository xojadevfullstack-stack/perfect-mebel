---
name: telegram-bot-setup
description: >-
  Use this skill when setting up the Telegram Bot with grammY framework,
  including customer-facing catalog, deep link application flow, admin CRUD
  via FSM conversations, live chat relay, and factory channel notifications.
---

# Telegram Bot Setup (grammY)

Bu skill Mebel Salon Telegram botini noldan yaratish uchun yo'riqnoma.

## Talablar

- Node.js 20+
- Telegram Bot Token (@BotFather dan)
- PostgreSQL (Prisma orqali)
- Zavod kanali va Support guruhi yaratilgan

## 1. Loyiha Tuzilishi

```
apps/bot/
├── src/
│   ├── index.ts              # Entry point
│   ├── bot.ts                # Bot instance + middleware
│   ├── config.ts             # Environment variables
│   ├── commands/
│   │   ├── start.ts          # /start + deep link parsing
│   │   ├── catalog.ts        # /catalog — toifalar ko'rish
│   │   ├── collections.ts    # /collections — komplektlar
│   │   ├── help.ts           # /help
│   │   └── admin.ts          # /admin — admin menyu
│   ├── conversations/
│   │   ├── order-flow.ts     # 4-bosqichli ariza FSM
│   │   ├── add-category.ts   # Admin: kategoriya qo'shish
│   │   ├── add-product.ts    # Admin: mebel qo'shish
│   │   ├── add-collection.ts # Admin: komplekt qo'shish
│   │   ├── edit-product.ts   # Admin: mebel tahrirlash
│   │   └── search.ts         # Admin: qidirish
│   ├── handlers/
│   │   ├── callback.ts       # Inline keyboard callback lar
│   │   ├── live-chat.ts      # Mijoz ↔ Support guruh relay
│   │   └── media.ts          # Rasm qabul qilish
│   ├── keyboards/
│   │   ├── main-menu.ts      # Asosiy menyu
│   │   ├── categories.ts     # Toifalar inline keyboard
│   │   └── admin-menu.ts     # Admin menyu
│   ├── services/
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── channel.ts        # Kanal xabarnoma yuborish
│   │   └── upload.ts         # Rasm saqlash
│   └── utils/
│       ├── guards.ts         # isAdmin tekshiruvi
│       ├── format.ts         # Xabar formatlash
│       └── i18n.ts           # Bot ichki tarjimalar
├── package.json
├── tsconfig.json
└── Dockerfile
```

## 2. O'rnatish

```bash
mkdir -p apps/bot/src
cd apps/bot

npm init -y
npm install grammy @grammyjs/conversations @grammyjs/menu @grammyjs/hydrate @grammyjs/runner @grammyjs/session
npm install @prisma/client dotenv
npm install -D typescript @types/node tsx prisma
```

## 3. Bot Instance Yaratish

```typescript
// src/bot.ts
import { Bot, session } from "grammy";
import { conversations, createConversation } from "@grammyjs/conversations";
import { hydrate } from "@grammyjs/hydrate";
import type { MyContext } from "./types";

const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

// Middleware
bot.use(session({ initial: () => ({}) }));
bot.use(hydrate());
bot.use(conversations());

export { bot };
```

## 4. Deep Link Ariza Oqimi

Format: `t.me/<BOT>?start=order_product_<ID>` yoki `t.me/<BOT>?start=order_set_<ID>`

```
/start order_product_abc123
  → 1. Mahsulot rasm + nomini ko'rsatish
  → 2. "Ismingizni kiriting:" (matn)
  → 3. "Telefon raqamingiz:" (kontakt tugma yoki matn)
  → 4. "Manzilingiz:" (geolokatsiya yoki matn) + "Izoh:" (ixtiyoriy)
  → Lead bazaga saqlanadi
  → Kanal ga xabarnoma yuboriladi
  → "✅ Arizangiz qabul qilindi!"
```

## 5. Live Chat Relay

```
Mijoz → bot ga savol yozadi
  → Bot xabarni SUPPORT_GROUP_ID ga forward qiladi
  → SupportMessage { groupMessageId, userTelegramId } saqlanadi
  
Menejer → guruhdagi xabarga Reply qiladi
  → Bot Reply ni ushlaydi
  → groupMessageId bo'yicha userTelegramId ni topadi
  → Javobni mijozga yuboradi
```

## 6. Admin Ruxsat Tekshiruvi

```typescript
// src/utils/guards.ts
const ADMIN_IDS = process.env.ADMIN_TELEGRAM_IDS?.split(",") ?? [];

export function isAdmin(telegramId: number): boolean {
  return ADMIN_IDS.includes(String(telegramId));
}
```

## 7. Kanal Xabarnoma Formati

```typescript
// src/services/channel.ts
export async function sendLeadNotification(bot: Bot, lead: Lead) {
  const text = `🔔 YANGI ARIZA!\n\n` +
    `👤 Mijoz: ${lead.customerName}\n` +
    `📞 Telefon: ${lead.phone}\n` +
    `📍 Manzil: ${lead.address ?? "Ko'rsatilmagan"}\n` +
    `🛋 Tanlangan mebel(lar):\n   ${lead.itemsSummary}\n` +
    `📝 Izoh: ${lead.notes ?? "—"}\n` +
    `📅 Sana: ${new Date().toLocaleString("uz-UZ")}`;

  await bot.api.sendMessage(process.env.FACTORY_CHANNEL_ID!, text);
}
```

## 8. Ishga Tushirish

### Development (Long Polling)
```bash
cd apps/bot
npx tsx src/index.ts
```

### Production (Docker)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate
CMD ["node", "dist/index.js"]
```

## 9. Tekshirish

- [ ] `/start` buyrug'i ishlaydi
- [ ] Deep link orqali ariza berish 4 bosqichda o'tadi
- [ ] Ariza bazaga saqlanadi
- [ ] Kanal ga xabarnoma keladi
- [ ] Admin buyruqlari faqat ruxsat berilgan IDlar uchun ochiq
- [ ] Live Chat relay ishlaydi
