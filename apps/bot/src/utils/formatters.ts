import type { Product, Collection, Lead } from "@mebel-salon/db";

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

  return [
    `🔔 *YANGI ARIZA!*`,
    ``,
    `📍 *Manba:* ${sourceBadge}`,
    `👤 *Mijoz:* ${lead.customerName}`,
    `📞 *Telefon:* ${lead.phone}`,
    `🏠 *Manzil:* ${lead.address || "Ko'rsatilmagan"}`,
    lead.latitude && lead.longitude
      ? `🗺 *Geolokatsiya:* ${lead.latitude.toFixed(6)}, ${lead.longitude.toFixed(6)}`
      : null,
    lead.telegramId ? `💬 *Telegram ID:* \`${lead.telegramId}\`` : null,
    ``,
    `🛋 *Tanlangan mebel(lar):*`,
    `   ${lead.itemsSummary}`,
    ``,
    `📝 *Izoh:* ${lead.notes || "Yo'q"}`,
    `🆔 *Ariza ID:* \`${lead.id}\``,
    `📅 *Qabul qilingan vaqt:* ${dateFormatted}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}
