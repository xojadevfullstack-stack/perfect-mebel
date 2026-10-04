/**
 * Telegram HTML xabarlari uchun maxsus belgilarni (&, <, >, ") xavfsiz holatga keltiradi.
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
