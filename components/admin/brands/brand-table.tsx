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
import { Brand, CreateBrandDto, UpdateBrandDto } from "@/types/brand";
import { brandsAPI } from "@/lib/api";
import { toast } from "sonner";
import { BrandForm } from "./brand-form";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function BrandTable() {
  const { t } = useLanguage();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await brandsAPI.getAll();
      setBrands(data);
    } catch (error) {
      console.error("Failed to load brands:", error);
      toast.error(t("Brendlarni yuklashda xatolik", "Ошибка при загрузке брендов"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: CreateBrandDto) => {
    try {
      setFormLoading(true);
      await brandsAPI.create(data);
      toast.success(t("Brend muvaffaqiyatli qo'shildi", "Бренд успешно добавлен"));
      setDialogOpen(false);
      loadBrands();
    } catch (error: any) {
      console.error("Failed to create brand:", error);
      toast.error((error as Error).message || t("Brend qo'shishda xatolik", "Ошибка при добавлении бренда"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data: UpdateBrandDto) => {
    if (!editingBrand) return;
    
    try {
      setFormLoading(true);
      await brandsAPI.update(editingBrand.id, data);
      toast.success(t("Brend muvaffaqiyatli yangilandi", "Бренд успешно обновлен"));
      setDialogOpen(false);
      setEditingBrand(null);
      loadBrands();
    } catch (error: any) {
      console.error("Failed to update brand:", error);
      toast.error((error as Error).message || t("Brend yangilashda xatolik", "Ошибка при обновлении бренда"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleToggleActive = async (brand: Brand) => {
    try {
      await brandsAPI.update(brand.id, {
        isActive: !brand.isActive,
      });
      toast.success(
        brand.isActive
          ? t("Brend faolsizlantirildi", "Бренд деактивирован")
          : t("Brend faollashtirildi", "Бренд активирован")
      );
      loadBrands();
    } catch (error: any) {
      console.error("Failed to toggle brand status:", error);
      toast.error((error as Error).message || t("Status o'zgartirishda xatolik", "Ошибка при изменении статуса"));
    }
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;

    try {
      await brandsAPI.delete(deletingBrand.id);
      toast.success(t("Brend muvaffaqiyatli o'chirildi", "Бренд успешно удален"));
      setDeletingBrand(null);
      loadBrands();
    } catch (error: any) {
      console.error("Failed to delete brand:", error);
      toast.error((error as Error).message || t("Brend o'chirishda xatolik", "Ошибка при удалении бренда"));
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.nameUz.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.nameRu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {t("Brendlar", "Бренды")}
          </h2>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {t("Brendlar", "Бренды")}
          </h2>
          <Button
            onClick={() => {
              setEditingBrand(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("Qo'shish", "Добавить")}
          </Button>
        </div>
        <div>
          {/* Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("Brendlarni qidirish...", "Поиск брендов...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Brands Grid */}
          <div className="space-y-4">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {brand.image ? (
                      <Image
                        src={brand.image}
                        alt={brand.nameUz}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <ImageOff className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  {/* Brand Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-lg">{t(brand.nameUz, brand.nameRu)}</div>
                    <div className="text-sm text-muted-foreground">
                      {t("O'zb", "Узб")}: {brand.nameUz} | {t("Рус", "Рус")}: {brand.nameRu}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{t("Mahsulotlar", "Товары")}</div>
                      <Badge variant="secondary">
                        {brand.productCount || 0}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">{t("Tartib", "Порядок")}</div>
                      <Badge variant="outline">
                        {brand.order}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={brand.isActive}
                        onCheckedChange={() => handleToggleActive(brand)}
                        id={`switch-${brand.id}`}
                        className="cursor-pointer"
                      />
                      <Label
                        htmlFor={`switch-${brand.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {brand.isActive
                          ? t("Faol", "Активный")
                          : t("Nofaol", "Неактивный")}
                      </Label>
                    </div>
                    <div className="h-6 w-px bg-border" />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingBrand(brand);
                        setDialogOpen(true);
                      }}
                      disabled={!brand.isActive}
                      title={t("Tahrirlash", "Редактировать")}
                      className="cursor-pointer"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setDeletingBrand(brand)}
                      disabled={!brand.isActive}
                      title={t("O'chirish", "Удалить")}
                      className="cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm
                ? t("Hech qanday brend topilmadi", "Бренды не найдены")
                : t("Hozircha brendlar yo'q", "Пока нет брендов")
              }
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <BrandForm
            brand={editingBrand || undefined}
            onSubmit={editingBrand ? handleUpdate : handleCreate as any}
            onCancel={() => {
              setDialogOpen(false);
              setEditingBrand(null);
            }}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingBrand} onOpenChange={() => setDeletingBrand(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("Brendni o'chirish", "Удалить бренд")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Haqiqatan ham bu brendni o'chirmoqchimisiz? Bu amalni bekor qilib bo'lmaydi.",
                "Вы действительно хотите удалить этот бренд? Это действие нельзя отменить."
              )}
              {deletingBrand && (
                <div className="mt-2 p-2 bg-muted rounded">
                  <strong>{t(deletingBrand.nameUz, deletingBrand.nameRu)}</strong>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingBrand(null)}
            >
              {t("Bekor qilish", "Отмена")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              {t("O'chirish", "Удалить")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
