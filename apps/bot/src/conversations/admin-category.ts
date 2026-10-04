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

export async function adminAddCategoryConversation(
  conversation: MyConversation,
  ctx: MyContext
): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Ruxsat berilmagan.");
    return;
  }

  // 1. O'zbekcha nom
  await ctx.reply("📁 Yangi toifa nomini kiriting (O'zbekcha):\nMasalan: Divanlar", {
    reply_markup: getCancelKeyboard(),
  });

  const nameUzCtx = await conversation.wait();
  if (nameUzCtx.message?.text === "❌ Bekor qilish") {
    await nameUzCtx.reply("Toifa qo'shish bekor qilindi.", {
      reply_markup: getMainMenuKeyboard(true),
    });
    return;
  }
  const nameUz = nameUzCtx.message?.text?.trim() || "";
  if (!nameUz) {
    await ctx.reply("Noto'g'ri nom. Jarayon bekor qilindi.", {
      reply_markup: getMainMenuKeyboard(true),
    });
    return;
  }

  // 2. Ruscha nom
  await ctx.reply(
    "📁 Toifa nomini kiriting (Ruscha):\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const nameRuCtx = await conversation.wait();
  if (nameRuCtx.message?.text === "❌ Bekor qilish") {
    await nameRuCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const ruInput = nameRuCtx.message?.text?.trim() || "-";
  const nameRu = ruInput === "-" ? nameUz : ruInput;

  // 3. Inglizcha nom
  await ctx.reply(
    "📁 Toifa nomini kiriting (Inglizcha):\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const nameEnCtx = await conversation.wait();
  if (nameEnCtx.message?.text === "❌ Bekor qilish") {
    await nameEnCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const enInput = nameEnCtx.message?.text?.trim() || "-";
  const nameEn = enInput === "-" ? nameUz : enInput;

  // Slug yaratish
  let baseSlug = slugify(nameEn || nameUz) || `cat-${Date.now()}`;
  let finalSlug = baseSlug;
  let counter = 1;

  while (
    await conversation.external(() =>
      prisma.category.findUnique({ where: { slug: finalSlug } })
    )
  ) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  try {
    const newCat = await conversation.external(() =>
      prisma.category.create({
        data: {
          nameUz,
          nameRu,
          nameEn,
          slug: finalSlug,
        },
      })
    );

    await ctx.reply(
      `✅ *Yangi toifa yaratildi!*\n\n` +
        `📁 Nomi (UZ): *${newCat.nameUz}*\n` +
        `📁 Nomi (RU): *${newCat.nameRu}*\n` +
        `📁 Nomi (EN): *${newCat.nameEn}*\n` +
        `🔗 Slug: \`${newCat.slug}\``,
      {
        parse_mode: "Markdown",
        reply_markup: getMainMenuKeyboard(true),
      }
    );
  } catch (error) {
    process.stderr.write(
      `Toifani saqlashda xatolik: ${error instanceof Error ? error.message : String(error)}\n`
    );
    await ctx.reply(
      "Toifani saqlashda server xatoligi yuz berdi. Iltimos, qaytadan urinib ko'ring.",
      { reply_markup: getMainMenuKeyboard(true) }
    );
  }
}
