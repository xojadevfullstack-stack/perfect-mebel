import type { Api } from "grammy";
import type { Lead } from "@mebel-salon/db";
import { config } from "../config";
import { formatLeadChannelNotification } from "./formatters";

export async function notifyFactoryChannel(
  api: Api,
  lead: Lead
): Promise<boolean> {
  const configuredChannelId = config.factoryChannelId?.trim();
  const targetChannels = Array.from(
    new Set(
      [configuredChannelId, "@perfectmebelorders", "-1004418317623"].filter(
        Boolean
      ) as string[]
    )
  );

  if (targetChannels.length === 0) {
    process.stderr.write(
      "Zavod kanali ID si (TELEGRAM_FACTORY_CHANNEL_ID) belgilanmagan. Xabarnoma yuborilmadi.\n"
    );
    return false;
  }

  if (config.botToken.includes("123456789:ABCdefGHIjklMNOpqrsTUVwxyz")) {
    process.stderr.write(
      "[Telegram Ogohlantirish]: TELEGRAM_BOT_TOKEN test tokeni ekanligi sababli kanalga xabarnoma yuborish o'tkazib yuborildi. Haqiqiy @BotFather tokenini .env fayliga kiriting.\n"
    );
    return false;
  }

  const text = formatLeadChannelNotification(lead);

  for (const channel of targetChannels) {
    try {
      await api.sendMessage(channel, text, { parse_mode: "HTML" });
      process.stdout.write(
        `[Telegram Bot]: Yangi ariza zavod kanaliga muvaffaqiyatli yuborildi (${channel})\n`
      );
      return true;
    } catch (error) {
      process.stderr.write(
        `Zavod kanaliga xabarnoma yuborishda xatolik [Chat: ${channel}]: ${
          error instanceof Error ? error.message : String(error)
        }\n`
      );
    }
  }

  return false;
}
