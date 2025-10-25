"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";

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
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 py-0">
            <div className="relative aspect-square overflow-hidden">
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

                {/* Quick Actions */}
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-9 w-9 rounded-full bg-white hover:bg-primary hover:text-white"
                        onClick={(e) => {
                            e.preventDefault();
                            if (isInFavorites) {
                                removeFromFavorites(id);
                            } else {
                                addToFavorites({ id, name, price, image, description });
                            }
                        }}
                    >
                        <Heart
                            className={`h-4 w-4 ${
                                isInFavorites ? "fill-current text-red-500" : ""
                            }`}
                        />
                    </Button>
                    <Link href={`/products/${id}`}>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="h-9 w-9 rounded-full bg-white hover:bg-primary hover:text-white"
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                {/* Product Image */}
                <Link href={`/products/${id}`}>
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                </Link>
            </div>

            <CardContent className="p-3 space-y-2">
                {/* Product Name */}
                <Link href={`/products/${id}`}>
                    <h3 className="font-bold text-xs md:text-sm line-clamp-1 hover:text-primary transition-colors">
                        {name}
                    </h3>
                </Link>

                {/* Description */}
                {description && (
                    <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-2 min-h-[28px] md:min-h-[32px]">
                        {description}
                    </p>
                )}

                {/* Price */}
                <div className="flex flex-col gap-0.5">
                    <span className="text-lg md:text-xl font-bold text-primary">
                        {price} UZS
                    </span>
                    {oldPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                            {oldPrice} UZS
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-2 group-hover:shadow-lg transition-shadow text-xs md:text-sm h-9 md:h-10"
                    onClick={handleAddToCart}
                >
                    <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    {t("Savatga qo'shish", "Добавить в корзину")}
                </Button>
            </CardContent>
        </Card>
    );
}
