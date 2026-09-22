import { InlineKeyboard } from "grammy";
import type { Category, Product, Collection } from "@mebel-salon/db";

export function getCategoriesKeyboard(categories: Category[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  categories.forEach((cat, index) => {
    keyboard.text(`📁 ${cat.nameUz}`, `cat_${cat.id}_1`);
    if (index % 2 === 1) {
      keyboard.row();
    }
  });

  return keyboard;
}

export function getProductsListKeyboard(
  products: Product[],
  categoryId: string,
  page: number,
  totalPages: number
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  products.forEach((prod) => {
    keyboard.text(`🛋 ${prod.titleUz}`, `prod_${prod.id}`).row();
  });

  // Pagination buttons
  const navRow: Array<{ text: string; data: string }> = [];
  if (page > 1) {
    navRow.push({ text: "⬅️ Oldingi", data: `cat_${categoryId}_${page - 1}` });
  }
  if (page < totalPages) {
    navRow.push({ text: "Keyingi ➡️", data: `cat_${categoryId}_${page + 1}` });
  }

  if (navRow.length > 0) {
    navRow.forEach((btn) => keyboard.text(btn.text, btn.data));
    keyboard.row();
  }

  keyboard.text("🔙 Kategoriyalarga qaytish", "show_categories");

  return keyboard;
}

export function getProductActionsKeyboard(
  productId: string,
  categoryId?: string
): InlineKeyboard {
  const keyboard = new InlineKeyboard()
    .text("📝 Ariza qoldirish", `apply_prod_${productId}`)
    .row();

  if (categoryId) {
    keyboard.text("⬅️ Mebellar ro'yxatiga", `cat_${categoryId}_1`);
  } else {
    keyboard.text("⬅️ Katalogga qaytish", "show_categories");
  }

  return keyboard;
}

export function getCollectionsKeyboard(
  collections: Collection[],
  page: number,
  totalPages: number
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  collections.forEach((col) => {
    keyboard.text(`🗂 ${col.titleUz}`, `col_${col.id}`).row();
  });

  const navRow: Array<{ text: string; data: string }> = [];
  if (page > 1) {
    navRow.push({ text: "⬅️ Oldingi", data: `cols_${page - 1}` });
  }
  if (page < totalPages) {
    navRow.push({ text: "Keyingi ➡️", data: `cols_${page + 1}` });
  }

  if (navRow.length > 0) {
    navRow.forEach((btn) => keyboard.text(btn.text, btn.data));
    keyboard.row();
  }

  return keyboard;
}

export function getCollectionActionsKeyboard(collectionId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("📝 Komplekt bo'yicha ariza berish", `apply_col_${collectionId}`)
    .row()
    .text("⬅️ Komplektlar ro'yxatiga", "show_collections");
}
