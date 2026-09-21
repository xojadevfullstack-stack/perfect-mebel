import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url("DATABASE_URL to'g'ri URL bo'lishi kerak"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET kamida 32 belgidan iborat bo'lishi shart"),
  TELEGRAM_BOT_TOKEN: z.string().min(1, "TELEGRAM_BOT_TOKEN kiritilishi shart"),
  TELEGRAM_FACTORY_CHANNEL_ID: z.string().min(1, "TELEGRAM_FACTORY_CHANNEL_ID kiritilishi shart"),
  TELEGRAM_SUPPORT_GROUP_ID: z.string().min(1, "TELEGRAM_SUPPORT_GROUP_ID kiritilishi shart"),
  NEXT_PUBLIC_APP_URL: z.string().url("NEXT_PUBLIC_APP_URL to'g'ri URL bo'lishi kerak"),
});

export const env = envSchema.parse(process.env);
