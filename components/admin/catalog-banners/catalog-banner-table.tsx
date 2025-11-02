"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Trash2, Plus, Search, ImageOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { CatalogBanner, CreateCatalogBannerDto, UpdateCatalogBannerDto } from "@/types/slider";
import { catalogBannersAPI } from "@/lib/api";
import { toast } from "sonner";
import { CatalogBannerForm } from "./catalog-banner-form";
import { S3Image } from "@/components/s3-image";
import { Switch } from "@/components/ui/switch";

export function CatalogBannerTable() {
  const { t } = useLanguage();
  const [banners, setBanners] = useState<CatalogBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<CatalogBanner | null>(null);
  const [deletingBanner, setDeletingBanner] = useState<CatalogBanner | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await catalogBannersAPI.getAll();
      setBanners(data);
    } catch (error) {
      console.error("Failed to load banners:", error);
      toast.error(t("Bannerlarni yuklashda xatolik", "Ошибка при загрузке баннеров"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateCatalogBannerDto) => {
    try {
      setFormLoading(true);
      await catalogBannersAPI.create(data);
      toast.success(t("Banner muvaffaqiyatli qo'shildi", "Баннер успешно добавлен"));
      setDialogOpen(false);
      loadBanners();
    } catch (error: any) {
      toast.error(t("Banner qo'shishda xatolik", "Ошибка при добавлении баннера"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateCatalogBannerDto) => {
    if (!editingBanner) return;
    try {
      setFormLoading(true);
      await catalogBannersAPI.update(editingBanner.id, data);
      toast.success(t("Banner muvaffaqiyatli yangilandi", "Баннер успешно обновлен"));
      setDialogOpen(false);
      setEditingBanner(null);
      loadBanners();
    } catch (error: any) {
      toast.error(t("Banner yangilashda xatolik", "Ошибка при обновлении баннера"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (banner: CatalogBanner) => {
    try {
      await catalogBannersAPI.update(banner.id, { isActive: !banner.isActive });
      toast.success(banner.isActive ? t("Banner faolsizlantirildi", "Баннер деактивирован") : t("Banner faollashtirildi", "Баннер активирован"));
      loadBanners();
    } catch (error: any) {
      toast.error(t("Status o'zgartirishda xatolik", "Ошибка при изменении статуса"));
    }
  };

  const handleDelete = async () => {
    if (!deletingBanner) return;
    try {
      await catalogBannersAPI.delete(deletingBanner.id);
      toast.success(t("Banner o'chirildi", "Баннер удален"));
      setDeletingBanner(null);
      loadBanners();
    } catch (error: any) {
      toast.error(t("Banner o'chirishda xatolik", "Ошибка при удалении баннера"));
    }
  };

  const filteredBanners = banners.filter((banner) =>
    banner.titleUz.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.titleRu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center">{t("Yuklanmoqda...", "Загрузка...")}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("Katalog Bannerlari", "Баннеры каталога")}</h2>
        <Button onClick={() => { setEditingBanner(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          {t("Yangi banner", "Новый баннер")}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder={t("Qidirish...", "Поиск...")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
        </div>
      </div>

      <div className="space-y-4">
        {filteredBanners.map((banner) => (
          <div key={banner.id} className="p-4 border rounded-lg bg-card">
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                {banner.coverImage ? (
                  <S3Image src={banner.coverImage} alt={banner.titleUz} fill className="object-cover" />
                ) : (
                  <ImageOff className="w-6 h-6 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-medium text-lg">{t(banner.titleUz, banner.titleRu)}</div>
                <div className="text-xs text-muted-foreground mt-1">{t("Havola", "Ссылка")}: {banner.link}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{t("Tartib", "Порядок")}: {banner.order}</Badge>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? t("Faol", "Активный") : t("Nofaol", "Неактивный")}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={banner.isActive} onCheckedChange={() => handleToggleActive(banner)} />
                <Button variant="outline" size="icon" onClick={() => { setEditingBanner(banner); setDialogOpen(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setDeletingBanner(banner)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBanners.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">{t("Bannerlar topilmadi", "Баннеры не найдены")}</div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <CatalogBannerForm banner={editingBanner || undefined} onSubmit={editingBanner ? handleUpdate : handleCreate} onCancel={() => { setDialogOpen(false); setEditingBanner(null); }} loading={formLoading} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingBanner} onOpenChange={() => setDeletingBanner(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Bannerni o'chirish", "Удалить баннер")}</DialogTitle>
            <DialogDescription>{t("Rostdan ham bu bannerni o'chirmoqchimisiz?", "Вы уверены, что хотите удалить этот баннер?")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingBanner(null)}>{t("Bekor qilish", "Отмена")}</Button>
            <Button variant="destructive" onClick={handleDelete}>{t("O'chirish", "Удалить")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
