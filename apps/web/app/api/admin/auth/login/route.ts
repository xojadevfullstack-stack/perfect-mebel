import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@mebel-salon/db";
import { createAdminToken, verifyPassword } from "@/lib/auth";
import { checkLoginRateLimit, getClientIpInfo } from "@/lib/rate-limit";

const loginSchema = z.object({
  username: z.string().min(1, "Foydalanuvchi nomi kiritilishi shart"),
  password: z.string().min(1, "Parol kiritilishi shart"),
});

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // 1. Rate limiting tekshiruvi (bruteforce himoyasi, PostgreSQL atomik)
    const rateLimit = await checkLoginRateLimit(req);
    if (!rateLimit.allowed) {
      const remainingMinutes = Math.max(1, Math.ceil(rateLimit.retryAfterSeconds / 60));
      return NextResponse.json(
        {
          success: false,
          error: `Juda ko'p urinishlar. Iltimos, ${remainingMinutes} daqiqadan so'ng qayta urinib ko'ring.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
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
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Foydalanuvchi nomi yoki parol noto'g'ri" },
        { status: 401 }
      );
    }

    // Muvaffaqiyatli kirish: login rate limit hisoblagichini tozalaymiz
    const { key } = getClientIpInfo(req);
    await prisma.rateLimit.deleteMany({
      where: { key: `auth:login:${key}` },
    }).catch(() => {});

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
    console.error("Admin Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Tizimga kirishda server xatoligi yuz berdi" },
      { status: 500 }
    );
  }
}
