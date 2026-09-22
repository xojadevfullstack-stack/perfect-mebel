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
    `🔔 *YANGI ARIZA!* (${payload.source})\n\n` +
    `👤 *Mijoz:* ${payload.customerName}\n` +
    `📞 *Telefon:* ${payload.phone}\n` +
    `📍 *Manzil:* ${payload.address || "Ko'rsatilmagan"}\n` +
    `🛋 *Tanlangan mebellar:*\n${payload.itemsSummary}\n` +
    `📝 *Izoh:* ${payload.notes || "Yo'q"}\n` +
    `📅 *Sana:* ${dateStr}`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: channelId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    return res.ok;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Telegram notify error";
    process.stderr.write(`Failed to send telegram notification: ${errMsg}\n`);
    return false;
  }
}
