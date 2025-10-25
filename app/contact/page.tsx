"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const contactInfo = [
    {
      icon: MapPin,
      title: t("Manzil", "Адрес"),
      content: t("Toshkent sh., Chilonzor tumani, Bunyodkor ko'chasi 1-uy", "г. Ташкент, Чиланзарский район, ул. Бунёдкор 1")
    },
    {
      icon: Phone,
      title: t("Telefon", "Телефон"),
      content: "+998 71 123 45 67"
    },
    {
      icon: Clock,
      title: t("Ish vaqti", "Время работы"),
      content: t("Dushanba-Shanba: 9:00 - 18:00", "Понедельник-Суббота: 9:00 - 18:00")
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-primary/10 to-primary/5 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-black">{t("Biz bilan bog'laning", "Свяжитесь с нами")}</h1>
              <p className="text-lg text-muted-foreground">
                {t("Savollaringiz bormi? Biz sizga yordam berishga tayyormiz!", "Есть вопросы? Мы готовы помочь!")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t("Xabar yuborish", "Отправить сообщение")}</h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("Ism", "Имя")}</Label>
                      <Input id="firstName" placeholder={t("Ismingiz", "Ваше имя")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("Telefon", "Телефон")}</Label>
                      <Input id="phone" type="tel" placeholder="+998 __ ___ __ __" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t("Mavzu", "Тема")}</Label>
                      <Input id="subject" placeholder={t("Xabar mavzusi", "Тема сообщения")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t("Xabar", "Сообщение")}</Label>
                      <Textarea 
                        id="message" 
                        placeholder={t("Xabaringizni yozing...", "Напишите ваше сообщение...")} 
                        rows={6}
                      />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12">
                      {t("Xabar yuborish", "Отправить сообщение")}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-6">{t("Aloqa ma'lumotlari", "Контактная информация")}</h2>
              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <Card key={info.title}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                            <p className="text-muted-foreground">{info.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Yandex Map - Full Width in Container */}
        <section className="container mx-auto px-4 pb-16">
          <div className="w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://yandex.com/map-widget/v1/?ll=69.240562,41.299496&z=12&l=map&pt=69.240562,41.299496,pm2rdm"
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'relative' }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
