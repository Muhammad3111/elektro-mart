"use client";

import * as React from "react";
import { Category } from "@/types/category";
import { useLanguage } from "@/contexts/language-context";

interface CategorySearchSelectProps {
    categories: Category[];
    value: string | null;
    onValueChange: (value: string | null) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function CategorySearchSelect({
    categories,
    value,
    onValueChange,
    placeholder,
    disabled,
}: CategorySearchSelectProps) {
    const { t } = useLanguage();

    // Get only parent categories
    const parentCategories = React.useMemo(() => {
        return categories.filter((c) => !c.parentId);
    }, [categories]);

    return (
        <select
            value={value || ""}
            onChange={(e) => onValueChange(e.target.value || null)}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value="">
                {placeholder || t("Kategoriya tanlang", "Выберите категорию")}
            </option>
            {parentCategories.map((category) => (
                <option key={category.id} value={category.id}>
                    {t(category.nameUz, category.nameRu)}
                </option>
            ))}
        </select>
    );
}
