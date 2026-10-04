import crypto from "crypto";
import { checkRateLimitAtomic, type RateLimitResult } from "@mebel-salon/db";

export interface ClientIpInfo {
  key: string;
  isFallback: boolean;
}

/**
 * So'rovdan mijoz IP manzilini xavfsiz ajratib olish.
 * Umumiy "127.0.0.1" bucket QILINMAYDI: agar IP topilmasa,
 * so'rov identifikatori (User-Agent / sarlavhalar hashi) asosida
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
 */
export async function checkLoginRateLimit(req: Request): Promise<RateLimitResult> {
  const { key, isFallback } = getClientIpInfo(req);
  const limit = isFallback ? 2 : 5; // IP topilmasa qat'iyroq limit (2 urinish)
  const windowSeconds = 15 * 60; // 15 daqiqa

  return checkRateLimitAtomic({
    key: `auth:login:${key}`,
    limit,
    windowSeconds,
  });
}

/**
 * /api/leads uchun rate limit tekshiruvi.
 * Kalit prefiksi: api:lead:
 * Qoidalar:
 * - Oddiy IP: 1 daqiqada 5 ta so'rov.
 * - IP topilmagan (fallback) so'rovlar uchun qat'iyroq limit: 1 daqiqada 2 ta so'rov.
 */
export async function checkLeadRateLimit(req: Request): Promise<RateLimitResult> {
  const { key, isFallback } = getClientIpInfo(req);
  const limit = isFallback ? 2 : 5; // IP topilmasa qat'iyroq limit (2 so'rov)
  const windowSeconds = 60; // 1 daqiqa

  return checkRateLimitAtomic({
    key: `api:lead:${key}`,
    limit,
    windowSeconds,
  });
}
