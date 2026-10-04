import { NextResponse } from "next/server";
import { bot } from "@mebel-salon/telegram";
import {
  isTelegramUpdateProcessed,
  acquireTelegramUpdateLock,
  markTelegramUpdateDone,
  rollbackTelegramUpdate,
  cleanupTelegramUpdates,
} from "@mebel-salon/db";

// Rasm yuklash va tashqi API so'rovlari uchun yetarli vaqt (Next.js / Vercel Serverless Function)
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Telegram Webhook Secret Token tekshiruvi (xavfsizlik kafolati)
  const secretHeader = req.headers.get("x-telegram-bot-api-secret-token");
  const expectedSecret = process.env["TELEGRAM_WEBHOOK_SECRET"];

  if (!expectedSecret || secretHeader !== expectedSecret) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid secret token" },
      { status: 401 }
    );
  }

  let currentUpdateId: number | null = null;

  try {
    const update = await req.json();
    const updateId = update?.update_id;

    if (typeof updateId === "number") {
      currentUpdateId = updateId;

      // 2.a. Allaqachon muvaffaqiyatli bajarilganini tekshirish
      const alreadyDone = await isTelegramUpdateProcessed(updateId);
      if (alreadyDone) {
        return NextResponse.json(
          { ok: true, duplicate: true, message: "Already completed update skipped" },
          { status: 200 }
        );
      }

      // 2.b. Bir vaqtda bir xil update'ga parallel ishlov berishni bloklash (in-flight lock)
      const lockAcquired = await acquireTelegramUpdateLock(updateId);
      if (!lockAcquired) {
        return NextResponse.json(
          { ok: true, duplicate: true, message: "Update currently processing in parallel" },
          { status: 200 }
        );
      }
    }

    // 3. grammY botiga update'ni qayta ishlash uchun uzatish
    // Sessiyalar va FSM PostgreSQL (sessions jadvali) orqali to'liq stateless ishlaydi
    await bot.handleUpdate(update);

    // 4. MUVAFFAQIYATLI YAKUNLANGANDA (OXIRIDA):
    // Yozuvni "done" sifatida saqlash va in-flight lockni tozalash
    if (typeof currentUpdateId === "number") {
      await markTelegramUpdateDone(currentUpdateId);
    }

    // Fonda vaqti-vaqti bilan eskirgan tg_update yozuvlarini tozalash
    if (Math.random() < 0.05) {
      cleanupTelegramUpdates().catch(() => {});
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Telegram Webhook Route Error:", error);

    // 5. HANDLER XATOLIK BILAN TUGAGANDA:
    // Lock va yozuvni darhol ROLLBACK qilish, shunda Telegram retry yuborganida
    // update yo'qolib ketmasdan qaytadan muvaffaqiyatli ishlanadi!
    if (typeof currentUpdateId === "number") {
      await rollbackTelegramUpdate(currentUpdateId);
    }

    return NextResponse.json({ ok: false, error: "Internal processing error" }, { status: 500 });
  }
}
