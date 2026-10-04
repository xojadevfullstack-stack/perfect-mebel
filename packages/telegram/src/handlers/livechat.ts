import { prisma } from "@mebel-salon/db";
import { escapeHtml } from "@mebel-salon/shared";
import type { MyContext } from "../types/index";
import { config } from "../config";

// Mijozdan Support guruhiga relay
export async function handleCustomerMessage(ctx: MyContext): Promise<void> {
  // Faqat private chatdagi oddiy xabarlar uchun
  if (ctx.chat?.type !== "private") return;
  if (!ctx.message) return;

  const text = ctx.message.text || "";
  // Asosiy menyu tugmalari yoki buyruqlarni o'tkazib yuboramiz
  const ignoredButtons = [
    "🛋 Katalog",
    "🗂 Komplektlar",
    "📝 Ariza qoldirish",
    "📞 Aloqa",
    "⚙️ Admin Panel",
    "❌ Bekor qilish",
  ];
  if (ignoredButtons.includes(text) || text.startsWith("/")) {
    return;
  }

  const supportGroupId = config.supportGroupId;
  if (!supportGroupId) {
    await ctx.reply(
      "Savolingiz uchun rahmat! Tez orada mutaxassisimiz siz bilan bog'lanadi.\n" +
        "Shoshilinch savollar uchun: +998 71 200 00 00"
    );
    return;
  }

  try {
    const user = ctx.from;
    const userName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    const userHandle = user?.username ? `@${user.username}` : "foydalanuvchi";
    const userId = user?.id ? String(user.id) : "noma'lum";

    // Support guruhiga ma'lumotli xabarni yuborish
    const notificationText =
      `📩 <b>Yangi mijoz xabari!</b>\n` +
      `👤 Mijoz: <b>${escapeHtml(userName)}</b> (${escapeHtml(userHandle)})\n` +
      `🆔 Telegram ID: <code>${escapeHtml(userId)}</code>\n\n` +
      `💬 <b>Xabar:</b>\n${escapeHtml(text || "(fayl/rasm yuborildi)")}\n\n` +
      `<i>Javob yozish uchun ushbu xabarga 'Reply' qiling.</i>`;

    const groupMsg = await ctx.api.sendMessage(supportGroupId, notificationText, {
      parse_mode: "HTML",
    });

    // DB ga mapping saqlash
    await prisma.supportMessage.create({
      data: {
        groupMessageId: groupMsg.message_id,
        userTelegramId: userId,
      },
    });

    await ctx.reply(
      "Xabaringiz menejerimizga yetkazildi! 📨\nTez orada javob qaytaramiz."
    );
  } catch (error) {
    process.stderr.write(
      `Support guruhiga forward qilishda xatolik: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    await ctx.reply(
      "Kechirasiz, xabaringizni menejerga yetkazishda xatolik yuz berdi. Iltimos, qaytadan yuboring yoki qo'ng'iroq qiling."
    );
  }
}

// Support guruhidan kelgan reply ni mijozga relay qilish
export async function handleSupportGroupReply(ctx: MyContext): Promise<void> {
  if (!ctx.message || !ctx.message.reply_to_message) return;

  const supportGroupId = config.supportGroupId;
  if (!supportGroupId) return;

  // Xabar support guruhidan ekanligini tekshiramiz
  if (String(ctx.chat?.id) !== String(supportGroupId)) return;

  const repliedMsgId = ctx.message.reply_to_message.message_id;

  try {
    // DB dan mijoz ID sini qidirish
    const mapping = await prisma.supportMessage.findUnique({
      where: { groupMessageId: repliedMsgId },
    });

    if (!mapping) {
      // Bu reply bot orqali borgan mijoz xabariga tegishli emas
      return;
    }

    const replyText = ctx.message.text || "";
    const customerMessage = `💬 <b>Menejerdan javob:</b>\n\n${escapeHtml(replyText)}`;

    if (ctx.message.photo && ctx.message.photo.length > 0) {
      const photo = ctx.message.photo[ctx.message.photo.length - 1]!;
      await ctx.api.sendPhoto(mapping.userTelegramId, photo.file_id, {
        caption: customerMessage,
        parse_mode: "HTML",
      });
    } else {
      await ctx.api.sendMessage(mapping.userTelegramId, customerMessage, {
        parse_mode: "HTML",
      });
    }

    await ctx.reply("✅ Javob mijozga yuborildi.", {
      reply_to_message_id: ctx.message.message_id,
    });
  } catch (error) {
    process.stderr.write(
      `Mijozga javob yetkazishda xatolik: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    await ctx.reply("❌ Xatolik: Javob mijozga yetkazilmadi.", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
}
