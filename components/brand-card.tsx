"use client";

import { useLanguage } from "@/contexts/language-context";
import { Brand } from "@/types/brand";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  const { language } = useLanguage();
  const name = language === "uz" ? brand.nameUz : brand.nameRu;

  return (
    <Link
      href={`/brands/${brand.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted group-hover:bg-primary/10 transition-colors duration-300">
        {brand.image ? (
          <Image
            src={brand.image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
            <ImageOff className="w-8 h-8 group-hover:text-primary transition-colors duration-300" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-center line-clamp-2 group-hover:text-primary transition-colors duration-300">
        {name}
      </h3>
      {brand.productCount && brand.productCount > 0 && (
        <span className="text-xs text-muted-foreground">
          {brand.productCount} {language === "uz" ? "mahsulot" : "товар"}
        </span>
      )}
    </Link>
  );
}
