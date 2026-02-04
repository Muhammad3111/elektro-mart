"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";
import { usePathname } from "next/navigation";

export type Language = "en" | "ru";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (en: string, ru: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined,
);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isAdminPanel = pathname?.startsWith("/admin");

    // Admin panelda RU, frontend saytda EN default
    const getDefaultLanguage = (): Language => {
        if (typeof window !== "undefined") {
            const savedLanguage = localStorage.getItem("language") as Language;
            if (
                savedLanguage &&
                (savedLanguage === "en" || savedLanguage === "ru")
            ) {
                return savedLanguage;
            }
        }
        return isAdminPanel ? "ru" : "en";
    };

    const [language, setLanguage] = useState<Language>("en");
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration tugagandan keyin localStorage dan o'qish
    useEffect(() => {
        const defaultLang = getDefaultLanguage();
        setLanguage(defaultLang);
        setIsHydrated(true);
    }, [isAdminPanel]);

    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem("language", language);
            // Update html lang attribute
            document.documentElement.lang = language;
        }
    }, [language, isHydrated]);

    const t = (en: string, ru: string) => {
        return language === "en" ? en : ru;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return context;
}
