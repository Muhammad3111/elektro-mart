"use client";

import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils/format-price";

export default function OrderConfirmationPage() {
  const { t } = useLanguage();
  const { cartItems } = useCart();
  
  const total = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price.replace(/,/g, "")) * item.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title="Buyurtma tasdiqlandi"
        description="Buyurtmangiz muvaffaqiyatli qabul qilindi. Tez orada operatorlarimiz siz bilan bog'lanadi."
        canonical="/order-confirmation"
        noindex={true}
      />
      <Header />
      
      <div className="container mx-auto px-4 py-10 max-w-4xl flex-1">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-primary mb-4">
            {t("Buyurtma qabul qilindi!", "Заказ принят!")}
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            {t(
              "Tez orada operatorlarimiz siz bilan bog'lanadi",
              "В ближайшее время наши операторы свяжутся с вами"
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(
              "Buyurtmangiz tafsilotlari quyida ko'rsatilgan",
              "Детали вашего заказа указаны ниже"
            )}
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <ShoppingBag className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{t("Buyurtma tafsilotlari", "Детали заказа")}</h2>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {t("Mahsulotlar topilmadi", "Товары не найдены")}
              </p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-3 border-b last:border-0">
                      <div className="w-16 h-16 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {t("Miqdor", "Количество")}: {item.quantity} {t("dona", "шт")}
                        </p>
                      </div>
                      <p className="font-bold text-primary">{item.price} UZS</p>
                    </div>
                  ))}
                </div>
                
                <div className="bg-primary/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">{t("Jami summa", "Итого")}</span>
                    <span className="text-2xl font-black text-primary">{formatPrice(total)} UZS</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t(
                      "* Yetkazib berish narxi telefon orqali aniqlanadi",
                      "* Стоимость доставки уточняется по телефону"
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mb-8 bg-accent/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold mb-3">{t("Keyingi qadamlar", "Следующие шаги")}</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{t(
                  "Operatorimiz siz bilan 15-30 daqiqa ichida bog'lanadi",
                  "Наш оператор свяжется с вами в течение 15-30 минут"
                )}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{t(
                  "Yetkazib berish manzili va vaqtini aniqlaymiz",
                  "Уточним адрес и время доставки"
                )}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{t(
                  "Buyurtmangizni tez va xavfsiz yetkazib beramiz",
                  "Доставим ваш заказ быстро и безопасно"
                )}</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full bg-primary hover:bg-primary/90 text-white gap-2 h-12">
              <Home className="h-5 w-5" />
              {t("Bosh sahifaga qaytish", "Вернуться на главную")}
            </Button>
          </Link>
          <Link href="/catalog" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2 h-12">
              <ShoppingBag className="h-5 w-5" />
              {t("Xarid davom ettirish", "Продолжить покупки")}
            </Button>
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
