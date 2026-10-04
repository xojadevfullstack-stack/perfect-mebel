/**
 * Telegram Bot Webhook o'rnatish skripti.
 * 
 * Ishga tushirish: pnpm bot:set-webhook
 * Talab:
 * - allowed_updates ko'rsatiladi
 * - drop_pending_updates berilmaydi (mavjud xabarlar yo'qolmasligi uchun)
 */

import dotenv from "dotenv";
import path from "path";

// .env yuklash
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function setTelegramWebhook(): Promise<void> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const appUrl = process.env["NEXT_PUBLIC_APP_URL"] || process.env["APP_URL"];
  const webhookSecret = process.env["TELEGRAM_WEBHOOK_SECRET"];

  if (!token) {
    process.stderr.write("❌ Xatolik: TELEGRAM_BOT_TOKEN .env faylda topilmadi.\n");
    process.exit(1);
  }

  if (!appUrl) {
    process.stderr.write("❌ Xatolik: NEXT_PUBLIC_APP_URL .env faylda topilmadi (masalan, https://mebel.vercel.app).\n");
    process.exit(1);
  }

  if (!webhookSecret) {
    process.stderr.write("❌ Xatolik: TELEGRAM_WEBHOOK_SECRET .env faylda topilmadi.\n");
    process.exit(1);
  }

  const webhookUrl = `${appUrl.replace(/\/+$/, "")}/api/bot`;

  const payload = {
    url: webhookUrl,
    secret_token: webhookSecret,
    allowed_updates: ["message", "callback_query", "channel_post", "edited_message"],
  };

  process.stdout.write(`📡 Webhook o'rnatilmoqda...\n`);
  process.stdout.write(`   URL: ${webhookUrl}\n`);
  process.stdout.write(`   Allowed Updates: ${payload.allowed_updates.join(", ")}\n`);
  process.stdout.write(`   Secret Token: ***${webhookSecret.slice(-4)}\n\n`);

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { ok: boolean; description?: string };

    if (result.ok) {
      process.stdout.write("✅ Webhook muvaffaqiyatli o'rnatildi!\n");
      process.stdout.write(`   Telegram javobi: ${result.description || "OK"}\n`);
    } else {
      process.stderr.write(`❌ Telegram xatoligi: ${result.description}\n`);
      process.exit(1);
    }
  } catch (error) {
    process.stderr.write(`❌ Tarmoq xatoligi: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  }
}

setTelegramWebhook();
