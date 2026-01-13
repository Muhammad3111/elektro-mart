"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { YandexMap } from "@/components/yandex-map";

export default function ContactPage() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: "",
        phone: "+998",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);

    const isFormValid =
        formData.firstName.trim() &&
        formData.phone.length >= 13 &&
        formData.subject.trim() &&
        formData.message.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error(t("Please fill in all fields", "Заполните все поля"));
            return;
        }

        setLoading(true);

        try {
            // Telegram bot API
            const TELEGRAM_BOT_TOKEN =
                process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || "";
            const TELEGRAM_CHAT_ID =
                process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || "";

            const message =
                `🆕 Yangi xabar / Новое сообщение\n\n` +
                `👤 Ism / Имя: ${formData.firstName}\n` +
                `📱 Telefon / Телефон: ${formData.phone}\n` +
                `📋 Mavzu / Тема: ${formData.subject}\n` +
                `💬 Xabar / Сообщение:\n${formData.message}`;

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
                        parse_mode: "HTML",
                    }),
                }
            );

            if (response.ok) {
                toast.success(
                    t(
                        "Message sent! We will contact you soon.",
                        "Сообщение отправлено! Мы свяжемся с вами в ближайшее время."
                    )
                );
                setFormData({
                    firstName: "",
                    phone: "+998",
                    subject: "",
                    message: "",
                });
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(
                t(
                    "An error occurred. Please try again.",
                    "Произошла ошибка. Пожалуйста, попробуйте снова."
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: MapPin,
            title: t("Address", "Адрес"),
            content: t(
                "Uzbekistan, Tashkent, Shaykhantakhur district, Takhtapul, Turakurgan street 12b, Landmark: Malika market",
                "Узбекистан, Ташкент, Шайхантахурский район, Тахтапуль, улица Туракурган 12б, Ориентир: рынок Малика"
            ),
        },
        {
            icon: Phone,
            title: t("Phone", "Телефон"),
            content: "+998 33 470 47 00",
        },
        {
            icon: Mail,
            title: t("Email", "Email"),
            content: "sobirovsardor138@gmail.com",
        },
        {
            icon: Clock,
            title: t("Working Hours", "Время работы"),
            content: t(
                "07:00 to 00:00, no days off",
                "07:00 до 00:00, без выходных"
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black">
                                {t("Contact Us", "Свяжитесь с нами")}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {t(
                                    "Have questions? We are ready to help!",
                                    "Есть вопросы? Мы готовы помочь!"
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="container mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                {t("Send Message", "Отправить сообщение")}
                            </h2>
                            <Card>
                                <CardContent className="p-6">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">
                                                {t("First Name", "Имя")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        firstName:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "Your Name",
                                                    "Ваше имя"
                                                )}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone">
                                                {t("Phone", "Телефон")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <PhoneInput
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(value) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="subject">
                                                {t("Subject", "Тема")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="subject"
                                                value={formData.subject}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        subject: e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "Message subject",
                                                    "Тема сообщения"
                                                )}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message">
                                                {t("Message", "Сообщение")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Textarea
                                                id="message"
                                                value={formData.message}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        message: e.target.value,
                                                    })
                                                }
                                                placeholder={t(
                                                    "Write your message...",
                                                    "Напишите ваше сообщение..."
                                                )}
                                                rows={6}
                                                required
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={!isFormValid || loading}
                                            className="w-full bg-primary hover:bg-primary/90 text-white h-12 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {t(
                                                        "Sending...",
                                                        "Отправка..."
                                                    )}
                                                </>
                                            ) : (
                                                t(
                                                    "Send Message",
                                                    "Отправить сообщение"
                                                )
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h2 className="text-3xl font-bold mb-6">
                                {t(
                                    "Contact Information",
                                    "Контактная информация"
                                )}
                            </h2>
                            <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {contactInfo.map((info) => {
                                    const Icon = info.icon;
                                    return (
                                        <Card
                                            key={info.title}
                                            className="text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                        >
                                            <CardContent className="p-6 space-y-3">
                                                <div className="flex justify-center">
                                                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                                        <Icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">
                                                    {info.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {info.content}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Yandex Map - Full Width in Container */}
                <section className="container mx-auto px-4 pb-16">
                    <YandexMap />
                </section>
            </main>

            <Footer />
        </div>
    );
}
