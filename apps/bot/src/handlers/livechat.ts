import { prisma } from "@mebel-salon/db";
import type { MyContext } from "../types/index.js";
import { config } from "../config.js";

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
      `📩 *Yangi mijoz xabari!*\n` +
      `👤 Mijoz: *${userName}* (${userHandle})\n` +
      `🆔 Telegram ID: \`${userId}\`\n\n` +
      `💬 *Xabar:*\n${text || "(fayl/rasm yuborildi)"}\n\n` +
      `_Javob yozish uchun ushbu xabarga 'Reply' qiling._`;

    const groupMsg = await ctx.api.sendMessage(supportGroupId, notificationText, {
      parse_mode: "Markdown",
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
      "Xabaringiz qabul qilindi. Tez orada mutaxassisimiz bog'lanadi."
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
    const customerMessage = `💬 *Menejerdan javob:*\n\n${replyText}`;

    if (ctx.message.photo && ctx.message.photo.length > 0) {
      const photo = ctx.message.photo[ctx.message.photo.length - 1]!;
      await ctx.api.sendPhoto(mapping.userTelegramId, photo.file_id, {
        caption: customerMessage,
        parse_mode: "Markdown",
      });
    } else {
      await ctx.api.sendMessage(mapping.userTelegramId, customerMessage, {
        parse_mode: "Markdown",
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
