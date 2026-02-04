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
        en: "WWTS Lab Technology - Leading supplier of laboratory equipment, scientific instruments, measuring devices, analytical equipment, microscopes and lab accessories in Uzbekistan and CIS countries. Professional laboratory solutions with warranty and fast delivery.",
        ru: "WWTS Lab Technology - Ведущий поставщик лабораторного оборудования, научных приборов, измерительных устройств, аналитического оборудования, микроскопов и лабораторных аксессуаров в Узбекистане и странах СНГ. Профессиональные лабораторные решения с гарантией и быстрой доставкой.",
        uz: "WWTS Lab Technology - O'zbekiston va MDH davlatlarida laboratoriya uskunalari, ilmiy asboblar, o'lchash qurilmalari, analitik uskunalar, mikroskoplar va laboratoriya aksessuarlarining yetakchi yetkazib beruvchisi. Kafolatli va tez yetkazib beriladigan professional laboratoriya yechimlari.",
    },
    keywords: {
        en: [
            // Primary keywords
            "laboratory equipment",
            "lab instruments",
            "laboratory supplies",
            "laboratory equipment supplier",
            "lab technology",
            "scientific equipment",
            "professional laboratory equipment",
            "research equipment",
            "laboratory measuring instruments",
            "laboratory furniture and accessories",
            // Analytical & measuring
            "analytical laboratory equipment",
            "measuring devices",
            "laboratory sensors",
            "precision instruments",
            "calibration equipment",
            // Specific equipment
            "microscopes",
            "spectrophotometers",
            "centrifuges",
            "laboratory glassware",
            "lab consumables",
            // Services
            "laboratory equipment delivery",
            "laboratory equipment consultation",
            "professional laboratory services",
            "laboratory equipment installation",
            "equipment warranty service",
            "laboratory technical service center",
            // Supporting keywords
            "how to choose laboratory equipment",
            "laboratory standards",
            "ASTM testing guide",
            "laboratory technology trends",
            "scientific and research instruments",
            "laboratory safety tips",
            // Brand keywords
            "WWTS",
            "WWTS Lab",
            "WWTS Lab Technology",
            "wwts.uz",
            // CIS Countries
            "Uzbekistan",
            "Kazakhstan",
            "Kyrgyzstan",
            "Tajikistan",
            "Turkmenistan",
            "Russia",
            "Azerbaijan",
            "Armenia",
            "Georgia",
            "Belarus",
            "Moldova",
            // Cities - Uzbekistan
            "Tashkent",
            "Samarkand",
            "Bukhara",
            "Namangan",
            "Andijan",
            "Fergana",
            "Nukus",
            "Karshi",
            "Urgench",
            // Cities - Kazakhstan
            "Almaty",
            "Astana",
            "Shymkent",
            // Cities - Other CIS
            "Bishkek",
            "Dushanbe",
            "Ashgabat",
            "Moscow",
            "Baku",
            // Combined brand + location
            "WWTS Tashkent",
            "WWTS Uzbekistan",
            "laboratory equipment Tashkent",
            "lab supplies Uzbekistan",
        ],
        ru: [
            // Primary keywords
            "лабораторное оборудование",
            "лабораторные приборы",
            "лабораторные принадлежности",
            "поставщик лабораторного оборудования",
            "лабораторные технологии",
            "научное оборудование",
            "профессиональное лабораторное оборудование",
            "исследовательское оборудование",
            "лабораторные измерительные приборы",
            "лабораторная мебель и аксессуары",
            // Analytical & measuring
            "аналитическое лабораторное оборудование",
            "измерительные устройства",
            "лабораторные датчики",
            "прецизионные приборы",
            "калибровочное оборудование",
            // Specific equipment
            "микроскопы",
            "спектрофотометры",
            "центрифуги",
            "лабораторная посуда",
            "лабораторные расходные материалы",
            // Services
            "доставка лабораторного оборудования",
            "консультации по лабораторному оборудованию",
            "профессиональные лабораторные услуги",
            "установка лабораторного оборудования",
            "гарантийное обслуживание оборудования",
            "центр технического обслуживания лабораторий",
            // Supporting keywords
            "как выбрать лабораторное оборудование",
            "лабораторные стандарты",
            "руководство по тестированию ASTM",
            "тренды лабораторных технологий",
            "научные и исследовательские приборы",
            "советы по безопасности в лаборатории",
            // Brand keywords
            "WWTS",
            "WWTS Lab",
            "WWTS Lab Technology",
            "wwts.uz",
            // CIS Countries
            "Узбекистан",
            "Казахстан",
            "Кыргызстан",
            "Таджикистан",
            "Туркменистан",
            "Россия",
            "Азербайджан",
            "Армения",
            "Грузия",
            "Беларусь",
            "Молдова",
            // Cities - Uzbekistan
            "Ташкент",
            "Самарканд",
            "Бухара",
            "Наманган",
            "Андижан",
            "Фергана",
            "Нукус",
            "Карши",
            "Ургенч",
            // Cities - Kazakhstan
            "Алматы",
            "Астана",
            "Шымкент",
            // Cities - Other CIS
            "Бишкек",
            "Душанбе",
            "Ашхабад",
            "Москва",
            "Баку",
            // Combined brand + location
            "WWTS Ташкент",
            "WWTS Узбекистан",
            "лабораторное оборудование Ташкент",
            "лабораторные принадлежности Узбекистан",
            "купить лабораторное оборудование",
            "лабораторное оборудование СНГ",
        ],
        uz: [
            // Primary keywords
            "laboratoriya uskunalari",
            "laboratoriya asbob-anjomlari",
            "laboratoriya jihozlari",
            "laboratoriya uskunalari yetkazib beruvchi",
            "laboratoriya texnologiyalari",
            "ilmiy uskunalar",
            "professional laboratoriya uskunalari",
            "tadqiqot uskunalari",
            "laboratoriya o'lchov asboblari",
            "laboratoriya mebellari va aksessuarlari",
            // Analytical & measuring
            "analitik laboratoriya uskunalari",
            "o'lchash qurilmalari",
            "laboratoriya sensorlari",
            "aniq asboblar",
            "kalibrlash uskunalari",
            // Specific equipment
            "mikroskoplar",
            "spektrofotometrlar",
            "sentrifugalar",
            "laboratoriya idishlari",
            "laboratoriya sarf materiallari",
            // Services
            "laboratoriya uskunalarini yetkazib berish",
            "laboratoriya jihozlari bo'yicha maslahat",
            "professional laboratoriya xizmatlari",
            "laboratoriya jihozlari o'rnatish",
            "uskunalar kafolatli xizmat",
            "laboratoriya texnik xizmat markazi",
            // Supporting keywords
            "qanday laboratoriya jihozlari tanlash",
            "laboratoriya standartlari",
            "ASTM testlar bo'yicha qo'llanma",
            "laboratoriya texnologiya trendlar",
            "ilmiy va tadqiqot asboblari",
            "laboratoriya xavfsizligi maslahatlari",
            // Brand keywords
            "WWTS",
            "WWTS Lab",
            "WWTS Lab Technology",
            "wwts.uz",
            // CIS Countries
            "O'zbekiston",
            "Qozog'iston",
            "Qirg'iziston",
            "Tojikiston",
            "Turkmaniston",
            "Rossiya",
            "Ozarbayjon",
            "Armaniston",
            "Gruziya",
            "Belarus",
            "Moldova",
            // Cities - Uzbekistan
            "Toshkent",
            "Samarqand",
            "Buxoro",
            "Namangan",
            "Andijon",
            "Farg'ona",
            "Nukus",
            "Qarshi",
            "Urganch",
            // Cities - Kazakhstan
            "Olmaota",
            "Ostona",
            "Shimkent",
            // Cities - Other CIS
            "Bishkek",
            "Dushanbe",
            "Ashxobod",
            "Moskva",
            "Boku",
            // Combined brand + location
            "WWTS Toshkent",
            "WWTS O'zbekiston",
            "laboratoriya uskunalari Toshkent",
            "laboratoriya jihozlari O'zbekiston",
            "laboratoriya to'plamlari",
            "laboratoriya furnitura",
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
