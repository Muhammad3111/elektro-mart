"use client";

import { Category } from "@/types/category";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";
import { Calendar, Hash, Layers, Image as ImageIcon } from "lucide-react";

interface CategoryDetailModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryDetailModal({
  category,
  open,
  onOpenChange,
}: CategoryDetailModalProps) {
  const { t } = useLanguage();

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            {t("Kategoriya tafsilotlari", "Детали категории")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "Kategoriya haqida to'liq ma'lumot",
              "Полная информация о категории"
            )}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            {/* Image */}
            {category.image && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ImageIcon className="w-4 h-4" />
                  {t("Rasm", "Изображение")}
                </div>
                <div className="relative w-full h-48 rounded-lg overflow-hidden border bg-muted">
                  <Image
                    src={category.image}
                    alt={category.nameUz}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("Nomi (O'zbek)", "Название (Узбек)")}
                </div>
                <div className="text-base font-semibold">{category.nameUz}</div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("Nomi (Rus)", "Название (Русский)")}
                </div>
                <div className="text-base font-semibold">{category.nameRu}</div>
              </div>
            </div>

            {/* Parent Category */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Parent kategoriya", "Родительская категория")}
              </div>
              <div>
                {category.parent ? (
                  <Badge variant="secondary">
                    {t(category.parent.nameUz, category.parent.nameRu)}
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    {t("Asosiy kategoriya", "Основная категория")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Order */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Hash className="w-4 h-4" />
                {t("Tartib raqami", "Порядковый номер")}
              </div>
              <div className="text-base font-semibold">{category.order}</div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                {t("Holat", "Статус")}
              </div>
              <div>
                {category.isActive ? (
                  <Badge className="bg-green-500">
                    {t("Faol", "Активный")}
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    {t("Nofaol", "Неактивный")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Products Count */}
            {category.productsCount !== undefined && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("Mahsulotlar soni", "Количество товаров")}
                </div>
                <div className="text-base font-semibold">
                  {category.productsCount} {t("ta mahsulot", "товаров")}
                </div>
              </div>
            )}

            {/* Sub Categories */}
            {category.subCategories && category.subCategories.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {t("Sub-kategoriyalar", "Подкатегории")} (
                  {category.subCategories.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.subCategories.map((sub) => (
                    <Badge key={sub.id} variant="outline">
                      {t(sub.nameUz, sub.nameRu)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ID */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                ID
              </div>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                {category.id}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {t("Yaratilgan", "Создано")}
                </div>
                <div className="text-sm">
                  {category.createdAt
                    ? new Date(category.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  {t("Yangilangan", "Обновлено")}
                </div>
                <div className="text-sm">
                  {category.updatedAt
                    ? new Date(category.updatedAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
