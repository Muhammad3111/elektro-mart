"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { siteConfig } from "@/lib/config/site";

export function ContactInfo() {
    const { t } = useLanguage();

    const contactItems = [
        {
            icon: Phone,
            title: t("Phone", "Телефон"),
            value: siteConfig.contact.phone,
            href: `tel:${siteConfig.contact.phoneRaw}`,
        },
        {
            icon: Mail,
            title: t("Email", "Электронная почта"),
            value: siteConfig.contact.email,
            href: `mailto:${siteConfig.contact.email}`,
        },
        {
            icon: Clock,
            title: t("Working Hours", "Рабочее время"),
            value: t("07:00 to 00:00, no days off", "07:00 до 00:00, без выходных"),
            href: null,
        },
        {
            icon: MapPin,
            title: t("Address", "Адрес"),
            value: t(siteConfig.contact.address.en, siteConfig.contact.address.ru),
            href: null,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactItems.map((item, index) => {
                const Icon = item.icon;
                const content = (
                    <Card className="h-full text-center border-none shadow-none bg-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-center">
                                <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                                    <Icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" aria-hidden="true" />
                                </div>
                            </div>
                            <h3 className="font-bold text-lg group-hover:text-primary transition-colors duration-300">{item.title}</h3>
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
                        className="block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
                        aria-label={`${item.title}: ${item.value}`}
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
