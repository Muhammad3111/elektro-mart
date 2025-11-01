"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Brand } from "@/types/brand";
import { brandsAPI } from "@/lib/api";
import { ImageOff } from "lucide-react";

interface BrandsSliderProps {
    brands?: Brand[];
}

export function BrandsSlider({ brands: propBrands }: BrandsSliderProps) {
    const { t } = useLanguage();
    const [brands, setBrands] = useState<Brand[]>(propBrands || []);
    const [loading, setLoading] = useState(!propBrands);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
            slidesToScroll: 1,
        },
        [Autoplay({ delay: 3500, stopOnInteraction: true })]
    );

    useEffect(() => {
        if (!propBrands) {
            loadBrands();
        }
    }, [propBrands]);

    const loadBrands = async () => {
        try {
            setLoading(true);
            const data = await brandsAPI.getAllActive();
            setBrands(data);
        } catch (error) {
            console.error("Failed to load brands:", error);
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-2">
                        <CardContent className="p-6 flex items-center justify-center h-24">
                            <div className="w-16 h-8 bg-muted animate-pulse rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (brands.length === 0) {
        return null;
    }

    // If 6 or less brands, show grid instead of slider
    if (brands.length <= 6) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {brands.map((brand) => (
                    <Link key={brand.id} href={`/brands/${brand.id}`}>
                        <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2">
                            <CardContent className="p-6 flex items-center justify-center h-24">
                                {brand.image ? (
                                    <div className="relative w-16 h-8">
                                        <Image
                                            src={brand.image}
                                            alt={t(brand.nameUz, brand.nameRu)}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-1">
                                        <ImageOff className="w-6 h-6 text-muted-foreground" />
                                        <p className="font-bold text-sm text-muted-foreground hover:text-primary transition-colors">
                                            {t(brand.nameUz, brand.nameRu)}
                                        </p>
                                    </div>
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
            {/* Slider */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {brands.map((brand) => (
                        <div
                            key={brand.id}
                            className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] md:flex-[0_0_calc(33.333%-16px)] lg:flex-[0_0_calc(16.666%-20px)]"
                        >
                            <Link href={`/brands/${brand.id}`}>
                                <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2">
                                    <CardContent className="p-6 flex items-center justify-center h-24">
                                        {brand.image ? (
                                            <div className="relative w-16 h-8">
                                                <Image
                                                    src={brand.image}
                                                    alt={t(brand.nameUz, brand.nameRu)}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1">
                                                <ImageOff className="w-6 h-6 text-muted-foreground" />
                                                <p className="font-bold text-sm text-muted-foreground hover:text-primary transition-colors">
                                                    {t(brand.nameUz, brand.nameRu)}
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-6">
                {brands.map((brand, index) => (
                    <button
                        key={brand.id}
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
