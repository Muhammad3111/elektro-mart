"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
    name: string;
    logo?: string;
}

interface BrandsSliderProps {
    brands: Brand[];
}

export function BrandsSlider({ brands }: BrandsSliderProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: true,
        align: "start",
        slidesToScroll: 1,
        breakpoints: {
            "(min-width: 640px)": { slidesToScroll: 2 },
            "(min-width: 768px)": { slidesToScroll: 3 },
            "(min-width: 1024px)": { slidesToScroll: 4 },
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

    // If 6 or less brands, show grid instead of slider
    if (brands.length <= 6) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {brands.map((brand) => (
                    <Link key={brand.name} href={`/catalog?brand=${brand.name}`}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2">
                            <CardContent className="p-6 flex items-center justify-center h-24">
                                {brand.logo ? (
                                    <img
                                        src={brand.logo}
                                        alt={brand.name}
                                        className="max-h-12 max-w-full object-contain"
                                    />
                                ) : (
                                    <p className="font-bold text-lg text-muted-foreground hover:text-primary transition-colors">
                                        {brand.name}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    }

    // Show slider for more than 6 brands
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
                <div className="flex gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(16.666%-20px)]"
                        >
                            <Link href={`/catalog?brand=${brand.name}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2">
                                    <CardContent className="p-6 flex items-center justify-center h-24">
                                        {brand.logo ? (
                                            <img
                                                src={brand.logo}
                                                alt={brand.name}
                                                className="max-h-12 max-w-full object-contain"
                                            />
                                        ) : (
                                            <p className="font-bold text-lg text-muted-foreground hover:text-primary transition-colors">
                                                {brand.name}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
