"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { S3Image } from "@/components/s3-image";
import { useLanguage } from "@/contexts/language-context";
import { homeSlidersAPI } from "@/lib/api";
import type { HomeSlider } from "@/types/slider";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSlider() {
    const { language } = useLanguage();
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
        return null;
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
                        <div className="h-full bg-gradient-to-r from-primary/50 to-primary/10">
                            <div className="container mx-auto px-4 sm:px-6 h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center h-full py-4 sm:py-8">
                                    {/* Left side - Text content */}
                                    <div className="space-y-3 sm:space-y-4 md:space-y-6 text-center md:text-left">
                                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-foreground">
                                            {language === "en"
                                                ? slider.titleUz
                                                : slider.titleRu}
                                        </h1>
                                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-foreground/80 max-w-lg mx-auto md:mx-0">
                                            {language === "en"
                                                ? slider.subtitleUz
                                                : slider.subtitleRu}
                                        </p>
                                        <Link
                                            href={slider.link}
                                            className="cursor-pointer"
                                        >
                                            <Button
                                                size="lg"
                                                className="bg-primary hover:bg-primary/90 text-white h-10 sm:h-12 md:h-14 px-6 sm:px-8 text-sm sm:text-base md:text-lg"
                                            >
                                                {language === "en"
                                                    ? "Ko'rish"
                                                    : "Смотреть"}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Right side - Product image */}
                                    <div className="flex items-center justify-center mt-4 md:mt-0">
                                        <div className="relative w-full max-w-[250px] sm:max-w-[300px] md:max-w-md aspect-square">
                                            <S3Image
                                                src={slider.coverImage}
                                                alt={
                                                    language === "en"
                                                        ? slider.titleUz
                                                        : slider.titleRu
                                                }
                                                fill
                                                className="object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dots indicator */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {sliders.map((_, index) => (
                    <button
                        key={index}
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
