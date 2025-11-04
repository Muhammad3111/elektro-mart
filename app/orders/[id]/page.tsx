"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { ordersAPI } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Mail,
    CreditCard,
    FileText,
    Loader2,
} from "lucide-react";
import { S3Image } from "@/components/s3-image";

export default function OrderDetailsPage() {
    const { t } = useLanguage();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push("/auth?redirect=/orders/" + orderId);
        }
    }, [isAuthenticated, authLoading, router, orderId]);

    useEffect(() => {
        if (isAuthenticated && orderId) {
            loadOrder();
        }
    }, [isAuthenticated, orderId]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const data = await ordersAPI.getOrderById(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Failed to load order:", error);
            toast.error(t("Buyurtmani yuklashda xatolik", "Ошибка загрузки заказа"));
            router.push("/profile?tab=orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            delivered: "bg-green-500/10 text-green-500 border-green-500/20",
            processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
            pending: "bg-blue-500/10 text-blue-500 border-blue-500/20",
            cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "delivered":
                return <CheckCircle className="h-5 w-5" />;
            case "processing":
                return <Clock className="h-5 w-5" />;
            case "cancelled":
                return <XCircle className="h-5 w-5" />;
            case "pending":
                return <Clock className="h-5 w-5" />;
            default:
                return <Package className="h-5 w-5" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered":
                return t("Yetkazildi", "Доставлено");
            case "processing":
                return t("Jarayonda", "В обработке");
            case "cancelled":
                return t("Bekor qilindi", "Отменено");
            case "pending":
                return t("Kutilmoqda", "Ожидание");
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uz-UZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: string) => {
        return new Intl.NumberFormat('uz-UZ').format(parseFloat(price));
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return t("Naqd pul", "Наличные");
            case "card":
                return t("Karta", "Карта");
            case "online":
                return t("Online", "Онлайн");
            default:
                return method;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">{t("Yuklanmoqda...", "Загрузка...")}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-xl text-muted-foreground">
                            {t("Buyurtma topilmadi", "Заказ не найден")}
                        </p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SEO
                title={`${t("Buyurtma", "Заказ")} #${order.orderNumber}`}
                description={t("Buyurtma tafsilotlari", "Детали заказа")}
                canonical={`/orders/${orderId}`}
                noindex={true}
            />
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/profile?tab=orders")}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t("Buyurtmalarga qaytish", "Вернуться к заказам")}
                </Button>

                {/* Order Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black mb-2">
                                {t("Buyurtma", "Заказ")} #{order.orderNumber}
                            </h1>
                            <p className="text-muted-foreground">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                        <Badge className={`${getStatusBadge(order.status)} border text-base px-4 py-2`}>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <span>{getStatusText(order.status)}</span>
                            </div>
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    {t("Mijoz ma'lumotlari", "Информация о клиенте")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            {t("Ism va Familiya", "Имя и Фамилия")}
                                        </p>
                                        <p className="font-medium">
                                            {order.firstName} {order.lastName}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {t("Telefon", "Телефон")}
                                            </p>
                                            <p className="font-medium">
                                                🇺🇿 {order.phone.startsWith('+998') ? order.phone : `+998${order.phone.replace(/^998/, '')}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {t("Email", "Email")}
                                            </p>
                                            <p className="font-medium">{order.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {t("Manzil", "Адрес")}
                                            </p>
                                            <p className="font-medium">
                                                {order.address}, {order.city}, {order.region}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    {t("Buyurtma mahsulotlari", "Товары заказа")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                            <div className="relative w-20 h-20 bg-accent rounded flex items-center justify-center shrink-0 overflow-hidden">
                                                {item.product?.coverImage ? (
                                                    <S3Image
                                                        src={item.product.coverImage}
                                                        alt={item.product.nameUz}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Package className="h-10 w-10 text-primary" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold mb-1">
                                                    {item.product?.nameUz || item.productId}
                                                </h3>
                                                <p className="text-sm text-muted-foreground mb-2">
                                                    {item.product?.shortDescriptionUz}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-muted-foreground">
                                                        {t("Miqdor", "Количество")}: {item.quantity}
                                                    </span>
                                                    <span className="text-muted-foreground">
                                                        {t("Narx", "Цена")}: {formatPrice(item.price)} UZS
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-primary">
                                                    {formatPrice(item.subtotal)} UZS
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes */}
                        {order.notes && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        {t("Izoh", "Примечание")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{order.notes}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="space-y-6">
                        {/* Payment Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    {t("To'lov ma'lumotlari", "Информация об оплате")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {t("To'lov usuli", "Способ оплаты")}
                                    </p>
                                    <p className="font-medium">
                                        {getPaymentMethodText(order.paymentMethod)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {t("To'lov holati", "Статус оплаты")}
                                    </p>
                                    <Badge variant={order.isPaid ? "default" : "secondary"}>
                                        {order.isPaid ? t("To'langan", "Оплачено") : t("To'lanmagan", "Не оплачено")}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t("Buyurtma xulosasi", "Итоги заказа")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t("Mahsulotlar soni", "Количество товаров")}
                                        </span>
                                        <span className="font-medium">
                                            {order.items.length} {t("ta", "шт")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {t("Jami miqdor", "Общее количество")}
                                        </span>
                                        <span className="font-medium">
                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} {t("dona", "шт")}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">
                                        {t("Jami summa", "Итого")}
                                    </span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(order.totalAmount)} UZS
                                    </span>
                                </div>

                                <div className="bg-accent/50 p-4 rounded-lg">
                                    <p className="text-sm text-muted-foreground text-center">
                                        {t(
                                            "Yetkazib berish narxi telefon orqali aniqlanadi",
                                            "Стоимость доставки уточняется по телефону"
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
