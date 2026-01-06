import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/admin", "/profile", "/orders", "/checkout"];
const authPaths = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("access_token")?.value;

  const response = NextResponse.next();

  // Security Headers
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");
  // Clickjacking Protection
  response.headers.set("X-Frame-Options", "DENY");
  // MIME type sniffing protection
  response.headers.set("X-Content-Type-Options", "nosniff");
  // Referrer policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  // Permissions policy
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );
  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api-maps.yandex.ru https://yastatic.net https://www.googletagmanager.com https://mc.yandex.ru",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.wwsi.uz http://localhost:* https://api-maps.yandex.ru https://suggest-maps.yandex.ru https://mc.yandex.ru https://www.google-analytics.com",
      "frame-src 'self' https://api-maps.yandex.ru https://yandex.ru",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ")
  );
  // Strict Transport Security (HSTS)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Redirect authenticated users from auth pages to home
  if (authPaths.some((path) => pathname.startsWith(path))) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return response;
  }

  // Protected pages check
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // Token check is handled client-side for localStorage tokens
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
