import { escapeHtml } from "@mebel-salon/shared";

export interface LeadNotificationPayload {
  customerName: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  itemsSummary: string;
  source: string;
  createdAt?: Date;
}

export async function sendLeadTelegramNotification(payload: LeadNotificationPayload): Promise<boolean> {
  const token = process.env["TELEGRAM_BOT_TOKEN"];
  const channelId = process.env["TELEGRAM_FACTORY_CHANNEL_ID"] || process.env["FACTORY_CHANNEL_ID"];

  if (!token || !channelId || token.includes("123456789:ABCdefGHIjklMNOpqrsTUVwxyz")) {
    // Development muhitida token sozlanmagan bo'lsa xabar log qilinadi
    return false;
  }

  const dateStr = (payload.createdAt ? new Date(payload.createdAt) : new Date()).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
  });

  const message =
    `🔔 <b>YANGI ARIZA!</b> (${escapeHtml(payload.source)})\n\n` +
    `👤 <b>Mijoz:</b> ${escapeHtml(payload.customerName)}\n` +
    `📞 <b>Telefon:</b> ${escapeHtml(payload.phone)}\n` +
    `📍 <b>Manzil:</b> ${escapeHtml(payload.address || "Ko'rsatilmagan")}\n` +
    `🛋 <b>Tanlangan mebellar:</b>\n${escapeHtml(payload.itemsSummary)}\n` +
    `📝 <b>Izoh:</b> ${escapeHtml(payload.notes || "Yo'q")}\n` +
    `📅 <b>Sana:</b> ${dateStr}`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: "HTML",
      }),
    });

    return res.ok;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Telegram notify error";
    process.stderr.write(`Failed to send telegram notification: ${errMsg}\n`);
    return false;
  }
}
