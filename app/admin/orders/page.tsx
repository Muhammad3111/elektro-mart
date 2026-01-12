"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { ordersAPI } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { formatPrice as formatPriceUtil } from "@/lib/utils/format-price";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { useCallback } from "react";
import {
    Search,
    Eye,
    Trash2,
    Loader2,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    Plus,
    Minus,
} from "lucide-react";

export default function AdminOrdersPage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);

    // Create order form
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+998");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<
        "cash" | "card" | "online"
    >("cash");
    const [notes, setNotes] = useState("");

    // Products
    const [products, setProducts] = useState<
        Array<{ id: string; name: string; price: string; quantity: number }>
    >([]);
    const [productSearch, setProductSearch] = useState("");
    const [searchResults, setSearchResults] = useState<
        Array<{
            id: string;
            nameEn?: string;
            nameRu?: string;
            price: string;
        }>
    >([]);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await ordersAPI.getAllOrders();
            setOrders(data);
        } catch (error) {
            console.error("Failed to load orders:", error);
            toast.error(
                t("Buyurtmalarni yuklashda xatolik", "Ошибка загрузки заказов")
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdateLoading(true);
        try {
            await ordersAPI.updateOrderStatus(
                orderId,
                newStatus as
                    | "pending"
                    | "confirmed"
                    | "processing"
                    | "shipped"
                    | "delivered"
                    | "cancelled"
            );
            toast.success(t("Status yangilandi", "Статус обновлен"));
            loadOrders();
        } catch (error) {
            console.error("Failed to update order:", error);
            toast.error(
                t("Status yangilashda xatolik", "Ошибка обновления статуса")
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedOrder) return;

        setDeleteLoading(true);
        try {
            await ordersAPI.deleteOrder(selectedOrder.id);
            toast.success(t("Buyurtma o'chirildi", "Заказ удален"));
            setShowDeleteDialog(false);
            setSelectedOrder(null);
            loadOrders();
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error(
                t("Buyurtmani o'chirishda xatolik", "Ошибка удаления заказа")
            );
        } finally {
            setDeleteLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: "bg-blue-500/10 text-blue-500",
            confirmed: "bg-cyan-500/10 text-cyan-500",
            processing: "bg-yellow-500/10 text-yellow-500",
            shipped: "bg-purple-500/10 text-purple-500",
            delivered: "bg-green-500/10 text-green-500",
            cancelled: "bg-red-500/10 text-red-500",
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />;
            case "confirmed":
                return <CheckCircle className="h-4 w-4" />;
            case "processing":
                return <Package className="h-4 w-4" />;
            case "shipped":
                return <Package className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            case "cancelled":
                return <XCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "pending":
                return t("Kutilmoqda", "Ожидание");
            case "confirmed":
                return t("Tasdiqlandi", "Подтверждено");
            case "processing":
                return t("Jarayonda", "В обработке");
            case "shipped":
                return t("Yuborildi", "Отправлено");
            case "delivered":
                return t("Yetkazildi", "Доставлено");
            case "cancelled":
                return t("Bekor qilindi", "Отменено");
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatPrice = (price: string | number) => {
        return formatPriceUtil(price);
    };

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "cash":
                return t("Naqd", "Наличные");
            case "card":
                return t("Karta", "Карта");
            case "online":
                return t("Onlayn", "Онлайн");
            default:
                return method;
        }
    };

    const handleProductSearch = async (query: string) => {
        setProductSearch(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}&limit=10`
            );
            const data = await response.json();
            // API response format: { data: [...], meta: {...} }
            const results =
                data.data || data.products || (Array.isArray(data) ? data : []);
            setSearchResults(results);
        } catch (error) {
            console.error("Failed to search products:", error);
        }
    };

    const handleAddProduct = (product: {
        id: string;
        nameEn?: string;
        nameRu?: string;
        price: string;
    }) => {
        const existing = products.find((p) => p.id === product.id);
        if (existing) {
            setProducts(
                products.map((p) =>
                    p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
                )
            );
        } else {
            setProducts([
                ...products,
                {
                    id: product.id,
                    name: product.nameEn || product.nameRu || "",
                    price: product.price,
                    quantity: 1,
                },
            ]);
        }

        // Clear search
        setProductSearch("");
        setSearchResults([]);
    };

    const handleRemoveProduct = (productId: string) => {
        setProducts(products.filter((p) => p.id !== productId));
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setProducts(
            products.map((p) => (p.id === productId ? { ...p, quantity } : p))
        );
    };

    const handleCreateOrder = async () => {
        // Validation - faqat ism, phone va manzil majburiy
        if (!firstName || !lastName || !phone || !address || !city || !region) {
            toast.error(
                t(
                    "Ism, familiya, telefon va manzilni kiriting",
                    "Введите имя, фамилию, телефон и адрес"
                )
            );
            return;
        }

        if (phone.replace(/\D/g, "").length !== 12) {
            toast.error(
                t(
                    "To'liq telefon raqamini kiriting",
                    "Введите полный номер телефона"
                )
            );
            return;
        }

        if (products.length === 0) {
            toast.error(
                t(
                    "Kamida bitta mahsulot qo'shing",
                    "Добавьте хотя бы один товар"
                )
            );
            return;
        }

        setCreateLoading(true);
        try {
            await ordersAPI.createOrder({
                firstName,
                lastName,
                email: email || "noemail@example.com",
                phone,
                address,
                city,
                region,
                paymentMethod,
                notes: notes || undefined,
                items: products.map((p) => ({
                    productId: p.id,
                    quantity: p.quantity,
                })),
            });
            toast.success(t("Buyurtma yaratildi", "Заказ создан"));
            setShowCreateDialog(false);
            // Reset form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPhone("+998");
            setAddress("");
            setCity("");
            setRegion("");
            setPaymentMethod("cash");
            setNotes("");
            setProducts([]);
            loadOrders();
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error(
                t("Buyurtma yaratishda xatolik", "Ошибка создания заказа")
            );
        } finally {
            setCreateLoading(false);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.orderNumber
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            order.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.phone.includes(searchQuery);

        const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Buyurtmalar", "Заказы")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t(
                                "Barcha buyurtmalarni boshqarish",
                                "Управление всеми заказами"
                            )}
                        </p>
                    </div>
                    <Button
                        className="gap-2 h-11"
                        onClick={() => router.push("/admin/orders/create")}
                    >
                        <Plus className="h-5 w-5" />
                        {t("Yangi buyurtma", "Новый заказ")}
                    </Button>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder={t("Qidirish...", "Поиск...")}
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={statusFilter}
                                onValueChange={setStatusFilter}
                            >
                                <SelectTrigger className="w-full md:w-[200px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        {t("Barcha statuslar", "Все статусы")}
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        {t("Kutilmoqda", "Ожидание")}
                                    </SelectItem>
                                    <SelectItem value="confirmed">
                                        {t("Tasdiqlandi", "Подтверждено")}
                                    </SelectItem>
                                    <SelectItem value="processing">
                                        {t("Jarayonda", "В обработке")}
                                    </SelectItem>
                                    <SelectItem value="shipped">
                                        {t("Yuborildi", "Отправлено")}
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                        {t("Yetkazildi", "Доставлено")}
                                    </SelectItem>
                                    <SelectItem value="cancelled">
                                        {t("Bekor qilindi", "Отменено")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t("Buyurtmalar ro'yxati", "Список заказов")} (
                            {filteredOrders.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="text-center py-12">
                                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                                <p className="text-xl text-muted-foreground">
                                    {t(
                                        "Buyurtmalar topilmadi",
                                        "Заказы не найдены"
                                    )}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                {t("Raqam", "Номер")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Mijoz", "Клиент")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Telefon", "Телефон")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Summa", "Сумма")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Status", "Статус")}
                                            </TableHead>
                                            <TableHead>
                                                {t("Sana", "Дата")}
                                            </TableHead>
                                            <TableHead className="text-right">
                                                {t("Amallar", "Действия")}
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    {order.orderNumber}
                                                </TableCell>
                                                <TableCell>
                                                    {order.firstName}{" "}
                                                    {order.lastName}
                                                </TableCell>
                                                <TableCell>
                                                    {order.phone}
                                                </TableCell>
                                                <TableCell className="font-bold text-primary">
                                                    {formatPrice(
                                                        order.totalAmount
                                                    )}{" "}
                                                    UZS
                                                </TableCell>
                                                <TableCell>
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(
                                                            value
                                                        ) =>
                                                            handleStatusUpdate(
                                                                order.id,
                                                                value
                                                            )
                                                        }
                                                        disabled={updateLoading}
                                                    >
                                                        <SelectTrigger className="w-[150px]">
                                                            <div className="flex items-center gap-2">
                                                                {getStatusIcon(
                                                                    order.status
                                                                )}
                                                                <span>
                                                                    {getStatusText(
                                                                        order.status
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">
                                                                {t(
                                                                    "Kutilmoqda",
                                                                    "Ожидание"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="confirmed">
                                                                {t(
                                                                    "Tasdiqlandi",
                                                                    "Подтверждено"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="processing">
                                                                {t(
                                                                    "Jarayonda",
                                                                    "В обработке"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="shipped">
                                                                {t(
                                                                    "Yuborildi",
                                                                    "Отправлено"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="delivered">
                                                                {t(
                                                                    "Yetkazildi",
                                                                    "Доставлено"
                                                                )}
                                                            </SelectItem>
                                                            <SelectItem value="cancelled">
                                                                {t(
                                                                    "Bekor qilindi",
                                                                    "Отменено"
                                                                )}
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedOrder(
                                                                    order
                                                                );
                                                                setShowDetailsDialog(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => {
                                                                setSelectedOrder(
                                                                    order
                                                                );
                                                                setShowDeleteDialog(
                                                                    true
                                                                );
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Order Details Dialog */}
            <Dialog
                open={showDetailsDialog}
                onOpenChange={setShowDetailsDialog}
            >
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {t("Buyurtma tafsilotlari", "Детали заказа")}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedOrder?.orderNumber}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("Mijoz", "Клиент")}
                                    </p>
                                    <p className="font-medium">
                                        {selectedOrder.firstName}{" "}
                                        {selectedOrder.lastName}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("Telefon", "Телефон")}
                                    </p>
                                    <p className="font-medium">
                                        {selectedOrder.phone}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("Email", "Email")}
                                    </p>
                                    <p className="font-medium">
                                        {selectedOrder.email}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("Status", "Статус")}
                                    </p>
                                    <Badge
                                        className={getStatusBadge(
                                            selectedOrder.status
                                        )}
                                    >
                                        {getStatusText(selectedOrder.status)}
                                    </Badge>
                                </div>
                            </div>

                            {/* Delivery Info */}
                            <div>
                                <h3 className="font-semibold mb-2">
                                    {t("Yetkazib berish", "Доставка")}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Shahar", "Город")}
                                        </p>
                                        <p className="font-medium">
                                            {selectedOrder.city}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Viloyat", "Регион")}
                                        </p>
                                        <p className="font-medium">
                                            {selectedOrder.region}
                                        </p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm text-muted-foreground">
                                            {t("Manzil", "Адрес")}
                                        </p>
                                        <p className="font-medium">
                                            {selectedOrder.address}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-semibold mb-2">
                                    {t("To'lov", "Оплата")}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {t("Usul", "Метод")}
                                        </p>
                                        <p className="font-medium">
                                            {getPaymentMethodText(
                                                selectedOrder.paymentMethod
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">
                                            {t("To'landi", "Оплачено")}
                                        </p>
                                        <p className="font-medium">
                                            {selectedOrder.isPaid
                                                ? t("Ha", "Да")
                                                : t("Yo'q", "Нет")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold mb-2">
                                    {t("Mahsulotlar", "Товары")}
                                </h3>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex justify-between items-center p-3 border rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    {item.product?.nameEn ||
                                                        item.productId}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {t("Miqdor", "Количество")}:{" "}
                                                    {item.quantity} x{" "}
                                                    {formatPrice(item.price)}{" "}
                                                    UZS
                                                </p>
                                            </div>
                                            <p className="font-bold text-primary">
                                                {formatPrice(item.subtotal)} UZS
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-semibold">
                                        {t("Jami", "Итого")}:
                                    </p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatPrice(selectedOrder.totalAmount)}{" "}
                                        UZS
                                    </p>
                                </div>
                            </div>

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        {t("Izoh", "Примечание")}
                                    </p>
                                    <p className="font-medium">
                                        {selectedOrder.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Create Order Dialog */}
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {t(
                                "Yangi buyurtma yaratish",
                                "Создать новый заказ"
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                "Buyurtma ma'lumotlarini kiriting",
                                "Введите данные заказа"
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="create-firstName"
                                    className="text-sm font-medium"
                                >
                                    {t("Ism", "Имя")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-firstName"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    placeholder={t("Ismingiz", "Ваше имя")}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="create-lastName"
                                    className="text-sm font-medium"
                                >
                                    {t("Familiya", "Фамилия")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-lastName"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    placeholder={t(
                                        "Familiyangiz",
                                        "Ваша фамилия"
                                    )}
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="create-phone"
                                className="text-sm font-medium"
                            >
                                {t("Telefon", "Телефон")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <PhoneInput
                                id="create-phone"
                                value={phone}
                                onChange={setPhone}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="create-address"
                                className="text-sm font-medium"
                            >
                                {t("Manzil", "Адрес")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="create-address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder={t("To'liq manzil", "Полный адрес")}
                                className="h-11"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="create-city"
                                    className="text-sm font-medium"
                                >
                                    {t("Shahar", "Город")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-city"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder={t("Shahar", "Город")}
                                    className="h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="create-region"
                                    className="text-sm font-medium"
                                >
                                    {t("Viloyat", "Регион")}{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="create-region"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    placeholder={t("Viloyat", "Регион")}
                                    className="h-11"
                                />
                            </div>
                        </div>

                        {/* Products Section */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                {t("Mahsulotlar", "Товары")}{" "}
                                <span className="text-red-500">*</span>
                            </Label>

                            {/* Product Search Input */}
                            <div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t(
                                            "Mahsulot qidirish...",
                                            "Поиск товара..."
                                        )}
                                        value={productSearch}
                                        onChange={(e) =>
                                            handleProductSearch(e.target.value)
                                        }
                                        className="h-11 pl-10"
                                    />
                                </div>

                                {/* Search Results - Below Input */}
                                {productSearch.length >= 2 &&
                                    searchResults.length > 0 && (
                                        <div className="mt-2 space-y-1 max-h-60 overflow-y-auto border rounded-md p-1">
                                            {searchResults.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="p-3 hover:bg-accent cursor-pointer rounded-md transition-colors"
                                                    onClick={() =>
                                                        handleAddProduct(
                                                            product
                                                        )
                                                    }
                                                >
                                                    <p className="font-medium">
                                                        {product.nameEn ||
                                                            product.nameRu}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPrice(
                                                            product.price
                                                        )}{" "}
                                                        UZS
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>

                            {/* Selected Products - Cart Style */}
                            {products.length > 0 && (
                                <div className="space-y-2">
                                    {products.map((product) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                                        >
                                            {/* Product Image Placeholder */}
                                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatPrice(product.price)}{" "}
                                                    UZS
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center border rounded-md">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-r-none"
                                                    onClick={() => {
                                                        if (
                                                            product.quantity > 1
                                                        ) {
                                                            handleUpdateQuantity(
                                                                product.id,
                                                                product.quantity -
                                                                    1
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        product.quantity <= 1
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <div className="w-12 h-9 flex items-center justify-center border-x text-sm font-medium">
                                                    {product.quantity}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-l-none"
                                                    onClick={() =>
                                                        handleUpdateQuantity(
                                                            product.id,
                                                            product.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                onClick={() =>
                                                    handleRemoveProduct(
                                                        product.id
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCreateDialog(false)}
                            disabled={createLoading}
                        >
                            {t("Bekor qilish", "Отмена")}
                        </Button>
                        <Button
                            onClick={handleCreateOrder}
                            disabled={createLoading}
                        >
                            {createLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("Yaratilmoqda...", "Создание...")}
                                </>
                            ) : (
                                t("Yaratish", "Создать")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t("Buyurtmani o'chirish", "Удалить заказ")}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                "Haqiqatan ham bu buyurtmani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.",
                                "Вы действительно хотите удалить этот заказ? Это действие нельзя отменить."
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={deleteLoading}
                        >
                            {t("Bekor qilish", "Отмена")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                        >
                            {deleteLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("O'chirilmoqda...", "Удаление...")}
                                </>
                            ) : (
                                t("O'chirish", "Удалить")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
