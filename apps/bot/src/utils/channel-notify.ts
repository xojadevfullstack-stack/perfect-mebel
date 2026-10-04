import type { Api } from "grammy";
import type { Lead } from "@mebel-salon/db";
import { config } from "../config.js";
import { formatLeadChannelNotification } from "./formatters.js";

export async function notifyFactoryChannel(
  api: Api,
  lead: Lead
): Promise<boolean> {
  const channelId = config.factoryChannelId;
  if (!channelId) {
    process.stderr.write(
      "Zavod kanali ID si (TELEGRAM_FACTORY_CHANNEL_ID) belgilanmagan. Xabarnoma yuborilmadi.\n"
    );
    return false;
  }

  try {
    const text = formatLeadChannelNotification(lead);
    await api.sendMessage(channelId, text, { parse_mode: "HTML" });
    return true;
  } catch (error) {
    process.stderr.write(
      `Zavod kanaliga xabarnoma yuborishda xatolik: ${
        error instanceof Error ? error.message : String(error)
      }\n`
    );
    return false;
  }
}
