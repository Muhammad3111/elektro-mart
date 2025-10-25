import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { CartProvider } from "@/contexts/cart-context";
import { SearchProvider } from "@/contexts/search-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
import { FloatingButtons } from "@/components/floating-buttons";
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
        default: "ElektroMart - Elektr kabel va aksessuarlar | Professional elektr mahsulotlari",
        template: "%s | ElektroMart"
    },
    description: "O'zbekistonda eng yaxshi elektr kabel, ulagichlar, rozetkalar va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Tez yetkazib berish va kafolat.",
    keywords: ["elektr kabel", "kabel", "ulagichlar", "rozetkalar", "avtomatlar", "elektr aksessuarlar", "Siemens", "Schneider", "ABB", "Legrand", "elektr mahsulotlari", "Toshkent", "O'zbekiston"],
    authors: [{ name: "ElektroMart" }],
    creator: "ElektroMart",
    publisher: "ElektroMart",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://elektromart.uz'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: "ElektroMart - Professional elektr mahsulotlari",
        description: "O'zbekistonda eng yaxshi elektr kabel va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari.",
        url: 'https://elektromart.uz',
        siteName: 'ElektroMart',
        locale: 'uz_UZ',
        type: 'website',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'ElektroMart - Elektr mahsulotlari',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ElektroMart - Professional elektr mahsulotlari',
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
            >
                <LanguageProvider>
                    <SearchProvider>
                        <CartProvider>
                            <FavoritesProvider>
                                {children}
                                <FloatingButtons />
                                <Toaster position="top-center" richColors />
                            </FavoritesProvider>
                        </CartProvider>
                    </SearchProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
