"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface Category {
    id: string;
    name: string;
    nameRu: string;
    slug: string;
    image: string;
}

interface CategorySliderProps {
    categories: Category[];
}

export function CategorySlider({ categories }: CategorySliderProps) {
    const { t } = useLanguage();
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        breakpoints: {
            "(min-width: 640px)": { slidesToScroll: 1 },
            "(min-width: 768px)": { slidesToScroll: 1 },
            "(min-width: 1024px)": { slidesToScroll: 1 },
        },
    });

    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;

        const handleSelect = () => {
            setPrevBtnEnabled(emblaApi.canScrollPrev());
            setNextBtnEnabled(emblaApi.canScrollNext());
        };

        emblaApi.on("select", handleSelect);
        emblaApi.on("reInit", handleSelect);

        // Initial check
        handleSelect();

        return () => {
            emblaApi.off("select", handleSelect);
            emblaApi.off("reInit", handleSelect);
        };
    }, [emblaApi]);

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur shadow-lg hover:bg-background disabled:opacity-50"
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
            >
                <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/95 backdrop-blur shadow-lg hover:bg-background disabled:opacity-50"
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
            >
                <ChevronRight className="h-5 w-5" />
            </Button>

            {/* Slider */}
            <div className="overflow-hidden px-12" ref={emblaRef}>
                <div className="flex gap-4">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(33.333%-11px)] lg:flex-[0_0_calc(16.666%-14px)]"
                        >
                            <Link href={`/categories/${category.slug}`} className="cursor-pointer">
                                <div className="flex flex-col items-center group">
                                    {/* Square Card with Image */}
                                    <Card className="w-full hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-primary/50 bg-primary/10 py-10">
                                        <CardContent className="p-0 h-full flex items-center justify-center">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={category.image}
                                                alt={category.name}
                                                className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </CardContent>
                                    </Card>

                                    {/* Title Below Card */}
                                    <h3 className="font-bold text-sm md:text-base text-center mt-3 group-hover:text-primary transition-colors">
                                        {t(category.name, category.nameRu)}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
