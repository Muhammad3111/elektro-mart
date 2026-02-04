"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowUp, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { siteConfig } from "@/lib/config/site";

export function FloatingButtons() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleCall = () => {
        window.location.href = `tel:${siteConfig.contact.phoneRaw}`;
    };

    // Hide buttons in admin panel
    if (pathname?.startsWith("/admin")) {
        return null;
    }

    return (
        <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-3">
            {/* Call Button */}
            <Button
                onClick={handleCall}
                size="icon"
                className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
                aria-label={t("Qo'ng'iroq qilish", "Позвонить")}
            >
                <Phone className="h-6 w-6" />
            </Button>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <Button
                    onClick={scrollToTop}
                    size="icon"
                    className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-in slide-in-from-bottom"
                    aria-label={t("Yuqoriga ko'tarish", "Прокрутить вверх")}
                >
                    <ArrowUp className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}
