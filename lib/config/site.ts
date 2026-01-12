/**
 * Site Configuration
 * Central configuration for site-wide settings
 */

export const siteConfig = {
    name: "Worldwide Technology Solutions",
    shortName: "WWTS",
    domain: "wwts.uz",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://wwts.uz",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",

    // SEO - 3 languages for SEO purposes
    description: {
        en: "Leading provider of electrical cables, connectors, sockets and accessories. Siemens, Schneider, ABB, Legrand brands. Fast delivery and warranty.",
        ru: "Ведущий поставщик электрических кабелей, разъемов, розеток и аксессуаров. Бренды Siemens, Schneider, ABB, Legrand. Быстрая доставка и гарантия.",
        uz: "Elektr kabellari, ulagichlar, rozetkalar va aksessuarlarning yetakchi yetkazib beruvchisi. Siemens, Schneider, ABB, Legrand brendlari. Tez yetkazib berish va kafolat.",
    },
    keywords: {
        en: [
            "electrical cables",
            "cables",
            "connectors",
            "sockets",
            "circuit breakers",
            "electrical accessories",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "electrical products",
            "Tashkent",
            "Uzbekistan",
        ],
        ru: [
            "электрические кабели",
            "кабели",
            "разъемы",
            "розетки",
            "автоматы",
            "электрические аксессуары",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "электротовары",
            "Ташкент",
            "Узбекистан",
        ],
        uz: [
            "elektr kabellari",
            "kabellar",
            "ulagichlar",
            "rozetkalar",
            "avtomatlar",
            "elektr aksessuarlari",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "elektr mahsulotlari",
            "Toshkent",
            "O'zbekiston",
        ],
    },

    // Contact
    contact: {
        phone: "+998 33 470 47 00",
        phoneRaw: "+998334704700",
        email: "info@wwts.uz",
        address: {
            en: "Tashkent, Shaykhontohur district, Alisher Navoi street, 16A",
            ru: "г.Ташкент, Шайхонтохурский район, ул.Алишера Навои, дом 16А",
            uz: "Toshkent, Shayxontohur tumani, Alisher Navoiy ko'chasi, 16A uy",
        },
    },

    // Social Media
    social: {
        telegram: "https://t.me/wwts_uz",
        instagram: "https://instagram.com/wwts.uz",
    },

    // Verification
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
        yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || "",
    },

    // Currency
    currency: "USD",
    currencySymbol: "$",

    // Default language
    defaultLanguage: "en" as const,
    supportedLanguages: ["en", "ru"] as const,
} as const;

export type SiteConfig = typeof siteConfig;
