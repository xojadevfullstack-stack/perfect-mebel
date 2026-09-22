import type { MyContext } from "../types/index.js";
import { getMainMenuKeyboard } from "../keyboards/main-menu.js";
import { isAdmin } from "../config.js";

export async function handleStart(ctx: MyContext): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  const isAdminUser = isAdmin(userId);

  // Deep link tekshiruvi: ctx.match da payload bo'ladi
  const match = ctx.match;

  if (match && typeof match === "string" && match.trim() !== "") {
    const trimmed = match.trim();
    if (trimmed.startsWith("order_product_") || trimmed.startsWith("order_set_")) {
      // Deep link orqali to'g'ridan-to'g'ri ariza conversation ga kirish
      await ctx.conversation.enter("applyConversation");
      return;
    }
  }

  const welcomeMessage =
    `👋 *Assalomu alaykum, ${ctx.from?.first_name || "hurmatli mijoz"}!*\n\n` +
    `🛋 *Mebel Salon* rasmiy botiga xush kelibsiz.\n\n` +
    `Bu yerda siz:\n` +
    `• Zamonaviy mebellarimiz katalogini ko'rishingiz\n` +
    `• Xonangiz uchun to'liq garnitur to'plamlarni tanlashingiz\n` +
    `• To'g'ridan-to'g'ri ishlab chiqaruvchiga ariza qoldirishingiz\n` +
    `• Menejerlarimiz bilan jonli muloqot qilishingiz mumkin.\n\n` +
    `Quyidagi menyudan kerakli bo'limni tanlang:`;

  await ctx.reply(welcomeMessage, {
    parse_mode: "Markdown",
    reply_markup: getMainMenuKeyboard(isAdminUser),
  });
}
