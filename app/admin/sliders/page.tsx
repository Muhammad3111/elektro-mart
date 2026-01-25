"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CrudModal } from "@/components/admin/shared/crud-modal";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { homeSlidersAPI, catalogBannersAPI } from "@/lib/api";
import type { HomeSlider, CatalogBanner } from "@/types/slider";
import { HomeSliderForm } from "@/components/admin/home-sliders/home-slider-form";
import { CatalogBannerForm } from "@/components/admin/catalog-banners/catalog-banner-form";
import { S3Image } from "@/components/s3-image";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function AdminSlidersPage() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("sliders");
    const [sliders, setSliders] = useState<HomeSlider[]>([]);
    const [banners, setBanners] = useState<CatalogBanner[]>([]);
    const [loading, setLoading] = useState(true);
    const [sliderDialogOpen, setSliderDialogOpen] = useState(false);
    const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<HomeSlider | null>(null);
    const [editingBanner, setEditingBanner] = useState<CatalogBanner | null>(
        null,
    );
    const [formLoading, setFormLoading] = useState(false);

    // Delete modals
    const [deleteSliderDialogOpen, setDeleteSliderDialogOpen] = useState(false);
    const [deleteBannerDialogOpen, setDeleteBannerDialogOpen] = useState(false);
    const [deletingSlider, setDeletingSlider] = useState<HomeSlider | null>(
        null,
    );
    const [deletingBanner, setDeletingBanner] = useState<CatalogBanner | null>(
        null,
    );
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [slidersData, bannersData] = await Promise.all([
                homeSlidersAPI.getAll(),
                catalogBannersAPI.getAll(),
            ]);
            setSliders(slidersData.sort((a, b) => a.order - b.order));
            setBanners(bannersData.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error("Failed to load data:", error);
            toast.error(
                t(
                    "Ma'lumotlarni yuklashda xatolik",
                    "Ошибка при загрузке данных",
                ),
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSlider = async (data: any) => {
        try {
            setFormLoading(true);
            await homeSlidersAPI.create(data);
            toast.success(t("Slider qo'shildi", "Слайдер добавлен"));
            setSliderDialogOpen(false);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateSlider = async (data: any) => {
        if (!editingSlider) return;
        try {
            setFormLoading(true);
            await homeSlidersAPI.update(editingSlider.id, data);
            toast.success(t("Slider yangilandi", "Слайдер обновлен"));
            setSliderDialogOpen(false);
            setEditingSlider(null);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleSlider = async (slider: HomeSlider) => {
        try {
            await homeSlidersAPI.update(slider.id, {
                isActive: !slider.isActive,
            });
            toast.success(t("Status o'zgartirildi", "Статус изменен"));
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    const handleDeleteSliderClick = (slider: HomeSlider) => {
        setDeletingSlider(slider);
        setDeleteSliderDialogOpen(true);
    };

    const handleDeleteSliderConfirm = async () => {
        if (!deletingSlider) return;

        setDeleteLoading(true);
        try {
            const response = await homeSlidersAPI.delete(deletingSlider.id);
            const name = response?.deletedName || deletingSlider.titleRu;
            toast.success(
                t(`"${name}" slideri o'chirildi`, `Слайдер "${name}" удален`),
            );
            setDeleteSliderDialogOpen(false);
            setDeletingSlider(null);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCreateBanner = async (data: any) => {
        try {
            setFormLoading(true);
            await catalogBannersAPI.create(data);
            toast.success(t("Banner qo'shildi", "Баннер добавлен"));
            setBannerDialogOpen(false);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateBanner = async (data: any) => {
        if (!editingBanner) return;
        try {
            setFormLoading(true);
            await catalogBannersAPI.update(editingBanner.id, data);
            toast.success(t("Banner yangilandi", "Баннер обновлен"));
            setBannerDialogOpen(false);
            setEditingBanner(null);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleBanner = async (banner: CatalogBanner) => {
        try {
            await catalogBannersAPI.update(banner.id, {
                isActive: !banner.isActive,
            });
            toast.success(t("Status o'zgartirildi", "Статус изменен"));
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    const handleDeleteBannerClick = (banner: CatalogBanner) => {
        setDeletingBanner(banner);
        setDeleteBannerDialogOpen(true);
    };

    const handleDeleteBannerConfirm = async () => {
        if (!deletingBanner) return;

        setDeleteLoading(true);
        try {
            const response = await catalogBannersAPI.delete(deletingBanner.id);
            const name = response?.deletedName || deletingBanner.titleRu;
            toast.success(
                t(`"${name}" banneri o'chirildi`, `Баннер "${name}" удален`),
            );
            setDeleteBannerDialogOpen(false);
            setDeletingBanner(null);
            loadData();
        } catch (error) {
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Slider va Banner", "Слайдер и Баннер")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t(
                            "Slider va bannerlarni boshqarish",
                            "Управление слайдерами и баннерами",
                        )}
                    </p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                        <TabsTrigger value="sliders">
                            {t("Sliderlar", "Слайдеры")}
                        </TabsTrigger>
                        <TabsTrigger value="banners">
                            {t("Bannerlar", "Баннеры")}
                        </TabsTrigger>
                    </TabsList>

                    {/* Sliders Tab */}
                    <TabsContent value="sliders" className="space-y-6">
                        <div className="flex justify-end">
                            <Button
                                className="gap-2 h-11"
                                onClick={() => {
                                    setEditingSlider(null);
                                    setSliderDialogOpen(true);
                                }}
                            >
                                <Plus className="h-5 w-5" />
                                {t("Yangi slider", "Новый слайдер")}
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                {t("Yuklanmoqda...", "Загрузка...")}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sliders.map((slider) => (
                                    <Card key={slider.id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row gap-6">
                                                <div className="relative w-full lg:w-64 h-32 rounded-lg overflow-hidden bg-accent shrink-0">
                                                    <S3Image
                                                        src={slider.coverImage}
                                                        alt={slider.titleEn}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold">
                                                            {slider.titleEn}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {slider.titleRu}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm">
                                                            {slider.subtitleEn}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {slider.subtitleRu}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-muted-foreground">
                                                            {t(
                                                                "Havola:",
                                                                "Ссылка:",
                                                            )}
                                                        </span>
                                                        <code className="px-2 py-1 bg-accent rounded text-xs">
                                                            {slider.link}
                                                        </code>
                                                    </div>
                                                </div>
                                                <div className="flex lg:flex-col gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleToggleSlider(
                                                                slider,
                                                            )
                                                        }
                                                    >
                                                        {slider.isActive ? (
                                                            <Eye className="h-4 w-4" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() => {
                                                            setEditingSlider(
                                                                slider,
                                                            );
                                                            setSliderDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDeleteSliderClick(
                                                                slider,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Banners Tab */}
                    <TabsContent value="banners" className="space-y-6">
                        <div className="flex justify-end">
                            <Button
                                className="gap-2 h-11"
                                onClick={() => {
                                    setEditingBanner(null);
                                    setBannerDialogOpen(true);
                                }}
                            >
                                <Plus className="h-5 w-5" />
                                {t("Yangi banner", "Новый баннер")}
                            </Button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                {t("Yuklanmoqda...", "Загрузка...")}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {banners.map((banner) => (
                                    <Card key={banner.id}>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-accent">
                                                    <S3Image
                                                        src={banner.coverImage}
                                                        alt={banner.titleEn}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {banner.titleEn}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {banner.titleRu}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        {banner.isActive && (
                                                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded">
                                                                {t(
                                                                    "Faol",
                                                                    "Активный",
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 pt-4 border-t">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleToggleBanner(
                                                                banner,
                                                            )
                                                        }
                                                    >
                                                        {banner.isActive ? (
                                                            <Eye className="h-4 w-4" />
                                                        ) : (
                                                            <EyeOff className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 gap-2"
                                                        onClick={() => {
                                                            setEditingBanner(
                                                                banner,
                                                            );
                                                            setBannerDialogOpen(
                                                                true,
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        {t(
                                                            "Tahrirlash",
                                                            "Редактировать",
                                                        )}
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                        onClick={() =>
                                                            handleDeleteBannerClick(
                                                                banner,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Slider Dialog */}
                <CrudModal
                    open={sliderDialogOpen}
                    onOpenChange={setSliderDialogOpen}
                    titleEn={
                        editingSlider
                            ? "Sliderni tahrirlash"
                            : "Yangi slider qo'shish"
                    }
                    titleRu={
                        editingSlider
                            ? "Редактировать слайдер"
                            : "Добавить новый слайдер"
                    }
                    maxWidth="2xl"
                >
                    <HomeSliderForm
                        slider={editingSlider || undefined}
                        onSubmit={
                            editingSlider
                                ? handleUpdateSlider
                                : handleCreateSlider
                        }
                        onCancel={() => {
                            setSliderDialogOpen(false);
                            setEditingSlider(null);
                        }}
                        loading={formLoading}
                    />
                </CrudModal>

                {/* Banner Dialog */}
                <CrudModal
                    open={bannerDialogOpen}
                    onOpenChange={setBannerDialogOpen}
                    titleEn={
                        editingBanner
                            ? "Bannerni tahrirlash"
                            : "Yangi banner qo'shish"
                    }
                    titleRu={
                        editingBanner
                            ? "Редактировать баннер"
                            : "Добавить новый баннер"
                    }
                    maxWidth="2xl"
                >
                    <CatalogBannerForm
                        banner={editingBanner || undefined}
                        onSubmit={
                            editingBanner
                                ? handleUpdateBanner
                                : handleCreateBanner
                        }
                        onCancel={() => {
                            setBannerDialogOpen(false);
                            setEditingBanner(null);
                        }}
                        loading={formLoading}
                    />
                </CrudModal>

                {/* Delete Slider Confirmation Dialog */}
                <Dialog
                    open={deleteSliderDialogOpen}
                    onOpenChange={setDeleteSliderDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t("Sliderni o'chirish", "Удалить слайдер")}
                            </DialogTitle>
                            <DialogDescription>
                                {t(
                                    "Haqiqatan ham bu sliderni o'chirmoqchimisiz?",
                                    "Вы действительно хотите удалить этот слайдер?",
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteSliderDialogOpen(false)}
                                disabled={deleteLoading}
                            >
                                {t("Bekor qilish", "Отмена")}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteSliderConfirm}
                                disabled={deleteLoading}
                            >
                                {deleteLoading
                                    ? t("O'chirilmoqda...", "Удаление...")
                                    : t("O'chirish", "Удалить")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Delete Banner Confirmation Dialog */}
                <Dialog
                    open={deleteBannerDialogOpen}
                    onOpenChange={setDeleteBannerDialogOpen}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {t("Bannerni o'chirish", "Удалить баннер")}
                            </DialogTitle>
                            <DialogDescription>
                                {t(
                                    "Haqiqatan ham bu bannerni o'chirmoqchimisiz?",
                                    "Вы действительно хотите удалить этот баннер?",
                                )}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteBannerDialogOpen(false)}
                                disabled={deleteLoading}
                            >
                                {t("Bekor qilish", "Отмена")}
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDeleteBannerConfirm}
                                disabled={deleteLoading}
                            >
                                {deleteLoading
                                    ? t("O'chirilmoqda...", "Удаление...")
                                    : t("O'chirish", "Удалить")}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
