"use client";

import { useLanguage } from "@/contexts/language-context";
import { Package } from "lucide-react";

export function CategoryEmptyState() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
        <Package className="w-12 h-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {t("Kategoriyalar mavjud emas", "Категории отсутствуют")}
      </h3>
      <p className="text-muted-foreground max-w-md">
        {t(
          "Hozircha hech qanday kategoriya qo'shilmagan. Iltimos, keyinroq qaytib keling.",
          "Пока не добавлено ни одной категории. Пожалуйста, вернитесь позже."
        )}
      </p>
    </div>
  );
}
