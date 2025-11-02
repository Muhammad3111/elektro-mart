"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, Info } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import { S3Image } from "@/components/s3-image";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const { t } = useLanguage();

  const parsePrice = (price: string) => {
    return parseFloat(price.replace(/,/g, ""));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0);
  const shipping = 20000;
  const tax = subtotal * 0.12;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Savat - Xarid qilish"
        description="Sizning xarid savatangiz. Buyurtmani rasmiylashtirish va tez yetkazib berish xizmati. Sobirov Market - professional elektr mahsulotlari."
        canonical="/cart"
        noindex={true}
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            {/* Desktop Header */}
            <div className="hidden md:flex justify-between items-baseline border-b pb-6 mb-6">
              <h1 className="text-4xl font-black">{t("Savatingiz", "Ваша корзина")}</h1>
              <Link href="/" className="text-sm font-medium text-primary hover:underline">
                {t("Xarid qilishda davom eting", "Продолжить покупки")}
              </Link>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden border-b pb-6 mb-6 space-y-4">
              <h1 className="text-3xl font-black">{t("Savatingiz", "Ваша корзина")}</h1>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  {t("Xarid qilishda davom eting", "Продолжить покупки")}
                </Button>
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-muted-foreground mb-4">{t("Savatingiz bo'sh", "Ваша корзина пуста")}</p>
                <Link href="/">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    {t("Xarid qilishni boshlash", "Начать покупки")}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      {/* Desktop Layout */}
                      <div className="hidden md:flex items-center gap-4">
                        <div className="relative w-24 h-24 rounded-lg flex-shrink-0 overflow-hidden bg-accent">
                          <S3Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-grow">
                          <p className="font-medium line-clamp-1">{item.name}</p>
                          {item.category && (
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          )}
                          {item.brand && (
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                          )}
                          <p className="text-sm font-medium mt-1">{item.price} UZS</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center h-8"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right w-32">
                          <p className="font-bold">{(parsePrice(item.price) * item.quantity).toLocaleString()} UZS</p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Mobile Layout */}
                      <div className="md:hidden space-y-3">
                        {/* Image and Title */}
                        <div className="flex gap-3">
                          <div className="relative w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden bg-accent">
                            <S3Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                            {item.category && (
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            )}
                            {item.brand && (
                              <p className="text-xs text-muted-foreground">{item.brand}</p>
                            )}
                          </div>
                        </div>

                        {/* Quantity, Price, Delete */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 text-center h-8 text-sm"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm">{(parsePrice(item.price) * item.quantity).toLocaleString()} UZS</p>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive h-8 w-8"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-10">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6">{t("Buyurtma xulosasi", "Итого по заказу")}</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between py-2">
                    <p className="text-sm text-muted-foreground">{t("Oraliq jami", "Промежуточный итог")}</p>
                    <p className="text-sm font-medium">{subtotal.toLocaleString()} UZS</p>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-muted-foreground">{t("Yetkazib berish", "Доставка")}</p>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{shipping.toLocaleString()} UZS</p>
                  </div>
                  
                  <div className="flex justify-between py-2">
                    <div className="flex items-center gap-1">
                      <p className="text-sm text-muted-foreground">{t("Soliq (12%)", "Налог (12%)")}</p>
                      <Info className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">{Math.round(tax).toLocaleString()} UZS</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex justify-between py-2">
                    <p className="text-lg font-bold">{t("Jami", "Итого")}</p>
                    <p className="text-lg font-bold">{Math.round(total).toLocaleString()} UZS</p>
                  </div>
                </div>

                <Link href="/checkout">
                  <Button className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-white">
                    {t("To'lovga o'tish", "Перейти к оплате")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
