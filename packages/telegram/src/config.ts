import dotenv from "dotenv";

dotenv.config();

export const config = {
  botToken: process.env["TELEGRAM_BOT_TOKEN"] || "",
  factoryChannelId:
    process.env["TELEGRAM_FACTORY_CHANNEL_ID"] ||
    process.env["FACTORY_CHANNEL_ID"] ||
    "",
  supportGroupId:
    process.env["TELEGRAM_SUPPORT_GROUP_ID"] ||
    process.env["SUPPORT_GROUP_ID"] ||
    "",
  adminTelegramIds: (process.env["ADMIN_TELEGRAM_IDS"] || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  webhookSecret: process.env["TELEGRAM_WEBHOOK_SECRET"] || "",
  supabaseUrl:
    process.env["NEXT_PUBLIC_SUPABASE_URL"] ||
    process.env["SUPABASE_URL"] ||
    "",
  supabaseKey:
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ||
    process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
    process.env["SUPABASE_KEY"] ||
    "",
};

export function isAdmin(telegramId: number | string | undefined): boolean {
  if (!telegramId) return false;
  return config.adminTelegramIds.includes(String(telegramId));
}
