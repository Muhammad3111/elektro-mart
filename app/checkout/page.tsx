"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Send, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { toast } from "sonner";

const TELEGRAM_BOT_TOKEN = "8238996096:AAHpUxRmtbXBQonihgcTuZ-l2g8cQwPhAD4";
const TELEGRAM_CHAT_ID = "266226148"; // Admin chat ID

export default function CheckoutPage() {
    const { t } = useLanguage();
    const { cartItems, clearCart } = useCart();
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate totals
    const subtotal = cartItems.reduce(
        (sum, item) =>
            sum + parseFloat(item.price.replace(/,/g, "")) * item.quantity,
        0
    );
    const total = subtotal;

    const formatPhoneForDisplay = (value: string) => {
        // Remove all non-digits
        const digits = value.replace(/\D/g, "");
        
        // Format as 99-999-99-99
        let formatted = "";
        if (digits.length > 0) formatted += digits.substring(0, 2);
        if (digits.length > 2) formatted += "-" + digits.substring(2, 5);
        if (digits.length > 5) formatted += "-" + digits.substring(5, 7);
        if (digits.length > 7) formatted += "-" + digits.substring(7, 9);
        
        return formatted;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const digits = value.replace(/\D/g, "");
        
        // Limit to 9 digits
        if (digits.length <= 9) {
            setPhone(digits);
        }
    };

    const getFullPhoneNumber = () => {
        return `+998${phone}`;
    };

    const sendToTelegram = async () => {
        if (!fullName.trim() || phone.length !== 9) {
            toast.error(
                t(
                    "Iltimos, barcha maydonlarni to'g'ri to'ldiring!",
                    "Пожалуйста, правильно заполните все поля!"
                )
            );
            return;
        }

        setIsSubmitting(true);

        // Format order message
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
            `👤 *Mijoz:* ${fullName}\n` +
            `📱 *Telefon:* ${getFullPhoneNumber()}\n\n` +
            `📦 *Mahsulotlar:*\n${productList}\n\n` +
            `💰 *Jami summa:* ${total.toLocaleString()} UZS\n` +
            `📊 *Mahsulotlar soni:* ${cartItems.length} ta`;

        try {
            const response = await fetch(
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

            if (response.ok) {
                toast.success(
                    t(
                        "Buyurtma muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
                        "Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время."
                    )
                );
                // Clear cart after successful order
                clearCart();
                setTimeout(() => {
                    router.push("/order-confirmation");
                }, 1500);
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending to Telegram:", error);
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
                description="Buyurtmangizni rasmiylashtiring. Tez yetkazib berish va xavfsiz to'lov. ElektroMart - professional elektr mahsulotlari."
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
                                    <div>
                                        <Label
                                            htmlFor="fullname"
                                            className="text-base"
                                        >
                                            {t(
                                                "Ism va Familiya",
                                                "Имя и Фамилия"
                                            )}
                                        </Label>
                                        <Input
                                            id="fullname"
                                            value={fullName}
                                            onChange={(e) =>
                                                setFullName(e.target.value)
                                            }
                                            placeholder={t(
                                                "Ismingiz va familiyangizni kiriting",
                                                "Введите ваше имя и фамилию"
                                            )}
                                            className="h-14 mt-2"
                                        />
                                    </div>

                                    <div>
                                        <Label
                                            htmlFor="phone"
                                            className="text-base"
                                        >
                                            {t(
                                                "Telefon raqam",
                                                "Номер телефона"
                                            )}
                                        </Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                                                +998
                                            </span>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                value={formatPhoneForDisplay(phone)}
                                                onChange={handlePhoneChange}
                                                placeholder="99-999-99-99"
                                                className="h-14 mt-2 pl-16"
                                                maxLength={12}
                                            />
                                        </div>
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
                                        onClick={sendToTelegram}
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-14 text-lg"
                                    >
                                        <Send className="h-5 w-5" />
                                        {isSubmitting
                                            ? t(
                                                  "Yuborilmoqda...",
                                                  "Отправка..."
                                              )
                                            : t(
                                                  "Ariza yuborish",
                                                  "Отправить заявку"
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
                                                {total.toLocaleString()} UZS
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
