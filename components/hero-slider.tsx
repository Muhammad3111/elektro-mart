"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const slides = [
    {
        id: 1,
        title: "Yuqori sifatli elektr kabellari",
        subtitle: "Professional loyihalar uchun ishonchli yechimlar",
        buttonText: "Xarid qilish",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
        bgColor: "from-primary/50 to-primary/10",
    },
    {
        id: 2,
        title: "Zamonaviy ulagichlar va aksessuarlar",
        subtitle: "Har qanday elektr ish uchun keng assortiment",
        buttonText: "Katalogni ko'rish",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=600&h=600&fit=crop",
        bgColor: "from-primary/50 to-primary/10",
    },
    {
        id: 3,
        title: "Professional asboblar va jihozlar",
        subtitle: "Ishingizni osonlashtiruvchi yuqori sifatli asboblar",
        buttonText: "Batafsil",
        buttonLink: "/products",
        image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&h=600&fit=crop",
        bgColor: "from-primary/50 to-primary/10",
    },
];

export function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 3500);
        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className="relative w-full overflow-hidden">
            <div className="relative h-[500px] md:h-[600px]">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                            index === currentSlide
                                ? "opacity-100 translate-x-0"
                                : index < currentSlide
                                ? "opacity-0 -translate-x-full"
                                : "opacity-0 translate-x-full"
                        }`}
                    >
                        <div
                            className={`h-full bg-linear-to-r ${slide.bgColor}`}
                        >
                            <div className="container mx-auto px-4 h-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
                                    {/* Left side - Text content */}
                                    <div className="space-y-6 text-center md:text-left">
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
                                            {slide.title}
                                        </h1>
                                        <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                                            {slide.subtitle}
                                        </p>
                                        <Link
                                            href={slide.buttonLink}
                                            className="cursor-pointer"
                                        >
                                            <Button
                                                size="lg"
                                                className="bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg"
                                            >
                                                {slide.buttonText}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Right side - Product image */}
                                    <div className="flex items-center justify-center">
                                        <div className="relative w-full max-w-md aspect-square">
                                            <div
                                                className="w-full h-full bg-cover bg-center rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                                                style={{
                                                    backgroundImage: `url(${slide.image})`,
                                                }}
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
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-3 rounded-full transition-all ${
                            index === currentSlide
                                ? "w-8 bg-primary"
                                : "w-3 bg-white/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
