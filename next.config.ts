import type { NextConfig } from "next";

type RemotePattern = {
    protocol: "http" | "https";
    hostname: string;
};

const candidateImageOrigins = [
    process.env.NEXT_PUBLIC_S3_URL_IMAGE,
    process.env.S3_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    "https://wwts.uz",
    "https://api.wwts.uz",
    "http://localhost:3000",
    "http://localhost:3001",
];

function toRemotePattern(url: string): RemotePattern | null {
    try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return null;
        }

        return {
            protocol: parsed.protocol === "https:" ? "https" : "http",
            hostname: parsed.hostname,
        };
    } catch {
        return null;
    }
}

const remotePatternMap = new Map<string, RemotePattern>();
for (const candidate of candidateImageOrigins) {
    if (!candidate) continue;
    const pattern = toRemotePattern(candidate);
    if (!pattern) continue;
    remotePatternMap.set(`${pattern.protocol}:${pattern.hostname}`, pattern);
}

const remotePatterns = Array.from(remotePatternMap.values());

const nextConfig: NextConfig = {
    reactStrictMode: true,

    // Static Export Configuration
    // Uncomment for static export (production deployment)
    // output: "export",
    // trailingSlash: true,

    onDemandEntries: {
        maxInactiveAge: 25 * 1000,
        pagesBufferLength: 2,
    },

    images: {
        // For static export, use unoptimized images
        // unoptimized: true,
        remotePatterns,
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours cache
        qualities: [75, 100],
    },

    // Security & Performance
    poweredByHeader: false,
    compress: true,

    // Experimental features
    experimental: {
        optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
    },

    // Environment variables validation
    env: {
        NEXT_PUBLIC_SITE_URL:
            process.env.NEXT_PUBLIC_SITE_URL || "https://wwts.uz",
        NEXT_PUBLIC_API_URL:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    },
};

export default nextConfig;
