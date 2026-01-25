"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from "react";

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
    const [language, setLanguage] = useState<Language>("ru");
    const [isHydrated, setIsHydrated] = useState(false);

    // Hydration tugagandan keyin localStorage dan o'qish
    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") as Language;
        if (
            savedLanguage &&
            (savedLanguage === "en" || savedLanguage === "ru")
        ) {
            setLanguage(savedLanguage);
        }
        setIsHydrated(true);
    }, []);

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
