export function getBotUsername(): string {
  return process.env["NEXT_PUBLIC_BOT_USERNAME"] || "perfectmebelbot";
}

export function buildProductDeepLink(productId: string): string {
  const username = getBotUsername();
  return `https://t.me/${username}?start=order_product_${productId}`;
}

export function buildCollectionDeepLink(collectionId: string): string {
  const username = getBotUsername();
  return `https://t.me/${username}?start=order_set_${collectionId}`;
}
