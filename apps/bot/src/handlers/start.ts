import { prisma } from "@mebel-salon/db";
import type { MyContext } from "../types/index";
import { getMainMenuKeyboard } from "../keyboards/main-menu";
import { isAdmin } from "../config";

export async function handleStart(ctx: MyContext): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  const isAdminUser = isAdmin(userId);

  // Deep link tekshiruvi: ctx.match da payload bo'ladi
  const match = ctx.match;

  if (match && typeof match === "string" && match.trim() !== "") {
    const trimmed = match.trim();
    if (trimmed.startsWith("order_product_")) {
      const prodId = trimmed.replace("order_product_", "").trim();
      const product = await prisma.product.findFirst({
        where: { OR: [{ id: prodId }, { slug: prodId }] },
        include: { category: true },
      });

      if (product) {
        ctx.session.applyItem = {
          type: "product",
          id: product.id,
          title: product.titleUz,
          details: product.category.nameUz,
        };
      }
      await ctx.conversation.enter("applyConversation");
      return;
    }

    if (trimmed.startsWith("order_set_")) {
      const colId = trimmed.replace("order_set_", "").trim();
      const collection = await prisma.collection.findFirst({
        where: { OR: [{ id: colId }, { slug: colId }] },
        include: { products: true },
      });

      if (collection) {
        ctx.session.applyItem = {
          type: "collection",
          id: collection.id,
          title: collection.titleUz,
          details: `${collection.products.length} ta mebel`,
        };
      }
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
