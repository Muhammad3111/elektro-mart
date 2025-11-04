"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useFavorites } from "@/contexts/favorites-context";
import { ProductCard } from "@/components/product-card";

export default function FavoritesPage() {
    const { t } = useLanguage();
    const { favorites, clearFavorites } = useFavorites();

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-10">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Heart className="h-8 w-8 text-red-500 fill-current" />
                                <h1 className="text-3xl md:text-4xl font-black">
                                    {t("Sevimlilar", "Избранное")}
                                </h1>
                            </div>
                            {favorites.length > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={clearFavorites}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full md:w-auto"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {t("Hammasini o'chirish", "Очистить все")}
                                </Button>
                            )}
                        </div>
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
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                                {favorites.map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        price={item.price}
                                        image={item.image}
                                        description={item.description}
                                    />
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
