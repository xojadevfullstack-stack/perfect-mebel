import { Keyboard, InlineKeyboard } from "grammy";

export function getMainMenuKeyboard(isAdminUser = false): Keyboard {
  const keyboard = new Keyboard()
    .text("🛋 Katalog")
    .text("🗂 Komplektlar")
    .row()
    .text("📝 Ariza qoldirish")
    .text("📞 Aloqa");

  if (isAdminUser) {
    keyboard.row().text("⚙️ Admin Panel");
  }

  return keyboard.resized().persistent();
}

export function getCancelKeyboard(): Keyboard {
  return new Keyboard().text("❌ Bekor qilish").resized().oneTime();
}

export function getPhoneRequestKeyboard(): Keyboard {
  return new Keyboard()
    .requestContact("📱 Telefon raqamimni yuborish")
    .row()
    .text("❌ Bekor qilish")
    .resized()
    .oneTime();
}

export function getLocationRequestKeyboard(): Keyboard {
  return new Keyboard()
    .requestLocation("📍 Geolokatsiyamni yuborish")
    .row()
    .text("⏭ O'tkazib yuborish")
    .text("❌ Bekor qilish")
    .resized()
    .oneTime();
}

export function getConfirmCancelInlineKeyboard(confirmAction: string): InlineKeyboard {
  return new InlineKeyboard()
    .text("✅ Davom etish", confirmAction)
    .text("❌ Bekor qilish", "cancel_flow");
}
