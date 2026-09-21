import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@mebel-salon/db";
import { createAdminToken, verifyPassword } from "@/lib/auth";

interface RateLimitRecord {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number | null;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 daqiqa

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

function checkRateLimit(ip: string): { allowed: boolean; remainingMinutes?: number } {
  const key = `login_attempts:${ip}`;
  const record = rateLimitStore.get(key);
  const now = Date.now();

  if (!record) {
    return { allowed: true };
  }

  if (record.blockedUntil) {
    if (now < record.blockedUntil) {
      const remainingMs = record.blockedUntil - now;
      const remainingMinutes = Math.max(1, Math.ceil(remainingMs / (60 * 1000)));
      return { allowed: false, remainingMinutes };
    }
    rateLimitStore.delete(key);
    return { allowed: true };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    rateLimitStore.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string): { blocked: boolean; remainingMinutes?: number } {
  const key = `login_attempts:${ip}`;
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    record = {
      attempts: 1,
      firstAttempt: now,
      blockedUntil: null,
    };
    rateLimitStore.set(key, record);
    return { blocked: false };
  }

  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.blockedUntil = now + WINDOW_MS;
    const remainingMinutes = Math.ceil(WINDOW_MS / (60 * 1000));
    return { blocked: true, remainingMinutes };
  }

  return { blocked: false };
}

function resetRateLimit(ip: string): void {
  const key = `login_attempts:${ip}`;
  rateLimitStore.delete(key);
}

const loginSchema = z.object({
  username: z.string().min(1, "Foydalanuvchi nomi kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const ip = getClientIp(req);

    // 1. Rate limiting tekshiruvi (bruteforce himoyasi)
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p muvaffaqiyatsiz urinishlar. Iltimos, ${rateLimit.remainingMinutes} daqiqadan so'ng qayta urinib ko'ring.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String((rateLimit.remainingMinutes || 15) * 60),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message || "Noto'g'ri ma'lumotlar" },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;

    const admin = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!admin) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    // Muvaffaqiyatli kirish: hisoblagichni tozalaymiz
    resetRateLimit(ip);

    const token = await createAdminToken({
      id: admin.id,
      name: admin.name,
      username: admin.username,
    });

    cookies().set("admin_token", token, {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 kun
    });

    return NextResponse.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Serverda xatolik yuz berdi";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
