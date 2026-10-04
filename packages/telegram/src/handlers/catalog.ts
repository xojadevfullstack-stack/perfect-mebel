import { prisma } from "@mebel-salon/db";
import type { MyContext } from "../types/index";
import {
  getCategoriesKeyboard,
  getProductsListKeyboard,
  getProductActionsKeyboard,
  getCollectionsKeyboard,
  getCollectionActionsKeyboard,
} from "../keyboards/catalog";
import {
  formatProductCaption,
  formatCollectionCaption,
} from "../utils/formatters";

const PAGE_SIZE = 6;

// 1. Kategoriyalar ro'yxatini ko'rsatish
export async function showCategories(ctx: MyContext): Promise<void> {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
  });

  if (categories.length === 0) {
    await ctx.reply(
      "Hozircha katalogda toifalar mavjud emas. Tez orada yangi modellar qo'shiladi."
    );
    return;
  }

  const text =
    "🛋 *Mebellar katalogi*\n\n" +
    "O'zingizga ma'qul toifani tanlang va mavjud modellarni ko'ring:";

  const keyboard = getCategoriesKeyboard(categories);

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  }
}

// 2. Kategoriya ichidagi mebellar ro'yxati
export async function showCategoryProducts(
  ctx: MyContext,
  categoryId: string,
  page = 1
): Promise<void> {
  const [category, totalCount, products] = await Promise.all([
    prisma.category.findUnique({ where: { id: categoryId } }),
    prisma.product.count({ where: { categoryId } }),
    prisma.product.findMany({
      where: { categoryId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  if (!category) {
    await ctx.reply("Toifa topilmadi.");
    return;
  }

  if (products.length === 0) {
    const emptyText = `📁 *${category.nameUz}*\n\nBu toifada hozircha mebellar mavjud emas.`;
    const keyboard = getCategoriesKeyboard(
      await prisma.category.findMany({ orderBy: { order: "asc" } })
    );

    if (ctx.callbackQuery) {
      await ctx.editMessageText(emptyText, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(emptyText, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
    return;
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const text =
    `📁 *${category.nameUz}* (Jami: ${totalCount} ta)\n` +
    `Sahifa ${page}/${totalPages}\n\n` +
    `Batafsil ko'rish uchun mebel ustiga bosing:`;

  const keyboard = getProductsListKeyboard(
    products,
    categoryId,
    page,
    totalPages
  );

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  }
}

// 3. Mebel tafsilotlari kartasi
export async function showProductDetails(
  ctx: MyContext,
  productId: string
): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: true },
  });

  if (!product) {
    await ctx.reply("Mebel topilmadi.");
    return;
  }

  const caption = formatProductCaption(product);
  const keyboard = getProductActionsKeyboard(product.id, product.categoryId);

  if (product.images.length > 0 && product.images[0]) {
    try {
      await ctx.replyWithPhoto(product.images[0], {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      if (ctx.callbackQuery) await ctx.answerCallbackQuery();
      return;
    } catch {
      // Rasm yuborishda xatolik bo'lsa (URL buzilgan bo'lsa), matn ko'rinishida yuboramiz
    }
  }

  await ctx.reply(caption, {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
  if (ctx.callbackQuery) await ctx.answerCallbackQuery();
}

// 4. Komplektlar ro'yxatini ko'rsatish
export async function showCollections(
  ctx: MyContext,
  page = 1
): Promise<void> {
  const [totalCount, collections] = await Promise.all([
    prisma.collection.count(),
    prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { products: { select: { titleUz: true } } },
    }),
  ]);

  if (collections.length === 0) {
    const text =
      "🗂 *Komplektlar va Garniturlar*\n\nHozircha to'plamlar qo'shilmagan.";
    if (ctx.callbackQuery) {
      await ctx.editMessageText(text, { parse_mode: "Markdown" });
      await ctx.answerCallbackQuery();
    } else {
      await ctx.reply(text, { parse_mode: "Markdown" });
    }
    return;
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;
  const text =
    `🗂 *Mebel to'plamlari va garniturlar*\n` +
    `Sahifa ${page}/${totalPages}\n\n` +
    `Batafsil ko'rish uchun to'plam nomini bosing:`;

  const keyboard = getCollectionsKeyboard(collections, page, totalPages);

  if (ctx.callbackQuery) {
    try {
      await ctx.editMessageText(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      await ctx.answerCallbackQuery();
    } catch {
      await ctx.reply(text, {
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
    }
  } else {
    await ctx.reply(text, {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  }
}

// 5. Komplekt tafsilotlari kartasi
export async function showCollectionDetails(
  ctx: MyContext,
  collectionId: string
): Promise<void> {
  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: { products: true },
  });

  if (!collection) {
    await ctx.reply("To'plam topilmadi.");
    return;
  }

  const caption = formatCollectionCaption(collection);
  const keyboard = getCollectionActionsKeyboard(collection.id);

  if (collection.images.length > 0 && collection.images[0]) {
    try {
      await ctx.replyWithPhoto(collection.images[0], {
        caption,
        parse_mode: "Markdown",
        reply_markup: keyboard,
      });
      if (ctx.callbackQuery) await ctx.answerCallbackQuery();
      return;
    } catch {
      // fallback
    }
  }

  await ctx.reply(caption, {
    parse_mode: "Markdown",
    reply_markup: keyboard,
  });
  if (ctx.callbackQuery) await ctx.answerCallbackQuery();
}

// 6. Aloqa / Ma'lumot
export async function showContactInfo(ctx: MyContext): Promise<void> {
  const text =
    `📞 *Biz bilan bog'lanish*\n\n` +
    `🏢 *Korxona:* Mebel Salon\n` +
    `🏭 *Ishlab chiqarish:* Toshkent shahri, Sanoat zonasi, 12-bino\n` +
    `🏪 *Showroom:* Toshkent shahri, Amir Temur ko'chasi, 45\n\n` +
    `📱 *Telefon:* +998 71 200 00 00\n` +
    `📱 *Menejer:* +998 90 123 45 67\n` +
    `⏰ *Ish vaqti:* Dushanba - Shanba, 09:00 - 19:00\n\n` +
    `💬 Savollaringiz bormi? Shunchaki ushbu chatga savolingizni yozib qoldiring, ` +
    `operatorimiz tez orada javob qaytaradi! 📨`;

  await ctx.reply(text, { parse_mode: "Markdown" });
}
