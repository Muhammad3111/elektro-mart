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
        en: "Leading provider of electrical and technology products - cables, connectors, sockets, smart devices, computers and accessories. Siemens, Schneider, ABB, Legrand brands. Fast delivery and warranty.",
        ru: "Ведущий поставщик электрических и технологических товаров - кабели, разъемы, розетки, смарт-устройства, компьютеры и аксессуары. Бренды Siemens, Schneider, ABB, Legrand. Быстрая доставка и гарантия.",
        uz: "Elektr va texnologik mahsulotlarning yetakchi yetkazib beruvchisi - kabellar, ulagichlar, rozetkalar, smart qurilmalar, kompyuterlar va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Tez yetkazib berish va kafolat.",
    },
    keywords: {
        en: [
            "electrical cables",
            "cables",
            "connectors",
            "sockets",
            "circuit breakers",
            "electrical accessories",
            "technology products",
            "smart devices",
            "computers",
            "laptops",
            "electronics",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "electrical products",
            "Tashkent",
            "Uzbekistan",
            "WWTS",
            "wwts.uz",
        ],
        ru: [
            "электрические кабели",
            "кабели",
            "разъемы",
            "розетки",
            "автоматы",
            "электрические аксессуары",
            "технологические товары",
            "смарт устройства",
            "компьютеры",
            "ноутбуки",
            "электроника",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "электротовары",
            "Ташкент",
            "Узбекистан",
            "WWTS",
            "wwts.uz",
        ],
        uz: [
            "elektr kabellari",
            "kabellar",
            "ulagichlar",
            "rozetkalar",
            "avtomatlar",
            "elektr aksessuarlari",
            "texnologik mahsulotlar",
            "smart qurilmalar",
            "kompyuterlar",
            "noutbuklar",
            "elektronika",
            "Siemens",
            "Schneider",
            "ABB",
            "Legrand",
            "elektr mahsulotlari",
            "Toshkent",
            "O'zbekiston",
            "WWTS",
            "wwts.uz",
        ],
    },

    // Contact
    contact: {
        phone: "+998 93 432 45 65",
        phoneRaw: "+998934324565",
        email: "info@wwts.uz",
        address: {
            en: "Uzbekistan, Tashkent, Shaykhantakhur district, Takhtapul, Turakurgan street 12b, Landmark: Malika market",
            ru: "Узбекистан, Ташкент, Шайхантахурский район, Тахтапуль, улица Туракурган 12б, Ориентир: рынок Малика",
            uz: "O'zbekiston, Toshkent, Shayxontohur tumani, Taxtapul, Turakurgan ko'chasi 12b, Mo'ljal: Malika bozori",
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
    defaultLanguage: "ru" as const,
    supportedLanguages: ["en", "ru"] as const,
} as const;

export type SiteConfig = typeof siteConfig;
