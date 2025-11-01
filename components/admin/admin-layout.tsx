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
    Settings,
    Globe,
    Tag,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
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

    const menuItems = [
        {
            title: t("Dashboard", "Панель управления"),
            icon: LayoutDashboard,
            href: "/admin",
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
                        onValueChange={(val) => setLanguage(val as "uz" | "ru")}
                    >
                        <SelectTrigger className="w-[100px]">
                            <Globe className="h-4 w-4 mr-2" />
                            <SelectValue placeholder={language.toUpperCase()} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="uz">UZ</SelectItem>
                            <SelectItem value="ru">RU</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Settings */}
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>

                    {/* Logout */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={logout}
                        title={t("Chiqish", "Выход")}
                    >
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }`}
                >
                    <nav className="space-y-2 p-4">
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
                                        onClick={() => setSidebarOpen(false)}
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
        </AdminGuard>
    );
}
