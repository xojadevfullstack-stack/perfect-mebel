import { randomUUID } from "crypto";
import { prisma } from "./index";

export interface RateLimitOptions {
  key: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfterSeconds: number;
}

/**
 * Atomik rate limiting tekshiruvi.
 * Bitta INSERT ... ON CONFLICT ("key") DO UPDATE ... RETURNING "count", "resetAt"
 * so'rovi orqali race-condition larsiz hisoblaydi.
 */
export async function checkRateLimitAtomic(options: RateLimitOptions): Promise<RateLimitResult> {
  const { key, limit, windowSeconds } = options;
  const id = randomUUID();
  const resetAt = new Date(Date.now() + windowSeconds * 1000);

  // Ehtimolli tozalash (har ~50 ta so'rovda 1 marta fonda eskirganlarni o'chiradi)
  if (Math.random() < 0.02) {
    cleanupExpiredRateLimits().catch(() => {});
  }

  const rows = await prisma.$queryRaw<Array<{ count: number; resetAt: Date }>>`
    INSERT INTO "rate_limits" ("id", "key", "count", "resetAt", "createdAt", "updatedAt")
    VALUES (${id}, ${key}, 1, ${resetAt}, NOW(), NOW())
    ON CONFLICT ("key") DO UPDATE
    SET 
      "count" = CASE 
        WHEN "rate_limits"."resetAt" <= NOW() THEN 1 
        ELSE "rate_limits"."count" + 1 
      END,
      "resetAt" = CASE 
        WHEN "rate_limits"."resetAt" <= NOW() THEN ${resetAt} 
        ELSE "rate_limits"."resetAt" 
      END,
      "updatedAt" = NOW()
    RETURNING "count", "resetAt"
  `;

  const row = rows[0];
  const count = Number(row?.count ?? 1);
  const currentResetAt = row?.resetAt ?? resetAt;
  const allowed = count <= limit;
  const remaining = Math.max(0, limit - count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((new Date(currentResetAt).getTime() - Date.now()) / 1000)
  );

  return {
    allowed,
    count,
    limit,
    remaining,
    resetAt: currentResetAt,
    retryAfterSeconds,
  };
}

/**
 * Eskirgan rate limit yozuvlarini tozalash mexanizmi.
 * resetAt muddati o'tgan yozuvlarni bazadan o'chiradi.
 */
export async function cleanupExpiredRateLimits(): Promise<number> {
  try {
    const res = await prisma.rateLimit.deleteMany({
      where: {
        resetAt: {
          lt: new Date(),
        },
      },
    });
    return res.count;
  } catch {
    return 0;
  }
}

/**
 * Telegram update_id allaqachon to'liq qayta ishlanganligini tekshirish.
 */
export async function isTelegramUpdateProcessed(updateId: number): Promise<boolean> {
  try {
    const record = await prisma.rateLimit.findUnique({
      where: { key: `tg_update_done:${updateId}` },
    });
    return !!record && record.resetAt > new Date();
  } catch {
    return false;
  }
}

/**
 * Bir vaqtda bir xil update_id ga parallel ishlov berishni bloklash (in-flight lock).
 */
export async function acquireTelegramUpdateLock(updateId: number): Promise<boolean> {
  try {
    const res = await checkRateLimitAtomic({
      key: `tg_update_lock:${updateId}`,
      limit: 1,
      windowSeconds: 60, // 60 soniya lock
    });
    return res.allowed;
  } catch {
    // Agar DB xatosi bo'lsa, xabar yo'qolmasligi uchun davom ettirishga ruxsat
    return true;
  }
}

/**
 * Update muvaffaqiyatli yakunlanganda (OXIRIDA) yozuvni saqlash.
 */
export async function markTelegramUpdateDone(updateId: number): Promise<void> {
  try {
    const id = randomUUID();
    const resetAt = new Date(Date.now() + 15 * 60 * 1000); // 15 daqiqa saqlash

    await prisma.$queryRaw`
      INSERT INTO "rate_limits" ("id", "key", "count", "resetAt", "createdAt", "updatedAt")
      VALUES (${id}, ${`tg_update_done:${updateId}`}, 1, ${resetAt}, NOW(), NOW())
      ON CONFLICT ("key") DO UPDATE
      SET "resetAt" = ${resetAt}, "updatedAt" = NOW()
    `;

    // In-flight lockni tozalash
    await prisma.rateLimit.deleteMany({
      where: { key: `tg_update_lock:${updateId}` },
    }).catch(() => {});
  } catch (error) {
    console.error(`[RateLimit] markTelegramUpdateDone xatosi (updateId: ${updateId}):`, error);
  }
}

/**
 * Handler xatolik bilan tugaganda lockni bekor qilish (ROLLBACK),
 * shunda Telegram retry yuborganida update yo'qolmasdan qayta ishlanadi.
 */
export async function rollbackTelegramUpdate(updateId: number): Promise<void> {
  try {
    await prisma.rateLimit.deleteMany({
      where: {
        key: { in: [`tg_update_lock:${updateId}`, `tg_update_done:${updateId}`] },
      },
    });
  } catch (error) {
    console.error(`[RateLimit] rollbackTelegramUpdate xatosi (updateId: ${updateId}):`, error);
  }
}

/**
 * Eskirgan tg_update_* yozuvlarini tozalash.
 */
export async function cleanupTelegramUpdates(): Promise<number> {
  try {
    const res = await prisma.rateLimit.deleteMany({
      where: {
        key: { startsWith: "tg_update" },
        resetAt: { lt: new Date() },
      },
    });
    return res.count;
  } catch {
    return 0;
  }
}
