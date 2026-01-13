"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface YmapsAPI {
    ready: (callback: () => void) => void;
    Map: new (element: HTMLElement, options: object) => YmapsMap;
    Placemark: new (
        coords: number[],
        properties: object,
        options: object
    ) => YmapsPlacemark;
}

interface YmapsMap {
    geoObjects: {
        add: (placemark: YmapsPlacemark) => void;
    };
    destroy: () => void;
}

type YmapsPlacemark = object;

declare global {
    interface Window {
        ymaps: YmapsAPI;
    }
}

export function YandexMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<YmapsMap | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initMap = useCallback(() => {
        if (!mapRef.current || !window.ymaps || mapInstanceRef.current) return;

        try {
            const map = new window.ymaps.Map(mapRef.current, {
                center: [41.326418, 69.279737],
                zoom: 17,
                controls: ["zoomControl", "fullscreenControl"],
            });

            const placemark = new window.ymaps.Placemark(
                [41.326418, 69.279737],
                {
                    balloonContent:
                        "WWTS - г.Ташкент, Шайхонтохурский район, ул.Алишера Навои, дом 16А",
                    hintContent: "WWTS",
                },
                {
                    preset: "islands#redDotIcon",
                }
            );

            map.geoObjects.add(placemark);
            mapInstanceRef.current = map;
            setIsLoaded(true);
        } catch (err) {
            console.error("Map initialization error:", err);
            setError("Failed to initialize map");
        }
    }, []);

    useEffect(() => {
        const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAP_API_KEY;

        if (!apiKey) {
            setError("Yandex Map API key not configured");
            return;
        }

        // Check if script already loaded
        if (window.ymaps) {
            window.ymaps.ready(initMap);
            return;
        }

        // Load Yandex Maps script
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
            window.ymaps.ready(initMap);
        };
        script.onerror = () => {
            setError("Failed to load Yandex Maps");
        };
        document.head.appendChild(script);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.destroy();
                mapInstanceRef.current = null;
            }
        };
    }, [initMap]);

    if (error) {
        return (
            <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg bg-muted flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <p>{error}</p>
                    <p className="text-sm mt-2">
                        Please check your API key configuration
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg relative">
            {!isLoaded && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">
                        Loading map...
                    </div>
                </div>
            )}
            <div ref={mapRef} className="w-full h-full" />
        </div>
    );
}
