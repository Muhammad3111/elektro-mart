import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { AuthProvider } from "@/contexts/auth-context";
import { CartProvider } from "@/contexts/cart-context";
import { SearchProvider } from "@/contexts/search-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { FloatingButtons } from "@/components/floating-buttons";
import { PageLoading } from "@/components/page-loading";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "Sobirov Market - Elektr kabel va aksessuarlar | Professional elektr mahsulotlari",
        template: "%s | Sobirov Market"
    },
    description: "O'zbekistonda eng yaxshi elektr kabel, ulagichlar, rozetkalar va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Tez yetkazib berish va kafolat.",
    keywords: ["elektr kabel", "kabel", "ulagichlar", "rozetkalar", "avtomatlar", "elektr aksessuarlar", "Siemens", "Schneider", "ABB", "Legrand", "elektr mahsulotlari", "Toshkent", "O'zbekiston"],
    authors: [{ name: "Sobirov Market" }],
    creator: "Sobirov Market",
    publisher: "Sobirov Market",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://elektromart.uz'),
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon/favicon.ico', sizes: 'any' },
            { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
            { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/favicon/site.webmanifest',
    openGraph: {
        title: "Sobirov Market - Professional elektr mahsulotlari",
        description: "O'zbekistonda eng yaxshi elektr kabel va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari.",
        url: 'https://elektromart.uz',
        siteName: 'Sobirov Market',
        locale: 'uz_UZ',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Sobirov Market - Elektr mahsulotlari',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Sobirov Market - Professional elektr mahsulotlari',
        description: "O'zbekistonda eng yaxshi elektr kabel va aksessuarlar",
        images: ['/og-image.jpg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification-code',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <LanguageProvider>
                    <AuthProvider>
                        <SearchProvider>
                            <CartProvider>
                                <FavoritesProvider>
                                    <PageLoading />
                                    {children}
                                    <FloatingButtons />
                                    <Toaster position="top-center" richColors />
                                </FavoritesProvider>
                            </CartProvider>
                        </SearchProvider>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
