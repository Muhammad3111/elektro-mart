"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { S3Image } from "@/components/s3-image";
import { formatPrice } from "@/lib/utils/format-price";

interface ProductCardProps {
    id: number | string;
    name: string;
    price: string;
    oldPrice?: string;
    image: string;
    description?: string;
    rating?: number;
    isNew?: boolean;
    discount?: string;
}

export function ProductCard({
    id,
    name,
    price,
    oldPrice,
    image,
    description,
    rating,
    isNew = false,
    discount,
}: ProductCardProps) {
    const { t } = useLanguage();
    const { addToCart } = useCart();
    const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

    const isInFavorites = isFavorite(id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({
            id,
            name,
            price,
            image,
        });
    };

    return (
        <Link href={`/products/${id}`} className="cursor-pointer block">
            <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:shadow-primary/50 py-0 flex flex-col h-full border-0">
                <div className="relative aspect-square overflow-hidden shrink-0">
                    {/* Badges - Always Visible */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
                        {isNew && (
                            <Badge className="bg-primary text-white">
                                {t("Yangi", "Новый")}
                            </Badge>
                        )}
                        {discount && (
                            <Badge className="bg-red-500 text-white">
                                -{discount}
                            </Badge>
                        )}
                    </div>

                    {/* Favorite Icon - Only visible on hover */}
                    <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-primary hover:text-white shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                if (isInFavorites) {
                                    removeFromFavorites(id);
                                } else {
                                    addToFavorites({
                                        id,
                                        name,
                                        price,
                                        image,
                                        description,
                                    });
                                }
                            }}
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    isInFavorites
                                        ? "fill-current text-red-500"
                                        : ""
                                }`}
                            />
                        </Button>
                    </div>

                    {/* Quick View Text - Center on hover */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/95 px-6 py-3 rounded-lg shadow-lg">
                            <span className="text-sm font-semibold text-gray-800">
                                {t("Tez ko'rish", "Быстрый просмотр")}
                            </span>
                        </div>
                    </div>

                    {/* Product Image */}
                    {!image ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                    ) : (
                        <S3Image
                            src={image}
                            alt={name}
                            fill
                            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            fallback="/placeholder.png"
                        />
                    )}
                </div>

                <CardContent className="p-3 flex flex-col flex-1">
                    {/* Top section - grows to fill space */}
                    <div className="space-y-2 flex-1">
                        {/* Product Name - 1 line */}
                        <h3 className="font-bold text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        {/* Description - 3 lines with ellipsis */}
                        {description && (
                            <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-3">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* Bottom section - always at bottom */}
                    <div className="flex items-end justify-between gap-2 pt-2 mt-auto">
                        {/* Left side: Prices */}
                        <div className="flex flex-col gap-0.5">
                            {oldPrice && (
                                <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                                    {formatPrice(oldPrice)} UZS
                                </span>
                            )}
                            <span className="text-base md:text-lg font-bold text-primary break-words">
                                {formatPrice(price)} UZS
                            </span>
                        </div>

                        {/* Right side: Cart Icon Button */}
                        <Button
                            size="icon"
                            className="bg-primary hover:bg-primary/90 text-white shadow-md group-hover:shadow-lg transition-shadow h-9 w-9 md:h-10 md:w-10 flex-shrink-0"
                            onClick={handleAddToCart}
                        >
                            <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
