import { InlineKeyboard } from "grammy";
import { prisma } from "@mebel-salon/db";
import { escapeHtml } from "@mebel-salon/shared";
import type { MyContext } from "../types/index";
import { isAdmin } from "../config";

export function getAdminMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("📋 So'nggi arizalar", "admin_leads")
    .row()
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

export async function handleAdminLeads(ctx: MyContext): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Kechirasiz, sizda ma'mur huquqlari mavjud emas.");
    return;
  }

  const leads = await prisma.lead.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const keyboard = new InlineKeyboard()
    .text("🔄 Yangilash", "admin_leads")
    .row()
    .text("⬅️ Admin menyuga qaytish", "admin_menu");

  if (leads.length === 0) {
    const text = "📋 Hozircha arizalar mavjud emas.";
    if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { reply_markup: keyboard });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
    return;
  }

  let text = `📋 <b>So'nggi 5 ta ariza:</b>\n\n`;
  leads.forEach((l, idx) => {
    const dateStr = new Date(l.createdAt).toLocaleDateString("uz-UZ", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
    const sourceIcon = l.source === "WEB" ? "🌐" : "🤖";
    const code = `PM-${l.id.slice(0, 6).toUpperCase()}`;
    text += `${idx + 1}. ${sourceIcon} <b>${escapeHtml(l.customerName)}</b> (#${code})\n`;
    text += `   📞 <a href="tel:${escapeHtml(l.phone)}">${escapeHtml(l.phone)}</a> (${dateStr})\n`;
    text += `   🛋 ${escapeHtml(l.itemsSummary)}\n`;
    if (l.address) text += `   🏠 ${escapeHtml(l.address)}\n`;
    if (l.notes) text += `   📝 <i>${escapeHtml(l.notes)}</i>\n`;
    text += `\n`;
  });

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: keyboard,
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
