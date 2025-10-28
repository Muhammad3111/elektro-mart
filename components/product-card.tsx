"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye, ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useState } from "react";

interface ProductCardProps {
    id: number;
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
    const [imageError, setImageError] = useState(false);

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
            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:shadow-primary/50 py-0 flex flex-col h-full border-0">
                <div className="relative aspect-square overflow-hidden shrink-0">
                    {/* Badges */}
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

                    {/* Quick Actions - Always Visible */}
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
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
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white/90 hover:bg-primary hover:text-white shadow-md"
                            onClick={(e) => {
                                e.preventDefault();
                                // View action without redirect
                            }}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Product Image */}
                    {!image || imageError ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="w-16 h-16 text-muted-foreground/50" />
                        </div>
                    ) : (
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImageError(true)}
                        />
                    )}
                </div>

                <CardContent className="p-3 flex flex-col justify-between flex-1 space-y-2">
                    <div className="space-y-2 flex-1">
                        {/* Product Name - 1 line */}
                        <h3 className="font-bold text-xs md:text-sm line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>

                        {/* Description - 3 lines */}
                        {description && (
                            <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-3">
                                {description}
                            </p>
                        )}

                        {/* Price - Old price on right */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-0.5 md:gap-2">
                            <span className="text-lg md:text-xl font-bold text-primary">
                                {price} UZS
                            </span>
                            {oldPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                    {oldPrice} UZS
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button - Always at bottom */}
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white gap-2 group-hover:shadow-lg transition-shadow text-xs md:text-sm h-9 md:h-10 mt-auto flex-shrink-0"
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        {t("Savatga qo'shish", "Добавить в корзину")}
                    </Button>
                </CardContent>
            </Card>
        </Link>
    );
}
