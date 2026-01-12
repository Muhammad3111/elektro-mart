"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Search, ImageOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { HomeSlider, CreateHomeSliderDto, UpdateHomeSliderDto } from "@/types/slider";
import { homeSlidersAPI } from "@/lib/api";
import { toast } from "sonner";
import { HomeSliderForm } from "./home-slider-form";
import { S3Image } from "@/components/s3-image";
import { Switch } from "@/components/ui/switch";

export function HomeSliderTable() {
  const { t } = useLanguage();
  const [sliders, setSliders] = useState<HomeSlider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<HomeSlider | null>(null);
  const [deletingSlider, setDeletingSlider] = useState<HomeSlider | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      setLoading(true);
      const data = await homeSlidersAPI.getAll();
      setSliders(data);
    } catch (error) {
      console.error("Failed to load sliders:", error);
      toast.error(t("Sliderlarni yuklashda xatolik", "Ошибка при загрузке слайдеров"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateHomeSliderDto) => {
    try {
      setFormLoading(true);
      await homeSlidersAPI.create(data);
      toast.success(t("Slider muvaffaqiyatli qo'shildi", "Слайдер успешно добавлен"));
      setDialogOpen(false);
      loadSliders();
    } catch (error: any) {
      console.error("Failed to create slider:", error);
      toast.error((error as Error).message || t("Slider qo'shishda xatolik", "Ошибка при добавлении слайдера"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateHomeSliderDto) => {
    if (!editingSlider) return;
    
    try {
      setFormLoading(true);
      await homeSlidersAPI.update(editingSlider.id, data);
      toast.success(t("Slider muvaffaqiyatli yangilandi", "Слайдер успешно обновлен"));
      setDialogOpen(false);
      setEditingSlider(null);
      loadSliders();
    } catch (error: any) {
      console.error("Failed to update slider:", error);
      toast.error((error as Error).message || t("Slider yangilashda xatolik", "Ошибка при обновлении слайдера"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (slider: HomeSlider) => {
    try {
      await homeSlidersAPI.update(slider.id, {
        isActive: !slider.isActive,
      });
      toast.success(
        slider.isActive
          ? t("Slider faolsizlantirildi", "Слайдер деактивирован")
          : t("Slider faollashtirildi", "Слайдер активирован")
      );
      loadSliders();
    } catch (error: any) {
      console.error("Failed to toggle slider status:", error);
      toast.error((error as Error).message || t("Status o'zgartirishda xatolik", "Ошибка при изменении статуса"));
    }
  };

  const handleDelete = async () => {
    if (!deletingSlider) return;

    try {
      await homeSlidersAPI.delete(deletingSlider.id);
      toast.success(t("Slider o'chirildi", "Слайдер удален"));
      setDeletingSlider(null);
      loadSliders();
    } catch (error: any) {
      console.error("Failed to delete slider:", error);
      toast.error((error as Error).message || t("Slider o'chirishda xatolik", "Ошибка при удалении слайдера"));
    }
  };

  const filteredSliders = sliders.filter((slider) =>
    slider.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slider.titleRu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">{t("Yuklanmoqda...", "Загрузка...")}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("Home Sliderlar", "Слайдеры главной")}</h2>
        <Button
          onClick={() => {
            setEditingSlider(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t("Yangi slider", "Новый слайдер")}
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t("Qidirish...", "Поиск...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4">
        {filteredSliders.map((slider) => (
          <div key={slider.id} className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                {slider.coverImage ? (
                  <S3Image
                    src={slider.coverImage}
                    alt={slider.titleEn}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageOff className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-lg">{t(slider.titleEn, slider.titleRu)}</div>
                <div className="text-sm text-muted-foreground line-clamp-1">
                  {t(slider.subtitleEn, slider.subtitleRu)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {t("Havola", "Ссылка")}: {slider.link}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {t("Tartib", "Порядок")}: {slider.order}
                  </Badge>
                  <Badge variant={slider.isActive ? "default" : "secondary"}>
                    {slider.isActive ? t("Faol", "Активный") : t("Nofaol", "Неактивный")}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={slider.isActive}
                  onCheckedChange={() => handleToggleActive(slider)}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditingSlider(slider);
                    setDialogOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setDeletingSlider(slider)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSliders.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t("Sliderlar topilmadi", "Слайдеры не найдены")}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <HomeSliderForm
            slider={editingSlider || undefined}
            onSubmit={editingSlider ? handleUpdate : handleCreate}
            onCancel={() => {
              setDialogOpen(false);
              setEditingSlider(null);
            }}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingSlider} onOpenChange={() => setDeletingSlider(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Sliderni o'chirish", "Удалить слайдер")}</DialogTitle>
            <DialogDescription>
              {t(
                "Rostdan ham bu sliderni o'chirmoqchimisiz?",
                "Вы уверены, что хотите удалить этот слайдер?"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSlider(null)}>
              {t("Bekor qilish", "Отмена")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("O'chirish", "Удалить")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
