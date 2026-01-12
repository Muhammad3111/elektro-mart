"use client";

import { useState } from "react";
import { Category } from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface DeleteCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteCategoryModal({
  category,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCategoryModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!category) return;

    try {
      setLoading(true);
      await categoriesAPI.delete(category.id);
      toast.success(t("Kategoriya o'chirildi", "Категория удалена"));
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      console.error("Failed to delete category:", err);
      
      // Error handling
      const errorMessage = err?.message || t("Xatolik yuz berdi", "Произошла ошибка");
      
      if (err?.message?.includes("404")) {
        toast.error(t("Kategoriya topilmadi", "Категория не найдена"));
      } else if (err?.message?.includes("400")) {
        toast.error(t(
          "Kategoriyani o'chirib bo'lmaydi. Avval sub-kategoriyalarni o'chiring",
          "Невозможно удалить категорию. Сначала удалите подкатегории"
        ));
      } else if (err?.message?.includes("401")) {
        toast.error(t("Ruxsat yo'q. Qayta login qiling", "Нет доступа. Войдите снова"));
      } else if (err?.message?.includes("500")) {
        toast.error(t("Server xatosi. Keyinroq urinib ko'ring", "Ошибка сервера. Попробуйте позже"));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle>
                {t("Kategoriyani o'chirish", "Удалить категорию")}
              </DialogTitle>
              <DialogDescription>
                {t(
                  "Bu amalni bekor qilib bo'lmaydi",
                  "Это действие нельзя отменить"
                )}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {t(
              "Haqiqatan ham ushbu kategoriyani o'chirmoqchimisiz?",
              "Вы действительно хотите удалить эту категорию?"
            )}
          </p>
          <div className="mt-4 rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{t(category.nameEn, category.nameRu)}</div>
                <div className="text-sm text-muted-foreground">
                  {category.parent
                    ? `${t("Parent", "Родитель")}: ${t(category.parent.nameEn, category.parent.nameRu)}`
                    : t("Asosiy kategoriya", "Основная категория")}
                </div>
                {category.productsCount !== undefined && category.productsCount > 0 && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {category.productsCount} {t("ta mahsulot", "товаров")}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Products Warning */}
          {category.productsCount !== undefined && category.productsCount > 0 && (
            <div className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              {t(
                `Diqqat: Bu kategoriyada ${category.productsCount} ta mahsulot bor! Avval mahsulotlarni boshqa kategoriyaga o'tkazing yoki o'chiring.`,
                `Внимание: В этой категории ${category.productsCount} товаров! Сначала переместите или удалите товары.`
              )}
            </div>
          )}
          
          {/* Sub-categories Warning */}
          {category.subCategories && category.subCategories.length > 0 && (
            <div className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              {t(
                `Diqqat: Bu kategoriyada ${category.subCategories.length} ta sub-kategoriya bor!`,
                `Внимание: У этой категории ${category.subCategories.length} подкатегорий!`
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("Bekor qilish", "Отмена")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("O'chirish", "Удалить")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
