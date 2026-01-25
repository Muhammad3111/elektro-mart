"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdminGuard } from "./admin-guard";
import { useAuth } from "@/contexts/auth-context";
import {
    LayoutDashboard,
    Package,
    Users,
    FolderTree,
    Image,
    Sliders,
    Menu,
    X,
    LogOut,
    Home,
    Globe,
    Tag,
    ShoppingCart,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage, Language } from "@/contexts/language-context";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const { t, language, setLanguage } = useLanguage();
    const { logout, user } = useAuth();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        setLogoutDialogOpen(false);
        logout();
    };

    const menuItems = [
        {
            title: t("Dashboard", "Панель управления"),
            icon: LayoutDashboard,
            href: "/admin",
        },
        {
            title: t("Buyurtmalar", "Заказы"),
            icon: ShoppingCart,
            href: "/admin/orders",
        },
        {
            title: t("Mahsulotlar", "Товары"),
            icon: Package,
            href: "/admin/products",
        },
        {
            title: t("Foydalanuvchilar", "Пользователи"),
            icon: Users,
            href: "/admin/users",
        },
        {
            title: t("Kategoriyalar", "Категории"),
            icon: FolderTree,
            href: "/admin/categories",
        },
        {
            title: t("Brendlar", "Бренды"),
            icon: Tag,
            href: "/admin/brands",
        },
        {
            title: t("Galereya", "Галерея"),
            icon: Image,
            href: "/admin/gallery",
        },
        {
            title: t("Slider/Banner", "Слайдер/Баннер"),
            icon: Sliders,
            href: "/admin/sliders",
        },
    ];

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin";
        }
        return pathname?.startsWith(href);
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-background">
                {/* Top Header */}
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center px-4 gap-4">
                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>

                        {/* Logo */}
                        <Link href="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    A
                                </span>
                            </div>
                            <span className="font-bold text-xl hidden sm:block">
                                Admin Panel
                            </span>
                        </Link>

                        <div className="flex-1" />

                        {/* Language Selector */}
                        <Select
                            value={language}
                            onValueChange={(val) =>
                                setLanguage(val as Language)
                            }
                        >
                            <SelectTrigger className="w-[100px]">
                                <Globe className="h-4 w-4 mr-2" />
                                <SelectValue
                                    placeholder={language.toUpperCase()}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                                <SelectItem value="ru">RU</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Home - Front sahifasiga o'tish */}
                        <Link href="/">
                            <Button
                                variant="ghost"
                                size="icon"
                                title={t("Bosh sahifa", "Главная страница")}
                            >
                                <Home className="h-5 w-5" />
                            </Button>
                        </Link>

                        {/* Logout */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setLogoutDialogOpen(true)}
                            title={t("Chiqish", "Выход")}
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                <div className="flex">
                    {/* Sidebar */}
                    <aside
                        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 flex flex-col ${
                            sidebarOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                        }`}
                    >
                        <nav className="space-y-2 p-4 flex-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.href} href={item.href}>
                                        <Button
                                            variant={
                                                isActive(item.href)
                                                    ? "default"
                                                    : "ghost"
                                            }
                                            className="w-full justify-start gap-3 h-12"
                                            onClick={() =>
                                                setSidebarOpen(false)
                                            }
                                        >
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">
                                                {item.title}
                                            </span>
                                        </Button>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Profile Section */}
                        <div className="p-4 border-t">
                            <Link href="/admin/profile">
                                <Button
                                    variant={
                                        isActive("/admin/profile")
                                            ? "default"
                                            : "ghost"
                                    }
                                    className="w-full justify-start gap-3 h-14"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold shrink-0">
                                        {user?.firstName?.[0]?.toUpperCase() ||
                                            "A"}
                                        {user?.lastName?.[0]?.toUpperCase() ||
                                            "D"}
                                    </div>
                                    <div className="flex flex-col items-start overflow-hidden">
                                        <span className="font-medium text-sm truncate w-full">
                                            {user?.firstName || "Admin"}{" "}
                                            {user?.lastName || "User"}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate w-full">
                                            {user?.email || "admin@example.com"}
                                        </span>
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </aside>

                    {/* Overlay for mobile */}
                    {sidebarOpen && (
                        <div
                            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}

                    {/* Main Content */}
                    <main className="flex-1 p-6 lg:p-8">{children}</main>
                </div>
            </div>
            {/* Logout Confirmation Dialog */}
            <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t("Chiqishni tasdiqlash", "Подтверждение выхода")}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                "Haqiqatan ham tizimdan chiqmoqchimisiz?",
                                "Вы действительно хотите выйти из системы?",
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button
                            variant="outline"
                            onClick={() => setLogoutDialogOpen(false)}
                        >
                            {t("Yo'q", "Нет")}
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            {t("Ha, chiqish", "Да, выйти")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminGuard>
    );
}
