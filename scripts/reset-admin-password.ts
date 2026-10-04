/**
 * Admin foydalanuvchi parolini xavfsiz yangilash skripti.
 * 
 * Ishga tushirish:
 *   ADMIN_PASSWORD="YangiKuchliParol123!" pnpm admin:reset-password
 * 
 * DIQQAT: Hech qachon standart (fallback) parol yo'q. Parol faqat muhit o'zgaruvchisidan olinadi!
 */

import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

// .env yuklash
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const prisma = new PrismaClient();

async function resetAdminPassword(): Promise<void> {
  const newPassword = process.env["ADMIN_PASSWORD"] || process.env["ADMIN_INITIAL_PASSWORD"];

  if (!newPassword || newPassword.trim().length === 0) {
    process.stderr.write(
      "❌ Xatolik: ADMIN_PASSWORD yoki ADMIN_INITIAL_PASSWORD muhit o'zgaruvchisi berilmadi!\n" +
      "   Xavfsizlik qoidasi bo'yicha standart (default) parolga ruxsat berilmaydi.\n" +
      "   Foydalanish: ADMIN_PASSWORD=\"YangiParol123!\" pnpm admin:reset-password\n"
    );
    process.exit(1);
  }

  if (newPassword.trim().length < 8) {
    process.stderr.write("❌ Xatolik: Parol xavfsizlik talablariga javob bermaydi (kamida 8 ta belgi bo'lishi shart).\n");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword.trim(), 12);

    const admin = await prisma.adminUser.upsert({
      where: { username: "admin" },
      update: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
      create: {
        username: "admin",
        password: hashedPassword,
        name: "Tizim Administratori",
      },
    });

    process.stdout.write(`✅ Admin (${admin.username}) paroli muvaffaqiyatli yangilandi!\n`);
    process.stdout.write(`   Foydalanuvchi ID: ${admin.id}\n`);
    process.stdout.write(`   Yangilangan vaqt: ${admin.updatedAt.toISOString()}\n`);
  } catch (error) {
    process.stderr.write(`❌ Xatolik yuz berdi: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
