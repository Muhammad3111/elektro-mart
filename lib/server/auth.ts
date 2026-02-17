import type { NextRequest } from "next/server";
import type { User } from "@/types/auth";

const API_URL =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:3001/api";

const PROFILE_ENDPOINT = `${API_URL.replace(/\/+$/, "")}/auth/profile`;

type AuthOptions = {
    requireAdmin?: boolean;
};

type AuthSuccess = {
    ok: true;
    token: string;
    user: User;
};

type AuthFailure = {
    ok: false;
    status: 401 | 403;
    error: string;
};

export type AuthResult = AuthSuccess | AuthFailure;

function extractToken(request: NextRequest): string | null {
    const header = request.headers.get("authorization");
    if (header) {
        const [scheme, value] = header.split(" ");
        if (scheme?.toLowerCase() === "bearer" && value) {
            return value.trim();
        }
    }

    const cookieToken = request.cookies.get("access_token")?.value;
    return cookieToken?.trim() || null;
}

async function fetchProfile(token: string): Promise<User | null> {
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

        return (await response.json()) as User;
    } catch {
        return null;
    }
}

export async function authorizeRequest(
    request: NextRequest,
    options: AuthOptions = {}
): Promise<AuthResult> {
    const token = extractToken(request);
    if (!token) {
        return { ok: false, status: 401, error: "Unauthorized" };
    }

    const user = await fetchProfile(token);
    if (!user) {
        return { ok: false, status: 401, error: "Invalid or expired token" };
    }

    if (options.requireAdmin && user.role !== "admin") {
        return { ok: false, status: 403, error: "Admin access required" };
    }

    return { ok: true, token, user };
}
