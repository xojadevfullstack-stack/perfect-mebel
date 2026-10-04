import { prisma } from "@mebel-salon/db";
import type { MyConversation, MyContext } from "../types/index.js";
import { getCancelKeyboard, getMainMenuKeyboard } from "../keyboards/main-menu.js";
import { isAdmin } from "../config.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function adminAddCollectionConversation(
  conversation: MyConversation,
  ctx: MyContext
): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Ruxsat berilmagan.");
    return;
  }

  // 1. Komplekt nomi
  await ctx.reply(
    "🗂 Yangi to'plam (garnitur) nomini kiriting:\nMasalan: Premium Yotoqxona To'plami",
    { reply_markup: getCancelKeyboard() }
  );

  const titleCtx = await conversation.wait();
  if (titleCtx.message?.text === "❌ Bekor qilish") {
    await titleCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const titleUz = titleCtx.message?.text?.trim() || "";

  // 2. Tavsif
  await ctx.reply(
    "ℹ️ To'plam haqida qisqacha tavsif kiriting:\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const descCtx = await conversation.wait();
  if (descCtx.message?.text === "❌ Bekor qilish") {
    await descCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const descText = descCtx.message?.text?.trim();
  const descUz = descText && descText !== "-" ? descText : null;

  // 3. Rasmlar
  await ctx.reply(
    "🖼 To'plam rasmlarining URL manzillarini kiriting (vergul bilan) yoki '-' yuboring:",
    { reply_markup: getCancelKeyboard() }
  );

  const imgCtx = await conversation.wait();
  if (imgCtx.message?.text === "❌ Bekor qilish") {
    await imgCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }

  const images: string[] = [];
  if (imgCtx.message?.text && imgCtx.message.text !== "-") {
    imgCtx.message.text
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http"))
      .forEach((url) => images.push(url));
  }

  // Slug
  let baseSlug = slugify(titleUz) || `col-${Date.now()}`;
  let finalSlug = baseSlug;
  let counter = 1;

  while (
    await conversation.external(() =>
      prisma.collection.findUnique({ where: { slug: finalSlug } })
    )
  ) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  try {
    const newCol = await conversation.external(() =>
      prisma.collection.create({
        data: {
          titleUz,
          titleRu: titleUz,
          titleEn: titleUz,
          descUz,
          descRu: descUz,
          descEn: descUz,
          images,
          slug: finalSlug,
        },
      })
    );

    await ctx.reply(
      `✅ *Yangi to'plam muvaffaqiyatli saqlandi!*\n\n` +
        `🗂 Nomi: *${newCol.titleUz}*\n` +
        (newCol.descUz ? `ℹ️ Tavsif: ${newCol.descUz}\n` : "") +
        `🔗 Slug: \`${newCol.slug}\`\n\n` +
        `Mebellarni ushbu to'plamga biriktirish uchun Web Admin Panel yoki botdan foydalanishingiz mumkin.`,
      {
        parse_mode: "Markdown",
        reply_markup: getMainMenuKeyboard(true),
      }
    );
  } catch (error) {
    process.stderr.write(
      `To'plamni saqlashda xatolik: ${error instanceof Error ? error.message : String(error)}\n`
    );
    await ctx.reply(
      "To'plamni saqlashda server xatoligi yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      { reply_markup: getMainMenuKeyboard(true) }
    );
  }
}
