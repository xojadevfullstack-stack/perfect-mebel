import { NextResponse } from "next/server";
import { prisma } from "@mebel-salon/db";
import { leadSchema } from "@mebel-salon/shared";
import { sendLeadTelegramNotification } from "@/lib/telegram/channel-notify";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minut

function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Xotirani tozalash (1000 ta yozuvdan oshganda)
  if (rateLimitStore.size > 1000) {
    rateLimitStore.forEach((val, key) => {
      if (now > val.resetAt) {
        rateLimitStore.delete(key);
      }
    });
  }

  if (!record || now > record.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

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

  // 2. IP bo'yicha Rate Limiting (1 minutda 5 ta so'rov)
  const clientIp = getClientIp(req);
  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        success: false,
        error: "So'rovlar soni cheklovdan oshdi. Iltimos, 1 daqiqadan so'ng qayta urinib ko'ring.",
      },
      {
        status: 429,
        headers: { "Retry-After": "60" },
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

    // Telegram zavod kanaliga bildirishnoma jo'natish (fon rejimida)
    void sendLeadTelegramNotification({
      customerName: lead.customerName,
      phone: lead.phone,
      address: lead.address,
      notes: lead.notes,
      itemsSummary: lead.itemsSummary,
      source: "WEB",
      createdAt: lead.createdAt,
    });

    return NextResponse.json({ success: true, data: { id: lead.id } }, { status: 201 });
  } catch (error) {
    console.error("Leads API Error:", error);
    return NextResponse.json({ success: false, error: "Serverda xatolik yuz berdi" }, { status: 500 });
  }
}
