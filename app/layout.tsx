import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { SearchProvider } from "@/contexts/search-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { QueryProvider } from "@/lib/query/query-provider";
import { FloatingButtons } from "@/components/floating-buttons";
import { PageLoading } from "@/components/page-loading";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/config/site";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: "#2563eb",
};

export const metadata: Metadata = {
    title: {
        default: `${siteConfig.name} | Professional Electrical Products`,
        template: `%s | ${siteConfig.shortName}`
    },
    description: siteConfig.description.en,
    keywords: siteConfig.keywords.en,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
        canonical: "/",
        languages: {
            "en": "/",
            "ru": "/?lang=ru",
        },
    },
    icons: {
        icon: [
            { url: "/favicon/favicon.ico", sizes: "any" },
            { url: "/favicon/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
        ],
        apple: [
            { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
    manifest: "/favicon/site.webmanifest",
    openGraph: {
        title: `${siteConfig.name} - Professional Electrical Products`,
        description: siteConfig.description.en,
        url: siteConfig.url,
        siteName: siteConfig.name,
        locale: "en_US",
        alternateLocale: "ru_RU",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: `${siteConfig.name} - Electrical Products`,
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: `${siteConfig.name} - Professional Electrical Products`,
        description: siteConfig.description.en,
        images: ["/og-image.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: siteConfig.verification.google || undefined,
        yandex: siteConfig.verification.yandex || undefined,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="dns-prefetch" href="//fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <QueryProvider>
                    <LanguageProvider>
                        <AuthProvider>
                            <SearchProvider>
                                <CartProvider>
                                    <FavoritesProvider>
                                        <a 
                                            href="#main-content" 
                                            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
                                        >
                                            Skip to main content
                                        </a>
                                        <PageLoading />
                                        {children}
                                        <FloatingButtons />
                                        <Toaster position="top-center" richColors />
                                    </FavoritesProvider>
                                </CartProvider>
                            </SearchProvider>
                        </AuthProvider>
                    </LanguageProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
