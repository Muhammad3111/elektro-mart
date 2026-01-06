/**
 * Site Configuration
 * Central configuration for site-wide settings
 */

export const siteConfig = {
  name: "Worldwide Technology Solutions",
  shortName: "WWSI",
  domain: "wwsi.uz",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://wwsi.uz",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  
  // SEO
  description: {
    en: "Leading provider of electrical cables, connectors, sockets and accessories. Siemens, Schneider, ABB, Legrand brands. Fast delivery and warranty.",
    ru: "Ведущий поставщик электрических кабелей, разъемов, розеток и аксессуаров. Бренды Siemens, Schneider, ABB, Legrand. Быстрая доставка и гарантия."
  },
  keywords: {
    en: ["electrical cables", "cables", "connectors", "sockets", "circuit breakers", "electrical accessories", "Siemens", "Schneider", "ABB", "Legrand", "electrical products", "Tashkent", "Uzbekistan"],
    ru: ["электрические кабели", "кабели", "разъемы", "розетки", "автоматы", "электрические аксессуары", "Siemens", "Schneider", "ABB", "Legrand", "электротовары", "Ташкент", "Узбекистан"]
  },
  
  // Contact
  contact: {
    phone: "+998 33 470 47 00",
    phoneRaw: "+998334704700",
    email: "info@wwsi.uz",
    address: {
      en: "Uzbekistan, Tashkent, Shaykhantahur district, Takhtapul, Turakurgan street 12b, Landmark: Malika market",
      ru: "Узбекистан, Ташкент, Шайхантахурский район, Тахтапуль, улица Туракурган 12б, Ориентир: рынок Малика"
    }
  },
  
  // Social Media
  social: {
    telegram: "https://t.me/wwsi_uz",
    instagram: "https://instagram.com/wwsi.uz",
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
