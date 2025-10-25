"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Star, StarHalf, CheckCircle, Minus, Plus, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ProductCard } from "@/components/product-card";
import useEmblaCarousel from "embla-carousel-react";

export default function ProductDetailPage() {
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("black");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "start" });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const product = {
    name: "RG6 Koaksial Kabel - 75 Ohm CATV, Sun'iy yo'ldosh va Keng polosali aloqa uchun",
    sku: "RG6-100FT-BLK",
    price: "45,000",
    rating: 4.5,
    reviews: 125,
    inStock: true,
    category: "Ma'lumot kabellari",
    brand: "Philips",
    description: "Yuqori samarali RG6 koaksial kabel sun'iy yo'ldosh antenalari, kabel televideniyesi (CATV) va yuqori tezlikdagi internet uchun ideal. Chidamli PVC qobiq va optimal signal sifati uchun 75 Ohm impedansga ega.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&h=800&fit=crop"
    ]
  };

  const relatedProducts = [
    {
      id: 10,
      name: "Kabel Qirqgich Professional",
      price: "25,000",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
      category: "Asboblar",
      brand: "Siemens"
    },
    {
      id: 11,
      name: "F-Ulagichlar (20 dona)",
      price: "18,000",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop",
      category: "Ulagichlar",
      brand: "Legrand"
    },
    {
      id: 12,
      name: "Crimping Asbob Professional",
      price: "55,000",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
      category: "Asboblar",
      brand: "Schneider",
      isNew: true
    },
    {
      id: 13,
      name: "Koaksial Devor Plitalari",
      price: "12,000",
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
      category: "Aksessuarlar",
      brand: "ABB"
    },
    {
      id: 14,
      name: "RG59 Koaksial Kabel",
      price: "38,000",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      category: "Ma'lumot kabellari",
      brand: "Philips"
    },
    {
      id: 15,
      name: "Kabel Tester Digital",
      price: "75,000",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&h=400&fit=crop",
      category: "Asboblar",
      brand: "Siemens",
      isNew: true
    },
    {
      id: 16,
      name: "BNC Ulagich Premium",
      price: "15,000",
      image: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=400&h=400&fit=crop",
      category: "Ulagichlar",
      brand: "Legrand"
    },
    {
      id: 17,
      name: "Koaksial Splitter 4-Way",
      price: "22,000",
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
      category: "Aksessuarlar",
      brand: "ABB"
    },
    {
      id: 18,
      name: "RG11 Koaksial Kabel",
      price: "52,000",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      category: "Ma'lumot kabellari",
      brand: "Osram"
    },
    {
      id: 19,
      name: "Kabel Organizer Set",
      price: "18,000",
      image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=400&fit=crop",
      category: "Aksessuarlar",
      brand: "Schneider"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <Link href="/" className="text-primary hover:underline">{t("Bosh sahifa", "Главная")}</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/catalog" className="text-primary hover:underline">{t("Katalog", "Каталог")}</Link>
          <span className="text-muted-foreground">/</span>
          <Link href="/catalog?category=Kabellar" className="text-primary hover:underline">{t("Kabellar", "Кабели")}</Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{t("RG6 Koaksial Kabel", "RG6 Коаксиальный кабель")}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div 
              className="aspect-square bg-cover bg-center rounded-xl border shadow-lg w-full"
              style={{ backgroundImage: `url(${product.images[selectedImage]})` }}
            />
            <div className="grid grid-cols-4 gap-2.5">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-cover bg-center rounded-lg border-2 transition-all ${
                    selectedImage === idx ? "border-primary" : "border-border"
                  }`}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black mb-2">{product.name}</h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>

            {/* Category and Brand Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {t("Kategoriya", "Категория")}: {product.category}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {t("Brend", "Бренд")}: {product.brand}
              </Badge>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-primary">
                {[...Array(4)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
                <StarHalf className="h-5 w-5 fill-current" />
              </div>
              <Link href="#reviews" className="text-sm text-primary hover:underline">
                ({product.reviews} Reviews)
              </Link>
            </div>

            <p className="text-3xl font-bold text-primary">{product.price} UZS</p>

            <p className="text-base leading-relaxed">{product.description}</p>

            {product.inStock && (
              <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>{t("Omborda bor - 24 soat ichida yetkaziladi", "В наличии - Доставка в течение 24 часов")}</span>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="length" className="mb-2 block">{t("Uzunlik:", "Длина:")} </Label>
                <Select defaultValue="100">
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50">50 ft</SelectItem>
                    <SelectItem value="100">100 ft</SelectItem>
                    <SelectItem value="250">250 ft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block">{t("Rang:", "Цвет:")}</Label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedColor("black")}
                    className={`w-8 h-8 rounded-full bg-black border-2 transition-all ${
                      selectedColor === "black" ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border hover:border-primary/50"
                    }`}
                  />
                  <button 
                    onClick={() => setSelectedColor("white")}
                    className={`w-8 h-8 rounded-full bg-white border-2 transition-all ${
                      selectedColor === "white" ? "border-primary ring-2 ring-primary ring-offset-2" : "border-border hover:border-primary/50"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border-0 focus-visible:ring-0"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Link href="/cart" className="flex-1">
                  <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    {t("Savatga qo'shish", "Добавить в корзину")}
                  </Button>
                </Link>
              </div>
              
              {/* Share Button */}
              <Button 
                variant="outline" 
                className="w-full h-12 gap-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: product.name,
                      text: product.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(t("Havola nusxalandi!", "Ссылка скопирована!"));
                  }
                }}
              >
                <Share2 className="h-5 w-5" />
                {t("Ulashish", "Поделиться")}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">{t("Tavsif", "Описание")}</TabsTrigger>
            <TabsTrigger value="specifications">{t("Xususiyatlari", "Характеристики")}</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-6">
            <h3 className="text-xl font-bold mb-2">{t("Mahsulot tavsifi", "Описание товара")}</h3>
            <p className="text-base leading-relaxed">
              {t("Bizning RG6 Koaksial Kabelimiz mukammallik uchun ishlab chiqilgan bo'lib, barcha yuqori chastotali ehtiyojlaringiz uchun ishonchli ulanishni ta'minlaydi. Uy kinoteatrini o'rnatyapsizmi, sun'iy yo'ldosh antennasini o'rnatyapsizmi yoki eng tez keng polosali ulanishga ega bo'lishni ta'minlayapsizmi, bu kabel signal yo'qotilishi va shovqinni minimallashtirish uchun mo'ljallangan. Qattiq mis bilan qoplangan po'lat o'tkazgich, ikki qavatli alyuminiy folga va to'qilgan himoya bilan birgalikda aniq va toza signalni kafolatlaydi. Ob-havoga chidamli PVX qobiq uni ichki va tashqi o'rnatish uchun mos qiladi, har qanday muhitda uzoq umr va ishlashni ta'minlaydi.", "Наш коаксиальный кабель RG6 разработан для обеспечения надежного соединения для всех ваших высокочастотных потребностей. Независимо от того, устанавливаете ли вы домашний кинотеатр, спутниковую антенну или обеспечиваете самое быстрое широкополосное подключение, этот кабель разработан для минимизации потерь сигнала и помех.")}
            </p>
          </TabsContent>
          <TabsContent value="specifications" className="py-6">
            <h3 className="text-xl font-bold mb-4">{t("Texnik xususiyatlari", "Технические характеристики")}</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t("Impedans:", "Импеданс:")} </span>
                <span>75 Ohm</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t("O'tkazgich:", "Проводник:")}</span>
                <span>{t("Mis bilan qoplangan po'lat", "Медь покрытая сталь")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t("Himoya:", "Экранирование:")}</span>
                <span>{t("Ikki qavatli alyuminiy folga va to'qima", "Двухслойная алюминиевая фольга и оплетка")}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">{t("Qobiq:", "Оболочка:")}</span>
                <span>{t("PVX, ob-havoga chidamli", "PVC, устойчивый к погоде")}</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products Slider */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{t("O'xshash mahsulotlar", "Похожие товары")}</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 md:gap-4">
              {relatedProducts.map((product) => (
                <div key={product.id} className="flex-[0_0_calc(100%/1.5-8px)] min-w-0 md:flex-[0_0_calc(100%/4.5-14px)]">
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    isNew={product.isNew}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
