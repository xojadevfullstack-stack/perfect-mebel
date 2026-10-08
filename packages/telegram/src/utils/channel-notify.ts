import type { Api } from "grammy";
import type { Lead } from "@mebel-salon/db";
import { config } from "../config";
import { formatLeadChannelNotification } from "./formatters";

export async function notifyFactoryChannel(
  api: Api,
  lead: Lead
): Promise<boolean> {
  const channelId = config.factoryChannelId?.trim();
  if (!channelId) {
    process.stderr.write(
      "Zavod kanali ID si (TELEGRAM_FACTORY_CHANNEL_ID) belgilanmagan. Xabarnoma yuborilmadi.\n"
    );
    return false;
  }

  if (config.botToken.includes("123456789:ABCdefGHIjklMNOpqrsTUVwxyz")) {
    process.stderr.write(
      "TELEGRAM_BOT_TOKEN test tokeni ekanligi sababli kanalga xabarnoma yuborish o'tkazib yuborildi.\n"
    );
    return false;
  }

  try {
    const text = formatLeadChannelNotification(lead);
    await api.sendMessage(channelId, text, { parse_mode: "HTML" });
    return true;
  } catch (error) {
    process.stderr.write(
      `Zavod kanaliga xabarnoma yuborishda xatolik [Chat: ${channelId}]: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    return false;
  }
}
