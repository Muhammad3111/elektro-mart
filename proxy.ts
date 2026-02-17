import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/admin", "/profile", "/orders", "/checkout"];
const authPaths = ["/auth"];
const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api";
const PROFILE_ENDPOINT = `${API_URL.replace(/\/+$/, "")}/auth/profile`;

type SessionUser = {
    role?: "admin" | "user";
};

function withSecurityHeaders(response: NextResponse): NextResponse {
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
            "connect-src 'self' https://api.wwts.uz http://localhost:* https://api-maps.yandex.ru https://suggest-maps.yandex.ru https://mc.yandex.ru https://www.google-analytics.com",
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

    return response;
}

function getTokenFromRequest(request: NextRequest): string | null {
    const cookieToken = request.cookies.get("access_token")?.value?.trim();
    if (cookieToken) {
        return cookieToken;
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
        return null;
    }
    const [scheme, token] = authHeader.split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
        return null;
    }

    return token.trim();
}

async function validateUser(token: string): Promise<SessionUser | null> {
    try {
        const response = await fetch(PROFILE_ENDPOINT, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        return (await response.json()) as SessionUser;
    } catch {
        return null;
    }
}

function redirectWithHeaders(
    request: NextRequest,
    path: string,
    clearToken = false
): NextResponse {
    const response = NextResponse.redirect(new URL(path, request.url));
    if (clearToken) {
        response.cookies.delete("access_token");
    }
    return withSecurityHeaders(response);
}

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
    const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );
    const isAdminPath = pathname.startsWith("/admin");
    const redirectTarget = `${pathname}${search || ""}`;

    if (!isAuthPath && !isProtectedPath) {
        return withSecurityHeaders(NextResponse.next());
    }

    const token = getTokenFromRequest(request);
    const user = token ? await validateUser(token) : null;
    const isAuthenticated = Boolean(user);
    const shouldClearToken = Boolean(token) && !isAuthenticated;

    // Redirect authenticated users from auth pages to home
    if (isAuthPath) {
        if (isAuthenticated) {
            const destination = user?.role === "admin" ? "/admin" : "/";
            return redirectWithHeaders(request, destination);
        }
        const response = withSecurityHeaders(NextResponse.next());
        if (shouldClearToken) {
            response.cookies.delete("access_token");
        }
        return response;
    }

    if (!isAuthenticated) {
        const authPath = `/auth?redirect=${encodeURIComponent(redirectTarget)}`;
        return redirectWithHeaders(request, authPath, shouldClearToken);
    }

    if (isAdminPath && user?.role !== "admin") {
        return redirectWithHeaders(request, "/", shouldClearToken);
    }

    return withSecurityHeaders(NextResponse.next());
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
