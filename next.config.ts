import type { NextConfig } from "next";

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
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
            },
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours cache
        qualities: [75, 100],
    },

    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: "frame-src 'self' https://api-maps.yandex.ru https://yandex.ru https://yandex.uz https://*.yandex.ru https://*.yandex.uz https://yandex.uz/map-widget/ https://*.yandex.uz/map-widget/;",
                    },
                ],
            },
        ];
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
            process.env.NEXT_PUBLIC_SITE_URL || "https://wwsi.uz",
        NEXT_PUBLIC_API_URL:
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    },
};

export default nextConfig;
