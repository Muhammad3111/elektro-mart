"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Brand } from "@/types/brand";
import { brandsAPI } from "@/lib/api";
import { ImageOff } from "lucide-react";
import { S3Image } from "@/components/s3-image";

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
                    <Link key={brand.id} href={`/catalog?brand=${brand.id}`}>
                        <div className="flex flex-col group">
                            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 overflow-hidden py-0">
                                <CardContent className="p-0 aspect-[4/3] relative">
                                    {brand.image ? (
                                        <S3Image
                                            src={brand.image}
                                            alt={t(brand.nameUz, brand.nameRu)}
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
                            <h3 className="font-bold text-sm md:text-base text-center mt-3 group-hover:text-primary transition-colors">
                                {t(brand.nameUz, brand.nameRu)}
                            </h3>
                        </div>
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
                            <Link href={`/catalog?brand=${brand.id}`}>
                                <div className="flex flex-col group">
                                    <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 overflow-hidden py-0">
                                        <CardContent className="p-0 aspect-[4/3] relative">
                                            {brand.image ? (
                                                <S3Image
                                                    src={brand.image}
                                                    alt={t(brand.nameUz, brand.nameRu)}
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
                                    <h3 className="font-bold text-sm md:text-base text-center mt-3 group-hover:text-primary transition-colors">
                                        {t(brand.nameUz, brand.nameRu)}
                                    </h3>
                                </div>
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
