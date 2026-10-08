import { escapeHtml } from "@mebel-salon/shared";

export interface LeadNotificationPayload {
  id?: string;
  customerName: string;
  phone: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  notes?: string | null;
  telegramId?: string | null;
  itemsSummary: string;
  source: string;
  createdAt?: Date;
}

export async function sendLeadTelegramNotification(
  payload: LeadNotificationPayload
): Promise<boolean> {
  const token = process.env["TELEGRAM_BOT_TOKEN"]?.trim();
  const configuredChannelId = (
    process.env["TELEGRAM_FACTORY_CHANNEL_ID"] ||
    process.env["FACTORY_CHANNEL_ID"]
  )?.trim();

  const targetChannels = Array.from(
    new Set(
      [configuredChannelId, "@perfectmebelorders", "-1004418317623"].filter(
        Boolean
      ) as string[]
    )
  );

  if (!token || targetChannels.length === 0) {
    process.stderr.write(
      "Zavod kanali ID si yoki Bot tokeni belgilanmagan. Telegram xabarnoma o'tkazib yuborildi.\n"
    );
    return false;
  }

  if (token.includes("123456789:ABCdefGHIjklMNOpqrsTUVwxyz")) {
    process.stderr.write(
      "[Telegram Ogohlantirish]: TELEGRAM_BOT_TOKEN test tokeni (123456789:ABCdefGHIjklMNOpqrsTUVwxyz). Haqiqiy @BotFather tokenini .env fayliga kiriting, aks holda xabarlar yuborilmaydi.\n"
    );
    return false;
  }

  const dateStr = (
    payload.createdAt ? new Date(payload.createdAt) : new Date()
  ).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
  });

  const sourceBadge = payload.source === "WEB" ? "🌐 Veb-sayt" : "🤖 Telegram Bot";
  const appUrl = (
    process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000"
  ).replace(/\/$/, "");
  const adminUrl = `${appUrl}/admin/leads`;
  const orderCode = payload.id
    ? `PM-${payload.id.slice(0, 6).toUpperCase()}`
    : "YANGI";

  const messageLines: (string | null)[] = [
    `🔔 <b>YANGI ARIZA! (#${orderCode})</b>`,
    ``,
    `📍 <b>Manba:</b> ${sourceBadge}`,
    `👤 <b>Mijoz:</b> ${escapeHtml(payload.customerName)}`,
    `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(payload.phone)}">${escapeHtml(
      payload.phone
    )}</a>`,
    `🏠 <b>Manzil:</b> ${escapeHtml(payload.address || "Ko'rsatilmagan")}`,
    payload.latitude && payload.longitude
      ? `🗺 <b>Geolokatsiya:</b> <a href="https://www.google.com/maps?q=${payload.latitude},${payload.longitude}">${payload.latitude.toFixed(
          6
        )}, ${payload.longitude.toFixed(6)}</a>`
      : null,
    payload.telegramId
      ? `💬 <b>Telegram ID:</b> <code>${escapeHtml(payload.telegramId)}</code>`
      : null,
    ``,
    `🛋 <b>Tanlangan mebel(lar):</b>`,
    `   ${escapeHtml(payload.itemsSummary)}`,
    ``,
    payload.notes ? `📝 <b>Izoh:</b> ${escapeHtml(payload.notes)}` : null,
    payload.id ? `🆔 <b>Ariza ID:</b> <code>${escapeHtml(payload.id)}</code>` : null,
    `📅 <b>Sana:</b> ${dateStr}`,
    ``,
    `🔗 <a href="${adminUrl}">Admin Panelda ko'rish</a>`,
  ];

  const message = messageLines.filter((l) => l !== null).join("\n");
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  for (const channel of targetChannels) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: channel,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (res.ok) {
        process.stdout.write(
          `[Telegram Webhook]: Yangi ariza zavod kanaliga muvaffaqiyatli yuborildi (${channel})\n`
        );
        return true;
      }

      const errBody = await res.text().catch(() => "");
      process.stderr.write(
        `Telegram API xatosi (HTTP ${res.status}) [Chat: ${channel}]: ${errBody}\n`
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Telegram notify error";
      process.stderr.write(
        `Telegram kanaliga (${channel}) yuborishda tarmoq xatosi: ${errMsg}\n`
      );
    }
  }

  return false;
}
