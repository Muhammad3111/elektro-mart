"use client";

import Link from "next/link";
import { Phone, MapPin, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-accent rounded-lg p-6 mt-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-lg mb-2">Sobirov</h4>
            <p className="text-sm text-muted-foreground">
              {t(
                "Barcha elektr ta'minot ehtiyojlari uchun ishonchli hamkoringiz",
                "Ваш надежный партнер для всех потребностей в электроснабжении"
              )}
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">{t("Tezkor havolalar", "Быстрые ссылки")}</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t("Biz haqimizda", "О нас")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  {t("Aloqa", "Контакты")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("Savol-javob", "Вопросы и ответы")}
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  {t("Yetkazib berish va qaytarish", "Доставка и возврат")}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-2">{t("Aloqa", "Контакты")}</h4>
            <div className="space-y-3 text-sm">
              <a href="tel:+998334704700" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 text-primary" />
                <span>+998 33 470 47 00</span>
              </a>
              <a href="mailto:sobirovsardor138@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 text-primary" />
                <span>sobirovsardor138@gmail.com</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                <span>{t("O'zbekiston, Toshkent, Shayxontoxir tumani, Taxtapul, To'raqurgon ko'chasi 12b, Mo'ljal: Malika bozori", "Узбекистан, Ташкент, Шайхантахурский район, Тахтапуль, улица Туракурган 12б, Ориентир: рынок Малика")}</span>
              </div>
              <div>
                <h5 className="font-semibold mb-2">{t("Bizni kuzatib boring", "Следите за нами")}</h5>
                <div className="flex space-x-3">
                  <Link href="https://t.me/electrawire" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.306.02.472z"/>
                    </svg>
                  </Link>
                  <Link href="https://instagram.com/electrawire" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2024 Sobirov. {t("Barcha huquqlar himoyalangan", "Все права защищены")}.</p>
        </div>
      </div>
    </footer>
  );
}
