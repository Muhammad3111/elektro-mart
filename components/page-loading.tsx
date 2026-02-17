"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

const MIN_VISIBLE_MS = 420;
const MAX_VISIBLE_MS = 10000;

export function PageLoading() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);
    const startedAtRef = useRef(0);
    const stopTimerRef = useRef<number | null>(null);

    const routeKey = useMemo(() => pathname, [pathname]);
    const previousRouteRef = useRef(routeKey);

    useEffect(() => {
        loadingRef.current = loading;
    }, [loading]);

    const clearStopTimer = useCallback(() => {
        if (stopTimerRef.current !== null) {
            window.clearTimeout(stopTimerRef.current);
            stopTimerRef.current = null;
        }
    }, []);

    const startLoading = useCallback(() => {
        if (loadingRef.current) return;
        clearStopTimer();
        startedAtRef.current = Date.now();
        setLoading(true);
    }, [clearStopTimer]);

    const stopLoading = useCallback(() => {
        if (!loadingRef.current) return;
        clearStopTimer();
        const elapsed = Date.now() - startedAtRef.current;
        const delay = Math.max(0, MIN_VISIBLE_MS - elapsed);
        stopTimerRef.current = window.setTimeout(() => {
            setLoading(false);
            stopTimerRef.current = null;
        }, delay);
    }, [clearStopTimer]);

    useEffect(() => {
        const handleDocumentClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;
            if (!(target instanceof Element)) return;

            const link = target.closest("a[href]");
            if (!(link instanceof HTMLAnchorElement)) return;

            const rawHref = link.getAttribute("href");
            if (!rawHref) return;
            if (rawHref.startsWith("#")) return;
            if (rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
                return;
            }
            if (link.target === "_blank" || link.hasAttribute("download")) {
                return;
            }

            const currentUrl = new URL(window.location.href);
            const nextUrl = new URL(link.href, currentUrl);

            if (nextUrl.origin !== currentUrl.origin) return;

            const currentPathWithQuery = `${currentUrl.pathname}${currentUrl.search}`;
            const nextPathWithQuery = `${nextUrl.pathname}${nextUrl.search}`;
            if (nextPathWithQuery === currentPathWithQuery) return;

            startLoading();
        };

        document.addEventListener("click", handleDocumentClick, true);
        return () => {
            document.removeEventListener("click", handleDocumentClick, true);
        };
    }, [startLoading]);

    useEffect(() => {
        if (previousRouteRef.current === routeKey) return;
        previousRouteRef.current = routeKey;
        stopLoading();
    }, [routeKey, stopLoading]);

    useEffect(() => {
        if (!loading) return;
        const safetyTimer = window.setTimeout(() => {
            setLoading(false);
        }, MAX_VISIBLE_MS);

        return () => window.clearTimeout(safetyTimer);
    }, [loading]);

    useEffect(() => {
        return () => clearStopTimer();
    }, [clearStopTimer]);

    if (!loading) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-[90] bg-background/45 backdrop-blur-[1px] cursor-progress"
                aria-hidden="true"
            />

            <div className="fixed top-0 left-0 right-0 z-[95] h-1 bg-primary/10 overflow-hidden">
                <div className="h-full w-1/3 bg-primary animate-[page-loader-bar_1s_ease-in-out_infinite]" />
            </div>

            <div className="fixed inset-0 z-[96] flex items-center justify-center pointer-events-none">
                <div
                    role="status"
                    aria-live="polite"
                    className="rounded-xl border border-primary/20 bg-background/95 px-4 py-3 shadow-xl"
                >
                    <div className="flex items-center gap-3">
                        <span className="h-5 w-5 rounded-full border-2 border-primary/25 border-t-primary animate-spin" />
                        <span className="text-sm font-medium text-foreground">
                            {t("Opening page...", "Открываем страницу...")}
                        </span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes page-loader-bar {
                    0% {
                        transform: translateX(-140%);
                    }
                    50% {
                        transform: translateX(35%);
                    }
                    100% {
                        transform: translateX(320%);
                    }
                }
            `}</style>
        </>
    );
}
