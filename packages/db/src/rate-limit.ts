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
