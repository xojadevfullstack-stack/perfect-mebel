import { prisma } from "@mebel-salon/db";
import { escapeHtml } from "@mebel-salon/shared";
import type { MyConversation, MyContext } from "../types/index";
import {
  getMainMenuKeyboard,
  getPhoneRequestKeyboard,
  getLocationRequestKeyboard,
  getCancelKeyboard,
} from "../keyboards/main-menu";
import { notifyFactoryChannel } from "../utils/channel-notify";
import { isAdmin } from "../config";

export async function applyConversation(
  conversation: MyConversation,
  ctx: MyContext
): Promise<void> {
  const userId = ctx.from?.id ? String(ctx.from.id) : undefined;
  const isAdminUser = isAdmin(userId);

  let itemsSummary = "";

  // 1-bosqich: Mahsulot yoki komplektni aniqlash
  const sessionItem = ctx.session.applyItem;
  if (sessionItem?.title) {
    itemsSummary = sessionItem.title + (sessionItem.details ? ` (${sessionItem.details})` : "");
  } else if (ctx.match && typeof ctx.match === "string") {
    const matchStr = ctx.match.trim();
    if (matchStr.startsWith("order_product_")) {
      const productId = matchStr.replace("order_product_", "").trim();
      const product = await conversation.external(() =>
        prisma.product.findFirst({
          where: { OR: [{ id: productId }, { slug: productId }] },
          include: { category: true },
        })
      );

      if (product) {
        itemsSummary = `${product.titleUz} (${product.category.nameUz})`;
        ctx.session.applyItem = {
          type: "product",
          id: product.id,
          title: product.titleUz,
          details: product.category.nameUz,
        };
      }
    } else if (matchStr.startsWith("order_set_")) {
      const collectionId = matchStr.replace("order_set_", "").trim();
      const collection = await conversation.external(() =>
        prisma.collection.findFirst({
          where: { OR: [{ id: collectionId }, { slug: collectionId }] },
          include: { products: true },
        })
      );

      if (collection) {
        itemsSummary = `${collection.titleUz} to'plami (${collection.products.length} ta mebel)`;
        ctx.session.applyItem = {
          type: "collection",
          id: collection.id,
          title: collection.titleUz,
          details: `${collection.products.length} ta mebel`,
        };
      }
    }
  }

  // Agar mebel oldindan tanlangan bo'lsa, xabar beramiz
  if (itemsSummary) {
    await ctx.reply(
      `🛋 <b>Tanlangan mebel:</b> ${escapeHtml(itemsSummary)}\n\n` +
        `Ushbu mebel bo'yicha ariza qoldirish uchun ma'lumotlaringizni to'ldiring:`,
      { parse_mode: "HTML" }
    );
  } else {
    // Agar ariza umumiy bo'lsa (bosh menyudan "Ariza qoldirish" bosilgan)
    await ctx.reply(
      "Qaysi mebel yoki to'plam sizni qiziqtiryapti?\n" +
        "Masalan: <b>Oshxona garnituri</b>, <b>Yotoqxona to'plami</b>, <b>L-simon divan</b>",
      {
        parse_mode: "HTML",
        reply_markup: getCancelKeyboard(),
      }
    );

    const itemCtx = await conversation.wait();
    if (itemCtx.message?.text === "❌ Bekor qilish") {
      ctx.session.applyItem = null;
      await itemCtx.reply("Ariza bekor qilindi.", {
        reply_markup: getMainMenuKeyboard(isAdminUser),
      });
      return;
    }

    itemsSummary = itemCtx.message?.text?.trim() || "Mebel buyurtmasi";
    ctx.session.applyItem = {
      type: "general",
      title: itemsSummary,
    };
  }

  // 2-bosqich: Ismni so'rash
  await ctx.reply("Iltimos, to'liq ism-familiyangizni kiriting:", {
    reply_markup: getCancelKeyboard(),
  });

  let customerName = "";
  while (!customerName) {
    const nameCtx = await conversation.wait();
    if (nameCtx.message?.text === "❌ Bekor qilish") {
      ctx.session.applyItem = null;
      await nameCtx.reply("Ariza bekor qilindi.", {
        reply_markup: getMainMenuKeyboard(isAdminUser),
      });
      return;
    }

    const text = nameCtx.message?.text?.trim();
    if (text && text.length >= 2) {
      customerName = text;
    } else {
      await nameCtx.reply("Iltimos, to'g'ri ism kiriting (kamida 2 harf):", {
        reply_markup: getCancelKeyboard(),
      });
    }
  }

  // 3-bosqich: Telefon raqamini so'rash
  await ctx.reply(
    "Bog'lanish uchun telefon raqamingizni yuboring:\n" +
      "(Tugmani bosing yoki raqamingizni yozib yuboring)",
    {
      reply_markup: getPhoneRequestKeyboard(),
    }
  );

  let phone = "";
  while (!phone) {
    const phoneCtx = await conversation.wait();
    if (phoneCtx.message?.text === "❌ Bekor qilish") {
      ctx.session.applyItem = null;
      await phoneCtx.reply("Ariza bekor qilindi.", {
        reply_markup: getMainMenuKeyboard(isAdminUser),
      });
      return;
    }

    if (phoneCtx.message?.contact?.phone_number) {
      phone = phoneCtx.message.contact.phone_number;
      if (!phone.startsWith("+")) {
        phone = "+" + phone;
      }
    } else if (phoneCtx.message?.text) {
      const cleanPhone = phoneCtx.message.text.trim();
      if (cleanPhone.replace(/\D/g, "").length >= 7) {
        phone = cleanPhone;
      } else {
        await phoneCtx.reply(
          "Iltimos, to'g'ri telefon raqam kiriting (masalan: +998901234567):",
          { reply_markup: getPhoneRequestKeyboard() }
        );
      }
    }
  }

  // 4-bosqich: Manzilni so'rash
  await ctx.reply(
    "Yetkazib berish manzilini kiriting yoki geolokatsiyangizni yuboring:\n" +
      "(Ixtiyoriy, o'tkazib yuborish mumkin)",
    {
      reply_markup: getLocationRequestKeyboard(),
    }
  );

  let address: string | undefined = undefined;
  let latitude: number | undefined = undefined;
  let longitude: number | undefined = undefined;

  const locCtx = await conversation.wait();
  if (locCtx.message?.text === "❌ Bekor qilish") {
    ctx.session.applyItem = null;
    await locCtx.reply("Ariza bekor qilindi.", {
      reply_markup: getMainMenuKeyboard(isAdminUser),
    });
    return;
  }

  if (locCtx.message?.location) {
    latitude = locCtx.message.location.latitude;
    longitude = locCtx.message.location.longitude;
    address = "Geolokatsiya orqali yuborildi";
  } else if (
    locCtx.message?.text &&
    locCtx.message.text !== "⏭ O'tkazib yuborish"
  ) {
    address = locCtx.message.text.trim();
  }

  // Qo'shimcha izoh
  await ctx.reply(
    "Mebel haqida qo'shimcha izoh yoki talablaringiz bormi?\n" +
      "(Masalan: o'lchamlar, rang, xona rasmi haqida. Yo'q bo'lsa 'Yo'q' deb yozing)",
    {
      reply_markup: getCancelKeyboard(),
    }
  );

  const notesCtx = await conversation.wait();
  if (notesCtx.message?.text === "❌ Bekor qilish") {
    ctx.session.applyItem = null;
    await notesCtx.reply("Ariza bekor qilindi.", {
      reply_markup: getMainMenuKeyboard(isAdminUser),
    });
    return;
  }

  let notes: string | undefined = undefined;
  if (
    notesCtx.message?.text &&
    notesCtx.message.text.toLowerCase() !== "yo'q" &&
    notesCtx.message.text.toLowerCase() !== "yoq" &&
    notesCtx.message.text !== "⏭ O'tkazib yuborish"
  ) {
    notes = notesCtx.message.text.trim();
  }

  // Bazaga saqlash
  try {
    const lead = await conversation.external(() =>
      prisma.lead.create({
        data: {
          customerName,
          phone,
          address: address || null,
          latitude: latitude || null,
          longitude: longitude || null,
          notes: notes || null,
          telegramId: userId || null,
          source: "BOT",
          itemsSummary,
        },
      })
    );

    // Zavod kanaliga xabarnoma yuborish
    await conversation.external(() => notifyFactoryChannel(ctx.api, lead));

    // Sessionni tozalash
    ctx.session.applyItem = null;

    const orderCode = `PM-${lead.id.slice(0, 6).toUpperCase()}`;

    // Mijozga minnatdorchilik xabari
    await ctx.reply(
      `✅ <b>Arizangiz muvaffaqiyatli qabul qilindi! (#${orderCode})</b>\n\n` +
        `👤 <b>Mijoz:</b> ${escapeHtml(customerName)}\n` +
        `📞 <b>Telefon:</b> ${escapeHtml(phone)}\n` +
        `🛋 <b>Mebel:</b> ${escapeHtml(itemsSummary)}\n` +
        (address ? `📍 <b>Manzil:</b> ${escapeHtml(address)}\n` : "") +
        (notes ? `📝 <b>Izoh:</b> ${escapeHtml(notes)}\n` : "") +
        `🆔 <b>Ariza ID:</b> <code>${escapeHtml(lead.id)}</code>\n\n` +
        `Tez orada mutaxassisimiz siz bilan bog'lanadi va buyurtma tafsilotlarini kelishib oladi.`,
      {
        parse_mode: "HTML",
        reply_markup: getMainMenuKeyboard(isAdminUser),
      }
    );
  } catch (error) {
    ctx.session.applyItem = null;
    process.stderr.write(
      `Arizani saqlashda xatolik: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    await ctx.reply(
      "Kechirasiz, arizani saqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring yoki operator bilan bog'laning.",
      { reply_markup: getMainMenuKeyboard(isAdminUser) }
    );
  }
}
