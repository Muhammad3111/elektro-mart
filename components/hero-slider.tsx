"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { S3Image } from "@/components/s3-image";
import { homeSlidersAPI } from "@/lib/api";
import type { HomeSlider } from "@/types/slider";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSlider() {
    const [sliders, setSliders] = useState<HomeSlider[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        loadSliders();
    }, []);

    const loadSliders = async () => {
        try {
            const data = await homeSlidersAPI.getActive();
            setSliders(data.sort((a, b) => a.order - b.order));
        } catch (error) {
            console.error("Failed to load sliders:", error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, [sliders.length]);

    useEffect(() => {
        const timer = setInterval(nextSlide, 3500);
        return () => clearInterval(timer);
    }, [nextSlide]);

    if (loading) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="relative h-[450px] sm:h-[500px] md:h-[600px] bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse">
                    <div className="container mx-auto px-4 sm:px-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center h-full py-4 sm:py-0">
                            <div className="space-y-6">
                                <Skeleton className="h-16 w-3/4" />
                                <Skeleton className="h-8 w-1/2" />
                                <Skeleton className="h-14 w-32" />
                            </div>
                            <div className="flex items-center justify-center">
                                <Skeleton className="w-full max-w-md aspect-square rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (sliders.length === 0) {
        return (
            <div className="relative w-full overflow-hidden">
                <div className="relative h-[450px] sm:h-[500px] md:h-[600px] bg-gradient-to-r from-primary/50 to-primary/10">
                    <div className="container mx-auto px-4 sm:px-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center h-full py-4 sm:py-0">
                            <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left">
                                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
                                    WWTS Lab Technology
                                </h1>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-lg mx-auto md:mx-0">
                                    Professional Laboratory Technologies
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative h-[450px] sm:h-[500px] md:h-[600px]">
                {sliders.map((slider, index) => (
                    <div
                        key={slider.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentSlide
                                ? "opacity-100 translate-x-0"
                                : index < currentSlide
                                  ? "opacity-0 -translate-x-full"
                                : "opacity-0 translate-x-full"
                        }`}
                    >
                        <Link
                            href={slider.link?.trim() || "/"}
                            aria-label={slider.titleEn || "Hero slide"}
                            className="absolute inset-0 block"
                        >
                            <S3Image
                                src={slider.coverImage}
                                alt={slider.titleEn || slider.titleRu}
                                fill
                                className="object-cover"
                                priority
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {sliders.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 sm:h-3 rounded-full transition-all ${
                            index === currentSlide
                                ? "w-6 sm:w-8 bg-primary"
                                : "w-2 sm:w-3 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
