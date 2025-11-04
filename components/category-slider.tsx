"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import { ImageOff } from "lucide-react";
import { S3Image } from "@/components/s3-image";

interface CategorySliderProps {
    categories: Category[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
    const { t } = useLanguage();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
            containScroll: "trimSnaps",
        },
        [Autoplay({ delay: 3500, stopOnInteraction: false })]
    );

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on("select", onSelect);
        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="relative">
            {/* Slider */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {categories.map((category) => {
                        return (
                        <div
                            key={category.id}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(33.333%-11px)] lg:flex-[0_0_calc(15.38%-13px)]"
                        >
                            <Link href={`/catalog?category=${category.id}`} className="cursor-pointer">
                                <div className="flex flex-col group">
                                    {/* Card with Full Image */}
                                    <Card className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary/50 py-0">
                                        <CardContent className="p-0 aspect-[4/3] relative">
                                            {category.image ? (
                                                <S3Image
                                                    src={category.image}
                                                    alt={category.nameUz}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                                                    <ImageOff className="w-16 h-16 text-muted-foreground" />
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Title Below Card */}
                                    <h3 className="font-bold text-sm md:text-base text-center mt-3 group-hover:text-primary transition-colors">
                                        {t(category.nameUz, category.nameRu)}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                        );
                    })}
                </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {categories.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => emblaApi?.scrollTo(index)}
                        className={`h-2 rounded-full transition-all ${
                            index === selectedIndex
                                ? "w-6 bg-primary"
                                : "w-2 bg-gray-300"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}
