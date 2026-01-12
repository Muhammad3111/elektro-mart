"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneInput } from "@/components/ui/phone-input";
import { useLanguage } from "@/contexts/language-context";
import { ordersAPI } from "@/lib/api";
import { toast } from "sonner";
import { formatPrice as formatPriceUtil } from "@/lib/utils/format-price";
import {
    Search,
    Trash2,
    Loader2,
    Package,
    Plus,
    Minus,
    ArrowLeft,
} from "lucide-react";

export default function CreateOrderPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("+998");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [paymentMethod] = useState<"cash" | "card" | "online">("cash");
    
    // Products
    const [products, setProducts] = useState<Array<{id: string; name: string; price: string; quantity: number}>>([]);
    const [productSearch, setProductSearch] = useState("");
    const [searchResults, setSearchResults] = useState<Array<{
        id: string;
        nameEn?: string;
        nameRu?: string;
        price: string;
    }>>([]);

    const formatPrice = (price: string | number) => {
        return formatPriceUtil(Number(price));
    };

    const handleProductSearch = async (query: string) => {
        setProductSearch(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}&limit=10`);
            const data = await response.json();
            console.log("Search response:", data);
            
            // API response format: { data: [...], meta: {...} }
            const results = data.data || data.products || (Array.isArray(data) ? data : []);
            console.log("Search results:", results);
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
        const existing = products.find(p => p.id === product.id);
        if (existing) {
            setProducts(products.map(p => 
                p.id === product.id ? {...p, quantity: p.quantity + 1} : p
            ));
        } else {
            setProducts([...products, {
                id: product.id,
                name: product.nameEn || product.nameRu || '',
                price: product.price,
                quantity: 1
            }]);
        }
        
        // Clear search
        setProductSearch('');
        setSearchResults([]);
    };

    const handleRemoveProduct = (productId: string) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const handleUpdateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setProducts(products.map(p => 
            p.id === productId ? {...p, quantity} : p
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        if (!firstName || !lastName || !phone || !address || !city || !region) {
            toast.error(t("Ism, familiya, telefon va manzilni kiriting", "Введите имя, фамилию, телефон и адрес"));
            return;
        }

        if (phone.replace(/\D/g, "").length !== 12) {
            toast.error(t("To'liq telefon raqamini kiriting", "Введите полный номер телефона"));
            return;
        }
        
        if (products.length === 0) {
            toast.error(t("Kamida bitta mahsulot qo'shing", "Добавьте хотя бы один товар"));
            return;
        }

        setLoading(true);
        try {
            await ordersAPI.createOrder({
                firstName,
                lastName,
                email: "noemail@example.com",
                phone,
                address,
                city,
                region,
                paymentMethod,
                items: products.map(p => ({
                    productId: p.id,
                    quantity: p.quantity
                }))
            });
            toast.success(t("Buyurtma yaratildi", "Заказ создан"));
            router.push("/admin/orders");
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error(t("Buyurtma yaratishda xatolik", "Ошибка создания заказа"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-4xl font-black">
                            {t("Yangi buyurtma", "Новый заказ")}
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            {t("Buyurtma ma'lumotlarini kiriting", "Введите данные заказа")}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Mijoz ma'lumotlari", "Данные клиента")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                    <Label htmlFor="phone">
                                        {t("Telefon", "Телефон")} <span className="text-red-500">*</span>
                                    </Label>
                                    <PhoneInput
                                        id="phone"
                                        value={phone}
                                        onChange={setPhone}
                                        className="h-11"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">
                                        {t("Manzil", "Адрес")} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder={t("To'liq manzil", "Полный адрес")}
                                        className="h-11"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">
                                            {t("Shahar", "Город")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder={t("Shahar", "Город")}
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region">
                                            {t("Viloyat", "Регион")} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="region"
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            placeholder={t("Viloyat", "Регион")}
                                            className="h-11"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>{t("Mahsulotlar", "Товары")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {/* Product Search */}
                                <div>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder={t("Mahsulot qidirish...", "Поиск товара...")}
                                            value={productSearch}
                                            onChange={(e) => handleProductSearch(e.target.value)}
                                            className="h-11 pl-10"
                                        />
                                    </div>
                                    
                                    {/* Search Results */}
                                    {productSearch.length >= 2 && (
                                        <div className="mt-2 border rounded-md">
                                            {searchResults.length > 0 ? (
                                                <div className="space-y-1 max-h-60 overflow-y-auto p-1">
                                                    {searchResults.map((product) => (
                                                        <div
                                                            key={product.id}
                                                            className="p-3 hover:bg-accent cursor-pointer rounded-md transition-colors"
                                                            onClick={() => handleAddProduct(product)}
                                                        >
                                                            <p className="font-medium">{product.nameEn || product.nameRu}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {formatPrice(product.price)} UZS
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-sm text-muted-foreground">
                                                    {t("Mahsulot topilmadi", "Товар не найден")}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Selected Products */}
                                {products.length > 0 && (
                                    <div className="space-y-2">
                                        {products.map((product) => (
                                            <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                                                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatPrice(product.price)} UZS
                                                    </p>
                                                </div>
                                                
                                                <div className="flex items-center border rounded-md">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-r-none"
                                                        onClick={() => {
                                                            if (product.quantity > 1) {
                                                                handleUpdateQuantity(product.id, product.quantity - 1);
                                                            }
                                                        }}
                                                        disabled={product.quantity <= 1}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                    <div className="w-12 h-9 flex items-center justify-center border-x text-sm font-medium">
                                                        {product.quantity}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 rounded-l-none"
                                                        onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleRemoveProduct(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Summary */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>{t("Xulosa", "Итого")}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t("Mahsulotlar soni", "Количество товаров")}:</span>
                                        <span className="font-medium">{products.length}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">{t("Jami miqdor", "Общее количество")}:</span>
                                        <span className="font-medium">{products.reduce((sum, p) => sum + p.quantity, 0)}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                                        <span>{t("Jami", "Итого")}:</span>
                                        <span className="text-primary">
                                            {formatPrice(products.reduce((sum, p) => sum + (Number(p.price) * p.quantity), 0))} UZS
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full h-11"
                                        disabled={loading || products.length === 0}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                {t("Yaratilmoqda...", "Создание...")}
                                            </>
                                        ) : (
                                            t("Buyurtma yaratish", "Создать заказ")
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full h-11"
                                        onClick={() => router.back()}
                                        disabled={loading}
                                    >
                                        {t("Bekor qilish", "Отмена")}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
