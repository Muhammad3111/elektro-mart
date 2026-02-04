"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Plus,
    Search,
    MoreHorizontal,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { blogsAPI } from "@/lib/api";
import { toast } from "sonner";
import type { Blog } from "@/types/blog";

export default function BlogsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        try {
            setLoading(true);
            const result = await blogsAPI.getAll({ limit: 100 });
            setBlogs(result.data);
        } catch (error) {
            console.error("Error loading blogs:", error);
            toast.error(t("Bloglarni yuklashda xatolik", "Ошибка при загрузке блогов"));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedBlog) return;

        try {
            await blogsAPI.delete(selectedBlog.id);
            toast.success(t("Blog o'chirildi", "Блог удален"));
            loadBlogs();
        } catch (error) {
            console.error("Error deleting blog:", error);
            toast.error(t("O'chirishda xatolik", "Ошибка при удалении"));
        } finally {
            setDeleteDialogOpen(false);
            setSelectedBlog(null);
        }
    };

    const handleToggleActive = async (blog: Blog) => {
        try {
            await blogsAPI.toggleActive(blog.id, !blog.isActive);
            toast.success(
                blog.isActive
                    ? t("Blog o'chirildi", "Блог деактивирован")
                    : t("Blog faollashtirildi", "Блог активирован")
            );
            loadBlogs();
        } catch (error) {
            console.error("Error toggling blog:", error);
            toast.error(t("Xatolik yuz berdi", "Произошла ошибка"));
        }
    };

    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.titleRu.toLowerCase().includes(search.toLowerCase()) ||
            blog.titleEn.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Bloglar", "Блоги")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Yangiliklar va maqolalarni boshqaring",
                                "Управление новостями и статьями"
                            )}
                        </p>
                    </div>
                    <Button onClick={() => router.push("/admin/blogs/new")}>
                        <Plus className="h-5 w-5 mr-2" />
                        {t("Yangi blog", "Новый блог")}
                    </Button>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t("Qidirish...", "Поиск...")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Table */}
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("Sarlavha", "Заголовок")}</TableHead>
                                <TableHead>{t("Sana", "Дата")}</TableHead>
                                <TableHead>{t("Ko'rishlar", "Просмотры")}</TableHead>
                                <TableHead>{t("Holat", "Статус")}</TableHead>
                                <TableHead className="w-[70px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        {t("Yuklanmoqda...", "Загрузка...")}
                                    </TableCell>
                                </TableRow>
                            ) : filteredBlogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8">
                                        {t("Bloglar topilmadi", "Блоги не найдены")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredBlogs.map((blog) => (
                                    <TableRow key={blog.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{blog.titleRu}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {blog.titleEn}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{blog.viewsCount}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={blog.isActive ? "default" : "secondary"}
                                            >
                                                {blog.isActive
                                                    ? t("Faol", "Активный")
                                                    : t("Nofaol", "Неактивный")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem
                                                        onClick={() =>
                                                            router.push(`/admin/blogs/${blog.id}`)
                                                        }
                                                    >
                                                        <Pencil className="h-4 w-4 mr-2" />
                                                        {t("Tahrirlash", "Редактировать")}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleActive(blog)}
                                                    >
                                                        {blog.isActive ? (
                                                            <>
                                                                <EyeOff className="h-4 w-4 mr-2" />
                                                                {t("O'chirish", "Деактивировать")}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                {t("Faollashtirish", "Активировать")}
                                                            </>
                                                        )}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => {
                                                            setSelectedBlog(blog);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        {t("O'chirish", "Удалить")}
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t("Blogni o'chirish", "Удалить блог")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                "Haqiqatan ham bu blogni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.",
                                "Вы действительно хотите удалить этот блог? Это действие нельзя отменить."
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t("Bekor qilish", "Отмена")}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            {t("O'chirish", "Удалить")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
