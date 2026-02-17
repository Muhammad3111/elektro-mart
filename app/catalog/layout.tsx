import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog - Barcha mahsulotlar",
    description:
        "WWTS katalogi - laboratoriya uskunalari, ilmiy asboblar, analitik qurilmalar va professional laboratoriya aksessuarlari. Eng yaxshi narxlar va sifat kafolati.",
    keywords:
        "laboratoriya uskunalari katalogi, ilmiy asboblar, analitik qurilmalar, laboratoriya aksessuarlari, professional laboratory equipment, WWTS, wwts.uz",
    openGraph: {
        title: "Katalog - Barcha mahsulotlar | WWTS",
        description:
            "WWTS katalogi - laboratoriya uskunalari, ilmiy asboblar va laboratoriya texnologiyalari yechimlari.",
        type: "website",
        url: "https://wwts.uz/catalog",
        siteName: "WWTS",
        locale: "uz_UZ",
    },
    alternates: {
        canonical: "https://wwts.uz/catalog",
    },
};

export default function CatalogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
