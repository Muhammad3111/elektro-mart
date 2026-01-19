import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Katalog - Barcha mahsulotlar",
    description:
        "WWTS katalogi - elektr va texnologik mahsulotlar, kabellar, ulagichlar, rozetkalar, avtomatlar, smart qurilmalar va aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Eng yaxshi narxlar va sifat kafolati.",
    keywords:
        "elektr katalog, kabel katalog, elektr mahsulotlari, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar katalog, texnologik mahsulotlar, smart qurilmalar, WWTS, wwts.uz",
    openGraph: {
        title: "Katalog - Barcha mahsulotlar | WWTS",
        description:
            "WWTS katalogi - elektr va texnologik mahsulotlar, kabellar, ulagichlar, rozetkalar va aksessuarlar.",
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
