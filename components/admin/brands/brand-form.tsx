"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Brand, CreateBrandDto, UpdateBrandDto } from "@/types/brand";
import { toast } from "sonner";
import Image from "next/image";
import { MediaGalleryModal } from "@/components/admin/media-gallery-modal";
import { getImageUrl } from "@/lib/s3/get-image-url";

interface BrandFormProps {
  brand?: Brand;
  onSubmit: (data: CreateBrandDto | UpdateBrandDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function BrandForm({ brand, onSubmit, onCancel, loading }: BrandFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    nameUz: brand?.nameUz || "",
    nameRu: brand?.nameRu || "",
    image: brand?.image || "",
    isActive: brand?.isActive ?? true,
    order: brand?.order || 0,
  });
  const [imagePreview, setImagePreview] = useState<string>(brand?.image || "");
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Load image URL when brand is loaded
  useEffect(() => {
    if (brand?.image) {
      getImageUrl(brand.image).then(setImagePreview);
    }
  }, [brand]);

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleImageSelect = (keys: string[]) => {
    if (keys.length > 0) {
      setFormData(prev => ({ ...prev, image: keys[0] }));
      // Generate URL for preview
      getImageUrl(keys[0]).then(setImagePreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {brand 
            ? t("Brendni tahrirlash", "Редактировать бренд")
            : t("Yangi brend qo'shish", "Добавить новый бренд")
          }
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nameUz">
                {t("Nomi (O'zbekcha)", "Название (Узбекский)")} *
              </Label>
              <Input
                id="nameUz"
                value={formData.nameUz}
                onChange={(e) => setFormData(prev => ({ ...prev, nameUz: e.target.value }))}
                placeholder={t("Brend nomini kiriting", "Введите название бренда")}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nameRu">
                {t("Nomi (Ruscha)", "Название (Русский)")} *
              </Label>
              <Input
                id="nameRu"
                value={formData.nameRu}
                onChange={(e) => setFormData(prev => ({ ...prev, nameRu: e.target.value }))}
                placeholder={t("Brend nomini kiriting", "Введите название бренда")}
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>{t("Rasm", "Изображение")}</Label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Brand preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setImageModalOpen(true)}
                  className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    {t("Tanlash", "Выбрать")}
                  </span>
                </button>
              )}
              {imagePreview && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setImageModalOpen(true)}
                >
                  {t("O'zgartirish", "Изменить")}
                </Button>
              )}
            </div>
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">
              {t("Tartib raqami", "Порядковый номер")}
            </Label>
            <Input
              id="order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">
              {t("Faol", "Активный")}
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading
                ? t("Saqlanmoqda...", "Сохранение...")
                : brand
                ? t("Yangilash", "Обновить")
                : t("Qo'shish", "Добавить")
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              {t("Bekor qilish", "Отмена")}
            </Button>
          </div>

          {/* Media Gallery Modal */}
          <MediaGalleryModal
            open={imageModalOpen}
            onOpenChange={setImageModalOpen}
            onSelect={handleImageSelect}
            mode="single"
            selectedUrls={formData.image ? [formData.image] : []}
          />
        </form>
      </CardContent>
    </Card>
  );
}
