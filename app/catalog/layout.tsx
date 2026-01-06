import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog - Barcha mahsulotlar",
  description: "Sobirov Market katalogi - elektr kabel, ulagichlar, rozetkalar, avtomatlar va boshqa elektr aksessuarlar. Siemens, Schneider, ABB, Legrand brendlari. Eng yaxshi narxlar va sifat kafolati.",
  keywords: "elektr katalog, kabel katalog, elektr mahsulotlari, ulagichlar, rozetkalar, avtomatlar, elektr aksessuarlar katalog, Sobirov Market",
  openGraph: {
    title: "Katalog - Barcha mahsulotlar | Sobirov Market",
    description: "Sobirov Market katalogi - elektr kabel, ulagichlar, rozetkalar va boshqa elektr aksessuarlar.",
    type: "website",
    url: "https://elektromart.uz/catalog",
    siteName: "Sobirov Market",
    locale: "uz_UZ",
  },
  alternates: {
    canonical: "https://elektromart.uz/catalog",
  },
};

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
