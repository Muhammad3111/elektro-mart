"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-9xl font-black text-primary">404</h1>
          <h2 className="text-3xl font-bold">
            {t("Sahifa topilmadi", "Страница не найдена")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t(
              "Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.",
              "Извините, страница, которую вы ищете, не существует или была удалена."
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="outline">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t("Orqaga", "Назад")}
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              {t("Bosh sahifa", "Главная страница")}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
