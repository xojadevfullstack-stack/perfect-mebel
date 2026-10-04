import crypto from "crypto";
import { checkRateLimitAtomic, type RateLimitResult } from "@mebel-salon/db";

export interface ClientIpInfo {
  key: string;
  isFallback: boolean;
}

/**
 * So'rovdan mijoz IP manzilini xavfsiz ajratib olish.
 * Umumiy "127.0.0.1" bucket QILINMAYDI: agar IP topilmasa,
 * so'rov sarlavhalari (User-Agent / sarlavhalar hashi) asosida
 * alohida noma'lum bucket shakllantiriladi va isFallback: true belgilanadi.
 */
export function getClientIpInfo(req: Request): ClientIpInfo {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  let candidateIp: string | null = null;

  if (forwarded) {
    candidateIp = forwarded.split(",")[0]?.trim() || null;
  } else if (realIp) {
    candidateIp = realIp.trim();
  } else if (cfConnectingIp) {
    candidateIp = cfConnectingIp.trim();
  }

  // Agar haqiqiy IP mavjud bo'lsa va u mahalliy/dummy 127.0.0.1 bo'lmasa
  if (candidateIp && candidateIp !== "127.0.0.1" && candidateIp !== "::1") {
    return {
      key: candidateIp,
      isFallback: false,
    };
  }

  // IP topilmagan yoki dummy holatda: umumiy "127.0.0.1" bucket qilmaslik
  // So'rov sarlavhalaridan qat'iy alohida identifikator hosil qilinadi
  const userAgent = req.headers.get("user-agent") || "unknown-ua";
  const acceptLang = req.headers.get("accept-language") || "unknown-lang";
  const headerFingerprint = crypto
    .createHash("sha256")
    .update(`${userAgent}|${acceptLang}`)
    .digest("hex")
    .substring(0, 16);

  return {
    key: `anon_${headerFingerprint}`,
    isFallback: true,
  };
}

/**
 * /api/admin/auth/login uchun rate limit tekshiruvi.
 * Kalit prefiksi: auth:login:
 * Qoidalar:
 * - Oddiy IP: 15 daqiqada 5 ta urinish.
 * - IP topilmagan (fallback) so'rovlar uchun qat'iyroq limit: 15 daqiqada 2 ta urinish.
 * - DB XATOSIDA: FAIL-CLOSED (ruxsat berilmaydi, xavfsizlik kafolati - bruteforce bloklanadi).
 */
export async function checkLoginRateLimit(req: Request): Promise<RateLimitResult> {
  const { key, isFallback } = getClientIpInfo(req);
  const limit = isFallback ? 2 : 5; // IP topilmasa qat'iyroq limit (2 urinish)
  const windowSeconds = 15 * 60; // 15 daqiqa

  try {
    return await checkRateLimitAtomic({
      key: `auth:login:${key}`,
      limit,
      windowSeconds,
    });
  } catch (error) {
    console.error("[RateLimit] Login DB xatosi (FAIL-CLOSED):", error);
    // FAIL-CLOSED: DB uzilganda autentifikatsiya hujumlariga yo'l qo'ymaslik uchun bloklanadi
    return {
      allowed: false,
      count: limit + 1,
      limit,
      remaining: 0,
      resetAt: new Date(Date.now() + 60 * 1000),
      retryAfterSeconds: 60,
    };
  }
}

/**
 * /api/leads uchun rate limit tekshiruvi.
 * Kalit prefiksi: api:lead:
 * Qoidalar:
 * - Oddiy IP: 1 daqiqada 5 ta so'rov.
 * - IP topilmagan (fallback) so'rovlar uchun qat'iyroq limit: 1 daqiqada 2 ta so'rov.
 * - DB XATOSIDA: FAIL-OPEN (ruxsat beriladi, biznes arizalari yo'qolmasligi uchun).
 */
export async function checkLeadRateLimit(req: Request): Promise<RateLimitResult> {
  const { key, isFallback } = getClientIpInfo(req);
  const limit = isFallback ? 2 : 5; // IP topilmasa qat'iyroq limit (2 so'rov)
  const windowSeconds = 60; // 1 daqiqa

  try {
    return await checkRateLimitAtomic({
      key: `api:lead:${key}`,
      limit,
      windowSeconds,
    });
  } catch (error) {
    console.error("[RateLimit] Leads DB xatosi (FAIL-OPEN):", error);
    // FAIL-OPEN: DB rate-limit uzilgan bo'lsa ham mijozning buyurtmasi yo'qolmasligi uchun ruxsat beriladi
    return {
      allowed: true,
      count: 1,
      limit,
      remaining: limit,
      resetAt: new Date(Date.now() + windowSeconds * 1000),
      retryAfterSeconds: 0,
    };
  }
}
