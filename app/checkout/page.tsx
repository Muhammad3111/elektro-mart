"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Send, ShoppingBag, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { formatPrice } from "@/lib/utils/format-price";
import { ordersAPI } from "@/lib/api";
import { toast } from "sonner";
import { PhoneInput } from "@/components/ui/phone-input";

const TELEGRAM_BOT_TOKEN = "8238996096:AAHpUxRmtbXBQonihgcTuZ-l2g8cQwPhAD4";
const TELEGRAM_CHAT_ID = "266226148"; // Admin chat ID

export default function CheckoutPage() {
    const { t } = useLanguage();
    const { cartItems, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("+998");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill form if user is logged in
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            if (user.phone) {
                setPhone(user.phone);
            }
        }
    }, [user]);

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + parseFloat(item.price.replace(/,/g, "")) * item.quantity,
        0
    );
    const total = subtotal;


    const handleSubmitOrder = async () => {
        // Validation - email optional, phone required
        if (!firstName.trim() || !lastName.trim() || !phone.trim() || !address.trim() || !city.trim() || !region.trim()) {
            toast.error(
                t(
                    "Iltimos, barcha majburiy maydonlarni to'ldiring!",
                    "Пожалуйста, заполните все обязательные поля!"
                )
            );
            return;
        }
        
        // Phone validation
        if (phone.replace(/\D/g, "").length !== 12) {
            toast.error(
                t(
                    "To'liq telefon raqamini kiriting",
                    "Введите полный номер телефона"
                )
            );
            return;
        }

        if (cartItems.length === 0) {
            toast.error(
                t(
                    "Savatingiz bo'sh!",
                    "Ваша корзина пуста!"
                )
            );
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare order data for API
            const orderData = {
                firstName,
                lastName,
                email: email || "noemail@example.com",
                phone,
                address,
                city,
                region,
                paymentMethod: "cash" as const,
                notes: notes || undefined,
                items: cartItems.map(item => ({
                    productId: String(item.id),
                    quantity: item.quantity
                }))
            };

            // Send to server API
            const order = await ordersAPI.createOrder(orderData);

            // Send notification to Telegram
            const productList = cartItems
                .map(
                    (item, index) =>
                        `${index + 1}. ${item.name} - ${item.quantity} dona - ${
                            item.price
                        } UZS`
                )
                .join("\n");

            const message =
                `🛒 *Yangi Buyurtma!*\n\n` +
                `📋 *Buyurtma raqami:* ${order.orderNumber}\n` +
                `👤 *Mijoz:* ${firstName} ${lastName}\n` +
                `📱 *Telefon:* ${phone}\n` +
                `📧 *Email:* ${email || "Ko'rsatilmagan"}\n` +
                `📍 *Manzil:* ${address}, ${city}, ${region}\n\n` +
                `📦 *Mahsulotlar:*\n${productList}\n\n` +
                `💰 *Jami summa:* ${formatPrice(total)} UZS\n` +
                `📊 *Mahsulotlar soni:* ${cartItems.length} ta` +
                (notes ? `\n\n📝 *Izoh:* ${notes}` : "");

            // Send to Telegram (don't fail if this fails)
            try {
                await fetch(
                    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            chat_id: TELEGRAM_CHAT_ID,
                            text: message,
                            parse_mode: "Markdown",
                        }),
                    }
                );
            } catch (telegramError) {
                console.error("Failed to send Telegram notification:", telegramError);
            }

            toast.success(
                t(
                    "Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
                    "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время."
                )
            );
            
            // Clear cart after successful order
            clearCart();
            
            // Redirect to order confirmation or profile
            setTimeout(() => {
                if (isAuthenticated) {
                    router.push("/profile?tab=orders");
                } else {
                    router.push("/order-confirmation");
                }
            }, 1500);
        } catch (error) {
            console.error("Error creating order:", error);
            toast.error(
                t(
                    "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.",
                    "Произошла ошибка. Пожалуйста, попробуйте еще раз."
                )
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <SEO
                title="Buyurtmani rasmiylashtirish"
                description="Buyurtmangizni rasmiylashtiring. Tez yetkazib berish va xavfsiz to'lov. Sobirov Market - professional elektr mahsulotlari."
                canonical="/checkout"
                noindex={true}
            />
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Order Form */}
                    <div className="w-full lg:w-2/3">
                        <div className="mb-8">
                            <h1 className="text-4xl font-black mb-2">
                                {t(
                                    "Buyurtmani rasmiylashtirish",
                                    "Оформление заказа"
                                )}
                            </h1>
                            <p className="text-muted-foreground">
                                {t(
                                    "Ma'lumotlaringizni kiriting va biz siz bilan bog'lanamiz",
                                    "Введите ваши данные и мы свяжемся с вами"
                                )}
                            </p>
                        </div>

                        {/* Simple Order Form */}
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-bold mb-6">
                                    {t(
                                        "Aloqa ma'lumotlari",
                                        "Контактная информация"
                                    )}
                                </h2>

                                <div className="space-y-6">
                                    {/* Name Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName" className="text-base">
                                                {t("Ism", "Имя")} *
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder={t("Ismingiz", "Ваше имя")}
                                                className="h-12 mt-2"
                                                disabled={isAuthenticated}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName" className="text-base">
                                                {t("Familiya", "Фамилия")} *
                                            </Label>
                                            <Input
                                                id="lastName"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder={t("Familiyangiz", "Ваша фамилия")}
                                                className="h-12 mt-2"
                                                disabled={isAuthenticated}
                                            />
                                        </div>
                                    </div>

                                    {/* Contact Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="email" className="text-base">
                                                {t("Email", "Email")} <span className="text-muted-foreground text-sm">({t("ixtiyoriy", "необязательно")})</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="email@example.com"
                                                className="h-12 mt-2"
                                                disabled={isAuthenticated}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone" className="text-base">
                                                {t("Telefon raqam", "Номер телефона")} *
                                            </Label>
                                            <PhoneInput
                                                id="phone"
                                                value={phone}
                                                onChange={setPhone}
                                                className="h-12 mt-2"
                                                disabled={isAuthenticated && !!user?.phone}
                                            />
                                        </div>
                                    </div>

                                    {/* Address Fields */}
                                    <div>
                                        <Label htmlFor="address" className="text-base">
                                            {t("Manzil", "Адрес")} *
                                        </Label>
                                        <Input
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder={t("To'liq manzil", "Полный адрес")}
                                            className="h-12 mt-2"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city" className="text-base">
                                                {t("Shahar", "Город")} *
                                            </Label>
                                            <Input
                                                id="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder={t("Shahar", "Город")}
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="region" className="text-base">
                                                {t("Viloyat", "Регион")} *
                                            </Label>
                                            <Input
                                                id="region"
                                                value={region}
                                                onChange={(e) => setRegion(e.target.value)}
                                                placeholder={t("Viloyat", "Регион")}
                                                className="h-12 mt-2"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <Label htmlFor="notes" className="text-base">
                                            {t("Izoh (ixtiyoriy)", "Примечание (необязательно)")}
                                        </Label>
                                        <Textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder={t(
                                                "Qo'shimcha ma'lumotlar...",
                                                "Дополнительная информация..."
                                            )}
                                            className="mt-2 min-h-[100px]"
                                        />
                                    </div>

                                    <div className="bg-accent/50 p-4 rounded-lg">
                                        <p className="text-sm text-muted-foreground">
                                            {t(
                                                "Buyurtmangizni qabul qilganimizdan so'ng, tez orada siz bilan bog'lanib, yetkazib berish tafsilotlarini aniqlaymiz.",
                                                "После получения вашего заказа мы свяжемся с вами в ближайшее время для уточнения деталей доставки."
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <Button
                                        onClick={handleSubmitOrder}
                                        disabled={isSubmitting || cartItems.length === 0}
                                        className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-14 text-lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                {t("Yuborilmoqda...", "Отправка...")}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5" />
                                                {t("Buyurtma berish", "Оформить заказ")}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="w-full lg:w-1/3">
                        <Card className="sticky top-8">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                                    <ShoppingBag className="h-6 w-6 text-primary" />
                                    <h2 className="text-2xl font-bold">
                                        {t("Sizning buyurtmangiz", "Ваш заказ")}
                                    </h2>
                                </div>

                                {cartItems.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        {t("Savat bo'sh", "Корзина пуста")}
                                    </p>
                                ) : (
                                    <>
                                        <div className="space-y-4 mb-6">
                                            {cartItems.map((item, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-4"
                                                >
                                                    <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                                                        <ShoppingBag className="h-8 w-8 text-primary" />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-sm">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {t(
                                                                "Miqdor",
                                                                "Количество"
                                                            )}
                                                            : {item.quantity}
                                                        </p>
                                                    </div>
                                                    <p className="font-semibold">
                                                        {item.price} UZS
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <p className="text-muted-foreground">
                                                    {t(
                                                        "Mahsulotlar soni",
                                                        "Количество товаров"
                                                    )}
                                                </p>
                                                <p className="font-semibold">
                                                    {cartItems.length}{" "}
                                                    {t("ta", "шт")}
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-muted-foreground">
                                                    {t(
                                                        "Jami miqdor",
                                                        "Общее количество"
                                                    )}
                                                </p>
                                                <p className="font-semibold">
                                                    {cartItems.reduce(
                                                        (sum, item) =>
                                                            sum + item.quantity,
                                                        0
                                                    )}{" "}
                                                    {t("dona", "шт")}
                                                </p>
                                            </div>
                                        </div>

                                        <Separator className="my-6" />

                                        <div className="flex justify-between items-center font-bold text-xl">
                                            <p>{t("Jami summa", "Итого")}</p>
                                            <p className="text-primary">
                                                {formatPrice(total)} UZS
                                            </p>
                                        </div>

                                        <div className="mt-6 bg-primary/10 p-4 rounded-lg">
                                            <p className="text-sm text-center">
                                                {t(
                                                    "Yetkazib berish narxi telefon orqali aniqlanadi",
                                                    "Стоимость доставки уточняется по телефону"
                                                )}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
