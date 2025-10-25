"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Edit, Trash2, User, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [searchQuery, setSearchQuery] = useState("");

    const users = [
        {
            id: 1,
            name: "Sardor Sobirov",
            email: "sobirovsardor138@gmail.com",
            phone: "+998 33 470 47 00",
            role: "admin",
            orders: 45,
            registered: "2024-01-15",
        },
        {
            id: 2,
            name: "Aziza Karimova",
            email: "aziza.k@example.com",
            phone: "+998 90 123 45 67",
            role: "user",
            orders: 12,
            registered: "2024-03-20",
        },
        {
            id: 3,
            name: "Bobur Aliyev",
            email: "bobur.a@example.com",
            phone: "+998 91 234 56 78",
            role: "user",
            orders: 8,
            registered: "2024-05-10",
        },
        {
            id: 4,
            name: "Dilnoza Rahimova",
            email: "dilnoza.r@example.com",
            phone: "+998 93 345 67 89",
            role: "user",
            orders: 23,
            registered: "2024-02-28",
        },
    ];

    const getRoleBadge = (role: string) => {
        if (role === "admin") {
            return (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                    {t("Admin", "Админ")}
                </span>
            );
        }
        return (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                {t("Foydalanuvchi", "Пользователь")}
            </span>
        );
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Foydalanuvchilar", "Пользователи")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha foydalanuvchilarni boshqarish",
                                "Управление всеми пользователями"
                            )}
                        </p>
                    </div>
                    <Button className="gap-2 h-11">
                        <Plus className="h-5 w-5" />
                        {t("Yangi foydalanuvchi", "Новый пользователь")}
                    </Button>
                </div>

                {/* Search */}
                <Card>
                    <CardContent className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder={t(
                                    "Foydalanuvchi qidirish...",
                                    "Поиск пользователя..."
                                )}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="border-b bg-accent/50">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Foydalanuvchi", "Пользователь")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Aloqa", "Контакты")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Rol", "Роль")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Buyurtmalar", "Заказы")}
                                        </th>
                                        <th className="text-left p-4 font-semibold">
                                            {t("Ro'yxatdan o'tgan", "Регистрация")}
                                        </th>
                                        <th className="text-right p-4 font-semibold">
                                            {t("Amallar", "Действия")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b hover:bg-accent/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <User className="h-6 w-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {user.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        {user.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {getRoleBadge(user.role)}
                                            </td>
                                            <td className="p-4">
                                                <span className="font-semibold text-primary">
                                                    {user.orders}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                {user.registered}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
