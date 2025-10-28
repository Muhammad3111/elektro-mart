"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function ContactInfo() {
    const { t } = useLanguage();

    const contactItems = [
        {
            icon: Phone,
            title: t("Telefon raqam", "Телефон"),
            value: "+998 90 123 45 67",
            href: "tel:+998901234567",
        },
        {
            icon: Mail,
            title: t("Elektron pochta", "Электронная почта"),
            value: "info@elektromart.uz",
            href: "mailto:info@elektromart.uz",
        },
        {
            icon: Clock,
            title: t("Ish vaqti", "Рабочее время"),
            value: t("9:00 dan 19:00 gacha, dam olishsiz", "9:00 до 19:00, без выходных"),
            href: null,
        },
        {
            icon: MapPin,
            title: t("Manzil", "Адрес"),
            value: t("Toshkent sh., Chilonzor tumani", "г. Ташкент, Чиланзарский район"),
            href: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactItems.map((item, index) => {
                const Icon = item.icon;
                const content = (
                    <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                        <CardContent className="p-6 text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-sm text-muted-foreground wrap-break-word">
                                {item.value}
                            </p>
                        </CardContent>
                    </Card>
                );

                return item.href ? (
                    <a
                        key={index}
                        href={item.href}
                        className="block hover:scale-105 transition-transform"
                    >
                        {content}
                    </a>
                ) : (
                    <div key={index}>{content}</div>
                );
            })}
        </div>
    );
}
