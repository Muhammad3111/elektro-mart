"use client";

import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { DashboardStatsComponent } from "@/components/admin/dashboard-stats";

export default function AdminDashboard() {
    const { t } = useLanguage();

    const recentOrders = [
        {
            id: "ORD-001",
            customer: "Sardor Sobirov",
            product: "HDMI Kabel",
            amount: "45,000",
            status: "delivered",
        },
        {
            id: "ORD-002",
            customer: "Aziza Karimova",
            product: "USB-C Kabel",
            amount: "32,000",
            status: "processing",
        },
        {
            id: "ORD-003",
            customer: "Bobur Aliyev",
            product: "Optik Kabel",
            amount: "89,000",
            status: "pending",
        },
        {
            id: "ORD-004",
            customer: "Dilnoza Rahimova",
            product: "Quvvat Kabeli",
            amount: "56,000",
            status: "delivered",
        },
    ];

    const topProducts = [
        { name: "HDMI Kabel 2m", sales: 234, revenue: "10,530,000" },
        { name: "USB-C Kabel", sales: 189, revenue: "6,048,000" },
        { name: "Optik Kabel", sales: 156, revenue: "13,884,000" },
        { name: "Quvvat Kabeli", sales: 142, revenue: "7,952,000" },
    ];

    const getStatusBadge = (status: string) => {
        const styles = {
            delivered: "bg-green-500/10 text-green-500",
            processing: "bg-yellow-500/10 text-yellow-500",
            pending: "bg-blue-500/10 text-blue-500",
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "delivered":
                return t("Yetkazildi", "Доставлено");
            case "processing":
                return t("Jarayonda", "В обработке");
            case "pending":
                return t("Kutilmoqda", "Ожидание");
            default:
                return status;
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div>
                    <h1 className="text-4xl font-black">
                        {t("Dashboard", "Панель управления")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t(
                            "Umumiy statistika va tezkor ma'lumotlar",
                            "Общая статистика и быстрая информация"
                        )}
                    </p>
                </div>

                {/* Stats Grid - Real API Data */}
                <DashboardStatsComponent />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("So'nggi buyurtmalar", "Последние заказы")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                                    >
                                        <div className="space-y-1">
                                            <p className="font-semibold">
                                                {order.id}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.customer}
                                            </p>
                                            <p className="text-sm">
                                                {order.product}
                                            </p>
                                        </div>
                                        <div className="text-right space-y-2">
                                            <p className="font-bold text-primary">
                                                {order.amount} UZS
                                            </p>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                                                    order.status
                                                )}`}
                                            >
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("Top mahsulotlar", "Топ товары")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div
                                        key={product.name}
                                        className="flex items-center gap-4 p-4 border rounded-lg"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {product.sales}{" "}
                                                {t("ta sotildi", "продано")}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-primary">
                                                {product.revenue}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                UZS
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
