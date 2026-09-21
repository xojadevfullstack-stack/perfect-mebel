import { Bot } from "grammy";
import dotenv from "dotenv";

dotenv.config();

const token = process.env["TELEGRAM_BOT_TOKEN"];

if (!token) {
  process.stderr.write("TELEGRAM_BOT_TOKEN aniqlanmadi. Iltimos, .env faylini tekshiring.\n");
}

export const bot = new Bot(token || "dummy-token-for-typecheck");

bot.command("start", async (ctx) => {
  await ctx.reply(
    "Assalomu alaykum! Mebel Salon rasmiy botiga xush kelibsiz.\n\n" +
      "Bu bot orqali mahsulotlarimizni ko'rishingiz va to'g'ridan-to'g'ri zavodga ariza yuborishingiz mumkin."
  );
});
