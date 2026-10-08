import type { Product, Collection, Lead } from "@mebel-salon/db";
import { escapeHtml } from "@mebel-salon/shared";

export function formatProductCaption(
  product: Product & { category?: { nameUz: string } }
): string {
  const parts: string[] = [];

  parts.push(`🛋 *${product.titleUz}*`);

  if (product.category?.nameUz) {
    parts.push(`📁 Toifa: ${product.category.nameUz}`);
  }

  const statusText =
    product.stockStatus === "IN_STOCK" ? "✅ Omborda mavjud" : "🔨 Buyurtma asosida";
  parts.push(`📦 Holati: ${statusText}`);

  if (product.dimensions) {
    parts.push(`📐 O'lchamlari: ${product.dimensions}`);
  }

  if (product.material) {
    parts.push(`🪵 Material: ${product.material}`);
  }

  if (product.warranty) {
    parts.push(`🛡 Kafolat: ${product.warranty}`);
  }

  if (product.descUz) {
    parts.push(`\nℹ️ *Tavsif:*\n${product.descUz}`);
  }

  return parts.join("\n");
}

export function formatCollectionCaption(
  collection: Collection & { products?: Array<{ titleUz: string }> }
): string {
  const parts: string[] = [];

  parts.push(`🗂 *${collection.titleUz}* (To'plam)`);

  const count = collection.products?.length ?? 0;
  parts.push(`🔢 Tarkibdagi mebellar soni: ${count} ta`);

  if (collection.descUz) {
    parts.push(`\nℹ️ *Tavsif:*\n${collection.descUz}`);
  }

  if (collection.products && collection.products.length > 0) {
    parts.push(`\n📋 *Tarkibi:*`);
    collection.products.forEach((p, idx) => {
      parts.push(`  ${idx + 1}. ${p.titleUz}`);
    });
  }

  return parts.join("\n");
}

export function formatLeadChannelNotification(lead: Lead): string {
  const dateFormatted = new Date(lead.createdAt).toLocaleString("uz-UZ", {
    timeZone: "Asia/Tashkent",
  });

  const sourceBadge = lead.source === "WEB" ? "🌐 Veb-sayt" : "🤖 Telegram Bot";
  const appUrl = (process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000").replace(/\/$/, "");
  const adminUrl = `${appUrl}/admin/leads`;
  const orderCode = `PM-${lead.id.slice(0, 6).toUpperCase()}`;

  return [
    `🔔 <b>YANGI ARIZA! (#${orderCode})</b>`,
    ``,
    `📍 <b>Manba:</b> ${sourceBadge}`,
    `👤 <b>Mijoz:</b> ${escapeHtml(lead.customerName)}`,
    `📞 <b>Telefon:</b> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a>`,
    `🏠 <b>Manzil:</b> ${escapeHtml(lead.address || "Ko'rsatilmagan")}`,
    lead.latitude && lead.longitude
      ? `🗺 <b>Geolokatsiya:</b> <a href="https://www.google.com/maps?q=${lead.latitude},${lead.longitude}">${lead.latitude.toFixed(6)}, ${lead.longitude.toFixed(6)}</a>`
      : null,
    lead.telegramId ? `💬 <b>Telegram ID:</b> <code>${escapeHtml(lead.telegramId)}</code>` : null,
    ``,
    `🛋 <b>Tanlangan mebel(lar):</b>`,
    `   ${escapeHtml(lead.itemsSummary)}`,
    ``,
    lead.notes ? `📝 <b>Izoh:</b> ${escapeHtml(lead.notes)}` : null,
    `🆔 <b>Ariza ID:</b> <code>${escapeHtml(lead.id)}</code>`,
    `📅 <b>Sana:</b> ${dateFormatted}`,
    ``,
    `🔗 <a href="${adminUrl}">Admin Panelda ko'rish</a>`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
