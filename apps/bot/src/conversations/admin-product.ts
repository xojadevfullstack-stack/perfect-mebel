import { prisma, StockStatus } from "@mebel-salon/db";
import type { MyConversation, MyContext } from "../types/index.js";
import { getCancelKeyboard, getMainMenuKeyboard } from "../keyboards/main-menu.js";
import { config, isAdmin } from "../config.js";
import { uploadBufferToStorage } from "../utils/storage.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function adminAddProductConversation(
  conversation: MyConversation,
  ctx: MyContext
): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  if (!isAdmin(userId)) {
    await ctx.reply("❌ Ruxsat berilmagan.");
    return;
  }

  // 1. Kategoriyalarni olish va tanlash
  const categories = await conversation.external(() =>
    prisma.category.findMany({ orderBy: { order: "asc" } })
  );

  if (categories.length === 0) {
    await ctx.reply(
      "Hozircha hech qanday kategoriya yo'q. Avval toifa yarating (/add_category).",
      { reply_markup: getMainMenuKeyboard(true) }
    );
    return;
  }

  const catListText = categories
    .map((c, i) => `${i + 1}. ${c.nameUz}`)
    .join("\n");

  await ctx.reply(
    `📁 Mebel qaysi toifaga tegishli? Raqamini kiriting:\n\n${catListText}`,
    { reply_markup: getCancelKeyboard() }
  );

  let selectedCategoryId = "";
  while (!selectedCategoryId) {
    const catCtx = await conversation.wait();
    if (catCtx.message?.text === "❌ Bekor qilish") {
      await catCtx.reply("Mebel qo'shish bekor qilindi.", {
        reply_markup: getMainMenuKeyboard(true),
      });
      return;
    }

    const num = parseInt(catCtx.message?.text || "", 10);
    if (!isNaN(num) && num >= 1 && num <= categories.length) {
      selectedCategoryId = categories[num - 1]!.id;
    } else {
      await catCtx.reply(
        `Iltimos, 1 dan ${categories.length} gacha bo'lgan raqamni kiriting:`,
        { reply_markup: getCancelKeyboard() }
      );
    }
  }

  // 2. Mebel nomi (O'zbekcha)
  await ctx.reply(
    "🛋 Mebel nomini kiriting (O'zbekcha):\nMasalan: Comfort Divan",
    { reply_markup: getCancelKeyboard() }
  );

  const titleUzCtx = await conversation.wait();
  if (titleUzCtx.message?.text === "❌ Bekor qilish") {
    await titleUzCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const titleUz = titleUzCtx.message?.text?.trim() || "";

  // 3. Tavsif
  await ctx.reply(
    "ℹ️ Mebel haqida tavsif kiriting:\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const descCtx = await conversation.wait();
  if (descCtx.message?.text === "❌ Bekor qilish") {
    await descCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const descText = descCtx.message?.text?.trim();
  const descUz = descText && descText !== "-" ? descText : null;

  // 4. O'lchamlari
  await ctx.reply(
    "📐 O'lchamlari (masalan: 220x95x85 sm):\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const dimCtx = await conversation.wait();
  if (dimCtx.message?.text === "❌ Bekor qilish") {
    await dimCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const dimText = dimCtx.message?.text?.trim();
  const dimensions = dimText && dimText !== "-" ? dimText : null;

  // 5. Material
  await ctx.reply(
    "🪵 Materiali (masalan: Eman daraxti, Turkiya veluri):\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const matCtx = await conversation.wait();
  if (matCtx.message?.text === "❌ Bekor qilish") {
    await matCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const matText = matCtx.message?.text?.trim();
  const material = matText && matText !== "-" ? matText : null;

  // 6. Kafolat
  await ctx.reply(
    "🛡 Kafolat muddati (masalan: 24 oy):\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const warCtx = await conversation.wait();
  if (warCtx.message?.text === "❌ Bekor qilish") {
    await warCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  const warText = warCtx.message?.text?.trim();
  const warranty = warText && warText !== "-" ? warText : "24 oy";

  // 7. Mavjudlik holati
  await ctx.reply(
    "📦 Mebel holati:\n1. Omborda mavjud (IN_STOCK)\n2. Buyurtma asosida (MADE_TO_ORDER)\n\n(1 yoki 2 ni yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  let stockStatus: StockStatus = StockStatus.IN_STOCK;
  const statusCtx = await conversation.wait();
  if (statusCtx.message?.text === "❌ Bekor qilish") {
    await statusCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }
  if (statusCtx.message?.text?.trim() === "2") {
    stockStatus = StockStatus.MADE_TO_ORDER;
  }

  // 8. Rasm URL lari yoki rasm yuborish
  await ctx.reply(
    "🖼 Mebel rasmlarining URL manzillarini kiriting (vergul bilan ajrating) yoki rasm yuboring:\n(O'tkazib yuborish uchun '-' yuboring)",
    { reply_markup: getCancelKeyboard() }
  );

  const images: string[] = [];
  const imgCtx = await conversation.wait();
  if (imgCtx.message?.text === "❌ Bekor qilish") {
    await imgCtx.reply("Bekor qilindi.", { reply_markup: getMainMenuKeyboard(true) });
    return;
  }

  if (imgCtx.message?.photo && imgCtx.message.photo.length > 0) {
    const largestPhoto = imgCtx.message.photo[imgCtx.message.photo.length - 1];
    if (largestPhoto) {
      try {
        const file = await conversation.external(() =>
          ctx.api.getFile(largestPhoto.file_id)
        );
        if (file.file_path) {
          const token = config.botToken || ctx.api.token;
          const downloadUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;

          const uploadedUrl = await conversation.external(async () => {
            const res = await fetch(downloadUrl);
            if (!res.ok) {
              throw new Error(`Telegram serveridan rasmni yuklab bo'lmadi (${res.status}: ${res.statusText})`);
            }
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            return await uploadBufferToStorage(buffer, file.file_path || "photo.jpg", "image/jpeg");
          });

          images.push(uploadedUrl);
          await ctx.reply("✅ Rasm muvaffaqiyatli yuklandi.");
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        process.stderr.write(`Telegram photo yuklashda xatolik: ${errMsg}\n`);
        await ctx.reply(`⚠️ Rasmni saqlashda xatolik yuz berdi: ${errMsg}`);
      }
    }
  } else if (imgCtx.message?.text && imgCtx.message.text !== "-") {
    imgCtx.message.text
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.startsWith("http"))
      .forEach((url) => images.push(url));
  }

  // Slug yaratish
  let baseSlug = slugify(titleUz) || `prod-${Date.now()}`;
  let finalSlug = baseSlug;
  let counter = 1;

  while (
    await conversation.external(() =>
      prisma.product.findUnique({ where: { slug: finalSlug } })
    )
  ) {
    finalSlug = `${baseSlug}-${counter++}`;
  }

  try {
    const newProduct = await conversation.external(() =>
      prisma.product.create({
        data: {
          categoryId: selectedCategoryId,
          titleUz,
          titleRu: titleUz,
          titleEn: titleUz,
          descUz,
          descRu: descUz,
          descEn: descUz,
          dimensions,
          material,
          warranty,
          stockStatus,
          images,
          slug: finalSlug,
        },
        include: { category: true },
      })
    );

    await ctx.reply(
      `✅ *Yangi mebel muvaffaqiyatli saqlandi!*\n\n` +
        `🛋 Nomi: *${newProduct.titleUz}*\n` +
        `📁 Toifa: ${newProduct.category.nameUz}\n` +
        `📦 Holati: ${newProduct.stockStatus}\n` +
        (newProduct.dimensions ? `📐 O'lchami: ${newProduct.dimensions}\n` : "") +
        (newProduct.material ? `🪵 Material: ${newProduct.material}\n` : "") +
        `🔗 Slug: \`${newProduct.slug}\``,
      {
        parse_mode: "Markdown",
        reply_markup: getMainMenuKeyboard(true),
      }
    );
  } catch (error) {
    await ctx.reply(
      `Mebelni saqlashda xatolik: ${error instanceof Error ? error.message : "Noma'lum"}`,
      { reply_markup: getMainMenuKeyboard(true) }
    );
  }
}
