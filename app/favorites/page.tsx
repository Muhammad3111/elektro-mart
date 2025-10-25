"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useCart } from "@/contexts/cart-context";

export default function FavoritesPage() {
    const { t } = useLanguage();
    const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
    const { addToCart } = useCart();

    const handleAddToCart = (item: any) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
        });
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <Heart className="h-8 w-8 text-red-500 fill-current" />
                            <h1 className="text-4xl font-black">
                                {t("Sevimlilar", "Избранное")}
                            </h1>
                        </div>
                        {favorites.length > 0 && (
                            <Button
                                variant="outline"
                                onClick={clearFavorites}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("Hammasini o'chirish", "Очистить все")}
                            </Button>
                        )}
                    </div>

                    {/* Empty State */}
                    {favorites.length === 0 ? (
                        <Card className="border-2 border-dashed py-0">
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <Heart className="h-20 w-20 text-muted-foreground mb-4" />
                                <h2 className="text-2xl font-bold mb-2">
                                    {t("Sevimlilar bo'sh", "Избранное пусто")}
                                </h2>
                                <p className="text-muted-foreground mb-6 text-center max-w-md">
                                    {t(
                                        "Siz hali hech qanday mahsulotni sevimlilarga qo'shmagansiz. Mahsulotlarni ko'rib chiqing va yoqtirganlaringizni saqlang!",
                                        "Вы еще не добавили товары в избранное. Просмотрите товары и сохраните понравившиеся!"
                                    )}
                                </p>
                                <Link href="/catalog">
                                    <Button size="lg" className="gap-2">
                                        <ShoppingBag className="h-5 w-5" />
                                        {t(
                                            "Katalogga o'tish",
                                            "Перейти в каталог"
                                        )}
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            {/* Products Count */}
                            <p className="text-muted-foreground mb-6">
                                {t(
                                    `Jami ${favorites.length} ta mahsulot`,
                                    `Всего ${favorites.length} товаров`
                                )}
                            </p>

                            {/* Products Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favorites.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 py-0"
                                    >
                                        <div className="relative aspect-square overflow-hidden">
                                            <Link href={`/products/${item.id}`}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </Link>
                                            {/* Remove Button */}
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute top-2 right-2 h-9 w-9 rounded-full bg-white hover:bg-red-500 hover:text-white"
                                                onClick={() =>
                                                    removeFromFavorites(item.id)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <CardContent className="p-4 space-y-3">
                                            <Link href={`/products/${item.id}`}>
                                                <h3 className="font-bold text-sm line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
                                                    {item.name}
                                                </h3>
                                            </Link>

                                            {item.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between">
                                                <span className="text-xl font-bold text-primary">
                                                    {item.price} UZS
                                                </span>
                                            </div>

                                            <Button
                                                className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
                                                onClick={() =>
                                                    handleAddToCart(item)
                                                }
                                            >
                                                <ShoppingBag className="h-4 w-4" />
                                                {t(
                                                    "Savatga qo'shish",
                                                    "Добавить в корзину"
                                                )}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Continue Shopping */}
                            <div className="mt-12 text-center">
                                <Link href="/catalog">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="gap-2"
                                    >
                                        <ShoppingBag className="h-5 w-5" />
                                        {t(
                                            "Xaridni davom ettirish",
                                            "Продолжить покупки"
                                        )}
                                    </Button>
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
