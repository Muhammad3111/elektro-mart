"use client";

import { useState, useEffect, Suspense } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    User,
    ShoppingBag,
    Phone,
    Mail,
    Edit,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    LogOut,
    Settings,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ordersAPI, usersAPI } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ProfileContent() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, logout, isAuthenticated, loading, refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || ""
    });

    // Update form data when user changes
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone || ""
            });
        }
    }, [user]);
    
    // Set active tab from URL parameter
    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab === "orders") {
            setActiveTab("orders");
        }
    }, [searchParams]);
    
    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/auth?redirect=/profile");
        }
    }, [isAuthenticated, loading, router]);
    
    // Load user orders
    useEffect(() => {
        if (user && activeTab === "orders") {
            loadOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, activeTab]);
    
    const loadOrders = async () => {
        setOrdersLoading(true);
        try {
            const data = await ordersAPI.getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
            toast.error(t("Error loading orders", "Ошибка загрузки заказов"));
        } finally {
            setOrdersLoading(false);
        }
    };
    
    const handleLogout = () => {
        logout();
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        
        if (!formData.firstName.trim() || !formData.lastName.trim()) {
            toast.error(t("Please fill in first and last name", "Заполните имя и фамилию"));
            return;
        }

        setUpdateLoading(true);
        try {
            await usersAPI.update(user.id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phone: formData.phone
            });
            // Refresh user data from server
            await refreshUser();
            toast.success(t("Profile updated", "Профиль обновлен"));
        } catch (error) {
            console.error("Failed to update profile:", error);
            toast.error(t("Error updating profile", "Ошибка обновления профиля"));
        } finally {
            setUpdateLoading(false);
        }
    };

    // Show loading state
    if (loading || !user) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">{t("Loading...", "Загрузка...")}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }


    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "processing":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "cancelled":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "pending":
                return <Clock className="h-5 w-5 text-blue-500" />;
            default:
                return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered":
                return t("Delivered", "Доставлено");
            case "processing":
                return t("Processing", "В обработке");
            case "cancelled":
                return t("Cancelled", "Отменено");
            case "pending":
                return t("Pending", "Ожидание");
            default:
                return status;
        }
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };
    
    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SEO
                title={t("Profile", "Профиль")}
                description={t("User profile and order history",
                    "Профиль пользователя и история заказов"
                )}
                canonical="/profile"
                noindex={true}
            />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-1/4">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <User className="h-12 w-12 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold">
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                    {user.role === "admin" && (
                                        <span className="mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                            {t("Administrator", "Администратор")}
                                        </span>
                                    )}
                                </div>

                                <Separator className="my-4" />

                                <nav className="space-y-2">
                                    <Button
                                        variant={
                                            activeTab === "profile"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="w-full justify-start gap-2"
                                        onClick={() => setActiveTab("profile")}
                                    >
                                        <User className="h-5 w-5" />
                                        {t("Profile", "Профиль")}
                                    </Button>
                                    <Button
                                        variant={
                                            activeTab === "orders"
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="w-full justify-start gap-2"
                                        onClick={() => setActiveTab("orders")}
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {t("Orders", "Заказы")}
                                    </Button>
                                    
                                    {user.role === "admin" && (
                                        <>
                                            <Separator className="my-2" />
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start gap-2 text-primary hover:text-primary hover:bg-primary/10"
                                                onClick={() => router.push("/admin")}
                                            >
                                                <Settings className="h-5 w-5" />
                                                {t("Admin Panel", "Админ Панель")}
                                            </Button>
                                        </>
                                    )}
                                    
                                    <Separator className="my-2" />
                                    
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        {t("Logout", "Выйти")}
                                    </Button>
                                </nav>
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === "profile" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t("Personal Information",
                                            "Личная информация"
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            {t("First and Last Name", "Имя и Фамилия")}
                                        </Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="firstName"
                                                    placeholder={t("First Name", "Имя")}
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                                    className="pl-10 h-12"
                                                />
                                            </div>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    id="lastName"
                                                    placeholder={t("Last Name", "Фамилия")}
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                                    className="pl-10 h-12"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">
                                            {t("Phone", "Телефон")}
                                        </Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                className="pl-10 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            {t("Email", "Email")}
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                defaultValue={user.email}
                                                className="pl-10 h-12"
                                                disabled
                                            />
                                        </div>
                                    </div>


                                    <Button 
                                        onClick={handleUpdateProfile}
                                        disabled={updateLoading}
                                        className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2"
                                    >
                                        {updateLoading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                {t("Saqlanmoqda...", "Сохранение...")}
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="h-5 w-5" />
                                                {t("Save Changes",
                                                    "Сохранить изменения"
                                                )}
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === "orders" && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t("Order History", "История заказов")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {ordersLoading ? (
                                        <div className="text-center py-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                                            <p className="text-muted-foreground">{t("Loading...", "Загрузка...")}</p>
                                        </div>
                                    ) : orders.length === 0 ? (
                                        <div className="text-center py-12">
                                            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                            <p className="text-xl text-muted-foreground">
                                                {t(
                                                    "Buyurtmalar topilmadi",
                                                    "Заказы не найдены"
                                                )}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <Card
                                                    key={order.id}
                                                    className="border-2"
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Package className="h-5 w-5 text-primary" />
                                                                    <span className="font-bold text-lg">
                                                                        {order.orderNumber}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                    <Clock className="h-4 w-4" />
                                                                    {formatDate(order.createdAt)}
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusIcon(
                                                                        order.status
                                                                    )}
                                                                    <span className="font-medium">
                                                                        {getStatusText(
                                                                            order.status
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="text-right space-y-2">
                                                                <div className="text-2xl font-bold text-primary">
                                                                    {formatPrice(order.totalAmount)} UZS
                                                                </div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {order.items.length}{" "}
                                                                    {t(
                                                                        "ta mahsulot",
                                                                        "товаров"
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => router.push(`/orders/${order.id}`)}
                                                                >
                                                                    {t("Details",
                                                                        "Подробнее"
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
