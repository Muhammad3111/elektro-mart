"use client";

import { useState, useCallback, useRef } from "react";
import { checkAPI } from "@/lib/api";

type CheckType =
    | "product.sku"
    | "product.slug"
    | "category.name"
    | "brand.name"
    | "user.email"
    | "user.phone"
    | "slider.title"
    | "banner.title";

interface UseCheckExistsOptions {
    type: CheckType;
    debounceMs?: number;
    minLength?: number;
}

interface UseCheckExistsReturn {
    checking: boolean;
    exists: boolean | null;
    error: string | null;
    check: (value: string) => void;
    reset: () => void;
}

// Error messages
const errorMessages = {
    "product.sku": {
        en: "This SKU already exists",
        ru: "Этот SKU уже существует",
    },
    "product.slug": {
        en: "This slug already exists",
        ru: "Этот slug уже существует",
    },
    "category.name": {
        en: "This category name already exists",
        ru: "Это название категории уже существует",
    },
    "brand.name": {
        en: "This brand name already exists",
        ru: "Это название бренда уже существует",
    },
    "user.email": {
        en: "This email is already registered",
        ru: "Этот email уже зарегистрирован",
    },
    "user.phone": {
        en: "This phone number is already registered",
        ru: "Этот номер телефона уже зарегистрирован",
    },
    "slider.title": {
        en: "This slider title already exists",
        ru: "Это название слайдера уже существует",
    },
    "banner.title": {
        en: "This banner title already exists",
        ru: "Это название баннера уже существует",
    },
};

export function useCheckExists(
    options: UseCheckExistsOptions,
): UseCheckExistsReturn {
    const { type, debounceMs = 500, minLength = 2 } = options;
    const [checking, setChecking] = useState(false);
    const [exists, setExists] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const getCheckFunction = useCallback((checkType: CheckType) => {
        const [entity, field] = checkType.split(".") as [
            keyof typeof checkAPI,
            string,
        ];
        const entityAPI = checkAPI[entity];
        if (entityAPI && typeof entityAPI === "object" && field in entityAPI) {
            return (
                entityAPI as Record<
                    string,
                    (value: string) => Promise<{ exists: boolean }>
                >
            )[field];
        }
        return null;
    }, []);

    const check = useCallback(
        (value: string) => {
            // Clear previous timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Abort previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Reset if value is too short
            if (!value || value.length < minLength) {
                setExists(null);
                setError(null);
                setChecking(false);
                return;
            }

            setChecking(true);

            // Debounce the check
            timeoutRef.current = setTimeout(async () => {
                try {
                    abortControllerRef.current = new AbortController();
                    const checkFn = getCheckFunction(type);

                    if (!checkFn) {
                        console.error(
                            `Check function not found for type: ${type}`,
                        );
                        setChecking(false);
                        return;
                    }

                    const result = await checkFn(value);

                    if (result.exists) {
                        setExists(true);
                        // Get error message based on current language (will be handled by component)
                        setError(JSON.stringify(errorMessages[type]));
                    } else {
                        setExists(false);
                        setError(null);
                    }
                } catch (err) {
                    // Ignore abort errors
                    if (err instanceof Error && err.name === "AbortError") {
                        return;
                    }
                    console.error("Check error:", err);
                    setExists(null);
                    setError(null);
                } finally {
                    setChecking(false);
                }
            }, debounceMs);
        },
        [type, debounceMs, minLength, getCheckFunction],
    );

    const reset = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        setChecking(false);
        setExists(null);
        setError(null);
    }, []);

    return { checking, exists, error, check, reset };
}

// Helper to parse error message based on language
export function getCheckErrorMessage(
    error: string | null,
    language: "en" | "ru",
): string | null {
    if (!error) return null;
    try {
        const messages = JSON.parse(error);
        return messages[language] || null;
    } catch {
        return error;
    }
}
