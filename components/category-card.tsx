"use client";

import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { S3Image } from "@/components/s3-image";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    const { language } = useLanguage();
    const name = language === "en" ? category.nameEn : category.nameRu;

    // If this is a subcategory (has parentId), go to catalog with filter
    // Otherwise, go to category page
    const href = category.parentId
        ? `/catalog?category=${category.id}`
        : `/categories/${category.id}`;

    return (
        <Link
            href={href}
            className="group flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
        >
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted group-hover:bg-primary/10 transition-colors duration-300">
                {category.image ? (
                    <S3Image
                        src={category.image}
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
            {category.subCategories && category.subCategories.length > 0 && (
                <span className="text-xs text-muted-foreground">
                    {category.subCategories.length}{" "}
                    {language === "en" ? "bo'lim" : "раздел"}
                </span>
            )}
        </Link>
    );
}
