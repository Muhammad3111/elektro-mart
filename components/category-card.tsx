"use client";

import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { ImageOff } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { language } = useLanguage();
  const name = language === "uz" ? category.nameUz : category.nameRu;

  return (
    <Link
      href={`/categories/${category.id}`}
      className="group flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
    >
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
        {category.image ? (
          <Image
            src={category.image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
            <ImageOff className="w-8 h-8" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-center line-clamp-2 group-hover:text-primary transition-colors">
        {name}
      </h3>
      {category.subCategories && category.subCategories.length > 0 && (
        <span className="text-xs text-muted-foreground">
          {category.subCategories.length} {language === "uz" ? "bo'lim" : "раздел"}
        </span>
      )}
    </Link>
  );
}
