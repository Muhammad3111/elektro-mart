"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageOff, Upload, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Brand, CreateBrandDto, UpdateBrandDto } from "@/types/brand";
import { uploadImage } from "@/lib/api";
import { toast } from "sonner";
import Image from "next/image";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(brand?.image || "");
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("Rasm hajmi 2MB dan oshmasligi kerak", "Размер изображения не должен превышать 2MB"));
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData(prev => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;
      
      // Upload image if new file selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadResult = await uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      await onSubmit({
        ...formData,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
    } finally {
      setUploadingImage(false);
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
            <div className="space-y-4">
              {/* Image Preview */}
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
                <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                  <ImageOff className="w-8 h-8 text-muted-foreground" />
                </div>
              )}

              {/* Upload Button */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:bg-secondary/80"
                >
                  <Upload className="w-4 h-4" />
                  {t("Rasm tanlash", "Выбрать изображение")}
                </Label>
              </div>
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
              disabled={loading || uploadingImage}
              className="flex-1"
            >
              {loading || uploadingImage
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
              disabled={loading || uploadingImage}
            >
              {t("Bekor qilish", "Отмена")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
