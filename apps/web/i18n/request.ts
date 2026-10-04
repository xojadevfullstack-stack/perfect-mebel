import { getRequestConfig } from "next-intl/server";

export const locales = ["uz", "ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "uz";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  let messages;
  switch (locale) {
    case "ru":
      messages = (await import("../../../messages/ru.json")).default;
      break;
    case "en":
      messages = (await import("../../../messages/en.json")).default;
      break;
    case "uz":
    default:
      messages = (await import("../../../messages/uz.json")).default;
      break;
  }

  return {
    locale,
    messages,
  };
});
