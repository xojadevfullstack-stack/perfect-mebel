import { NextResponse } from "next/server";
import { bot } from "@mebel-salon/telegram";
import { checkRateLimitAtomic } from "@mebel-salon/db";

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

  try {
    const update = await req.json();

    // 2. update_id bo'yicha takroriy update'ni o'tkazib yuborish (Telegram retry himoyasi)
    const updateId = update?.update_id;
    if (typeof updateId === "number") {
      const deduplication = await checkRateLimitAtomic({
        key: `tg_update:${updateId}`,
        limit: 1,
        windowSeconds: 300, // 5 daqiqalik oynada takrorlanishdan saqlash
      });

      if (!deduplication.allowed) {
        // Takroriy so'rov: Telegramga 200 OK qaytaramiz, lekin botga qayta ishlatmaymiz
        return NextResponse.json(
          { ok: true, duplicate: true, message: "Duplicate update skipped" },
          { status: 200 }
        );
      }
    }

    // 3. grammY botiga update'ni qayta ishlash uchun uzatish
    // Sessiyalar va FSM dialoglari PostgreSQL (sessions jadvali) orqali to'liq stateless ishlaydi
    await bot.handleUpdate(update);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Telegram Webhook Route Error:", error);
    // Telegram qayta-qayta yubormasligi uchun 200 qaytarish yoki ichki xatoni qayd qilish
    return NextResponse.json({ ok: false, error: "Internal processing error" }, { status: 500 });
  }
}
