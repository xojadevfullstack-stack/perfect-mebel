import { InlineKeyboard } from "grammy";
import { prisma } from "@mebel-salon/db";
import type { MyContext } from "../types/index";
import { isAdmin } from "../config";

export function getAdminMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("➕ Yangi kategoriya", "admin_add_cat")
    .row()
    .text("➕ Yangi mebel", "admin_add_prod")
    .row()
    .text("➕ Yangi to'plam (komplekt)", "admin_add_col")
    .row()
    .text("📊 Umumiy statistika", "admin_stats");
}

export async function handleAdminMenu(ctx: MyContext): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Kechirasiz, sizda ma'mur huquqlari mavjud emas.");
    return;
  }

  const text =
    `⚙️ *Mebel Salon — Admin Boshqaruv Paneli*\n\n` +
    `Kerakli bo'limni tanlang:`;

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "Markdown",
        reply_markup: getAdminMenuKeyboard(),
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: "Markdown",
        reply_markup: getAdminMenuKeyboard(),
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: getAdminMenuKeyboard(),
    });
  }
}

export async function handleAdminStats(ctx: MyContext): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) return;

  const [categoriesCount, productsCount, collectionsCount, leadsCount] =
    await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.collection.count(),
      prisma.lead.count(),
    ]);

  const webLeadsCount = await prisma.lead.count({ where: { source: "WEB" } });
  const botLeadsCount = await prisma.lead.count({ where: { source: "BOT" } });

  const text =
    `📊 *Loyiha statistikasi*\n\n` +
    `📁 Kategoriyalar: *${categoriesCount} ta*\n` +
    `🛋 Mebellar: *${productsCount} ta*\n` +
    `🗂 To'plamlar: *${collectionsCount} ta*\n\n` +
    `📝 *Jami arizalar:* *${leadsCount} ta*\n` +
    `  • 🌐 Veb-saytdan: *${webLeadsCount} ta*\n` +
    `  • 🤖 Telegram botdan: *${botLeadsCount} ta*`;

  const keyboard = new InlineKeyboard().text("⬅️ Admin menyuga qaytish", "admin_menu");

  if (ctx.callbackQuery) {
    await ctx.editMessageText(text, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
    await ctx.answerCallbackQuery();
  } else {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  }
}
