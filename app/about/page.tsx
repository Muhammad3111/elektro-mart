"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AboutPage() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: CheckCircle,
      title: t("Yuqori sifat", "Высокое качество"),
      description: t("Faqat sertifikatlangan va tekshirilgan mahsulotlar", "Только сертифицированные и проверенные товары")
    },
    {
      icon: Users,
      title: t("Professional jamoa", "Профессиональная команда"),
      description: t("Tajribali mutaxassislar sizga yordam beradi", "Опытные специалисты помогут вам")
    },
    {
      icon: Award,
      title: t("Ishonchli brendlar", "Надежные бренды"),
      description: t("Dunyo bo'ylab taniqli ishlab chiqaruvchilar", "Всемирно известные производители")
    },
    {
      icon: TrendingUp,
      title: t("Tez yetkazib berish", "Быстрая доставка"),
      description: t("O'z vaqtida va xavfsiz yetkazib berish", "Своевременная и безопасная доставка")
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Biz haqimizda"
        description="Sobirov Market - O'zbekistonda professional elektr mahsulotlari yetkazib beruvchi. Siemens, Schneider, ABB, Legrand brendlari. Yuqori sifat, ishonchli xizmat va professional jamoa."
        keywords="sobirov market haqida, elektr mahsulotlari kompaniya, professional elektr, Toshkent elektr do'kon"
        canonical="/about"
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-black">{t("Biz haqimizda", "О нас")}</h1>
              <p className="text-lg text-muted-foreground">
                {t(
                  "ElectraWire - elektr kabel va aksessuarlar bo'yicha yetakchi ta'minotchi",
                  "ElectraWire - ведущий поставщик электрических кабелей и аксессуаров"
                )}
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6">{t("Bizning missiyamiz", "Наша миссия")}</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  {t(
                    "ElectraWire 2010-yilda tashkil etilgan bo'lib, O'zbekiston bozorida elektr kabel va aksessuarlar sohasida yetakchi o'rinni egallaydi.",
                    "ElectraWire была основана в 2010 году и занимает ведущее положение на рынке Узбекистана в области электрических кабелей и аксессуаров."
                  )}
                </p>
                <p>
                  {t(
                    "Biz mijozlarimizga yuqori sifatli mahsulotlar, professional xizmat va raqobatbardosh narxlarni taklif etamiz. Bizning maqsadimiz - har bir loyihangizni muvaffaqiyatli amalga oshirishga yordam berish.",
                    "Мы предлагаем нашим клиентам высококачественные товары, профессиональное обслуживание и конкурентные цены. Наша цель - помочь успешно реализовать каждый ваш проект."
                  )}
                </p>
                <p>
                  {t(
                    "Kompaniyamiz xalqaro standartlarga mos keladigan mahsulotlarni ta'minlaydi va doimiy ravishda assortimentini kengaytiradi.",
                    "Наша компания поставляет продукцию, соответствующую международным стандартам, и постоянно расширяет ассортимент."
                  )}
                </p>
              </div>
            </div>
            <div className="bg-primary/10 rounded-2xl h-96" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-center">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-black text-primary mb-2">10+</div>
                <div className="text-muted-foreground">{t("Yillik tajriba", "Лет опыта")}</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">5000+</div>
                <div className="text-muted-foreground">{t("Mahsulotlar", "Товаров")}</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">10000+</div>
                <div className="text-muted-foreground">{t("Mijozlar", "Клиентов")}</div>
              </div>
              <div>
                <div className="text-4xl font-black text-primary mb-2">50+</div>
                <div className="text-muted-foreground">{t("Brendlar", "Брендов")}</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
