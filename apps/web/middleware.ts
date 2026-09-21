import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/request";
import { verifyAdminToken } from "@/lib/auth";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // 1. /api/admin/* himoyasi (faqat login va logout endpointlari mustasno)
  if (pathname.startsWith("/api/admin")) {
    if (pathname === "/api/admin/auth/login" || pathname === "/api/admin/auth/logout") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    const session = token ? await verifyAdminToken(token) : null;

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.next();
  }

  // 2. Boshqa /api/* endpointlari (masalan /api/health) intlMiddleware ga bormasdan to'g'ridan-to'g'ri o'tsin
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 3. /admin/* sahifalari himoyasi
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    const session = token ? await verifyAdminToken(token) : null;

    if (pathname === "/admin/login") {
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!session) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
  }

  // 4. Barcha boshqa yo'llar uchun xalqaro til (next-intl) middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
