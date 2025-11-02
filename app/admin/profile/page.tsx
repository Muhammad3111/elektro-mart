"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import {
    User,
    Mail,
    Lock,
    Loader2,
    Save,
    Eye,
    EyeOff,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function AdminProfilePage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Profile data
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Password change
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to load profile");
            }

            const data = await response.json();
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setEmail(data.email || "");
            setPhone(data.phone || "");
            
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error("Failed to load profile:", error);
            toast.error(t("Profil ma'lumotlarini yuklashda xatolik", "Ошибка загрузки профиля"));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email) {
            toast.error(t("Barcha maydonlarni to'ldiring", "Заполните все поля"));
            return;
        }

        setUpdateLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update profile");
            }

            const data = await response.json();
            
            // Update localStorage
            localStorage.setItem("user", JSON.stringify(data.user || data));
            
            toast.success(t("Profil yangilandi", "Профиль обновлен"));
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(t("Profilni yangilashda xatolik", "Ошибка обновления профиля"));
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error(t("Barcha maydonlarni to'ldiring", "Заполните все поля"));
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t("Yangi parollar mos kelmadi", "Новые пароли не совпадают"));
            return;
        }

        if (newPassword.length < 6) {
            toast.error(t("Parol kamida 6 ta belgidan iborat bo'lishi kerak", "Пароль должен содержать минимум 6 символов"));
            return;
        }

        setPasswordLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to change password");
            }

            toast.success(t("Parol o'zgartirildi", "Пароль изменен"));
            
            // Clear password fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error("Failed to change password:", error);
            const errorMessage = error instanceof Error ? error.message : t("Parolni o'zgartirishda xatolik", "Ошибка изменения пароля");
            toast.error(errorMessage);
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Profil", "Профиль")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t("Shaxsiy ma'lumotlarni boshqarish", "Управление личными данными")}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                {t("Shaxsiy ma'lumotlar", "Личные данные")}
                            </CardTitle>
                            <CardDescription>
                                {t("Ismingiz va kontakt ma'lumotlaringizni yangilang", "Обновите ваше имя и контактную информацию")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">
                                            {t("Ism", "Имя")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder={t("Ismingiz", "Ваше имя")}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">
                                            {t("Familiya", "Фамилия")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder={t("Familiyangiz", "Ваша фамилия")}
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        {t("Email", "Email")} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="admin@example.com"
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">
                                        {t("Telefon", "Телефон")}
                                    </Label>
                                    <Input
                                        id="phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+998 90 123 45 67"
                                        className="h-11"
                                    />
                                </div>

                                <Separator />

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    disabled={updateLoading}
                                >
                                    {updateLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("Saqlanmoqda...", "Сохранение...")}
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            {t("Saqlash", "Сохранить")}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Change Password */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                {t("Parolni o'zgartirish", "Изменить пароль")}
                            </CardTitle>
                            <CardDescription>
                                {t("Xavfsizlik uchun parolingizni yangilang", "Обновите пароль для безопасности")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword">
                                        {t("Joriy parol", "Текущий пароль")} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="currentPassword"
                                            type={showCurrentPassword ? "text" : "password"}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">
                                        {t("Yangi parol", "Новый пароль")} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">
                                        {t("Parolni tasdiqlang", "Подтвердите пароль")} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="h-11 pl-10 pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <Button
                                    type="submit"
                                    className="w-full h-11"
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("O'zgartirilmoqda...", "Изменение...")}
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="mr-2 h-4 w-4" />
                                            {t("Parolni o'zgartirish", "Изменить пароль")}
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
