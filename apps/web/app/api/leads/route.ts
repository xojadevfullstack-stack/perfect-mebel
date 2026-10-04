import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { leadSchema } from "@mebel-salon/shared";
import { sendLeadTelegramNotification } from "@/lib/telegram/channel-notify";
import { checkLeadRateLimit } from "@/lib/rate-limit";

function isValidOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const appUrlString = process.env["NEXT_PUBLIC_APP_URL"] || "http://localhost:3000";
    const appUrl = new URL(appUrlString);

    if (originUrl.host === appUrl.host) return true;

    const hostHeader = req.headers.get("host");
    if (hostHeader && originUrl.host === hostHeader) return true;

    if (
      process.env["NODE_ENV"] !== "production" &&
      (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1")
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  // 1. Origin header tekshiruvi
  if (!isValidOrigin(req)) {
    return NextResponse.json(
      { success: false, error: "Ruxsat berilmagan manba (Forbidden origin)" },
      { status: 403 }
    );
  }

  // 2. IP bo'yicha Rate Limiting (PostgreSQL atomik, alohida api:lead kaliti)
  const rateLimit = await checkLeadRateLimit(req);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "So'rovlar soni cheklovdan oshdi. Iltimos, bir ozdan so'ng qayta urinib ko'ring.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await req.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const lead = await prisma.lead.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        address: data.address || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        notes: data.notes || null,
        telegramId: data.telegramId || null,
        source: "WEB",
        itemsSummary: data.itemsSummary,
      },
    });

    // Telegram zavod kanaliga bildirishnoma jo'natish (await qilinadi, lekin lead saqlanishini buzmaydi)
    try {
      await sendLeadTelegramNotification({
        customerName: lead.customerName,
        phone: lead.phone,
        address: lead.address,
        notes: lead.notes,
        itemsSummary: lead.itemsSummary,
        source: "WEB",
        createdAt: lead.createdAt,
      });
    } catch (notifyErr) {
      console.error("Lead Telegram notify failed (lead saved successfully):", notifyErr);
    }

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    console.error("Leads API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}
