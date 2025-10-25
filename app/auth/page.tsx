"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {isLogin ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t("Xush kelibsiz!", "Добро пожаловать!")}</CardTitle>
              <CardDescription className="text-base">{t("Hisobingizga kiring", "Войдите в свой аккаунт")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-phone">{t("Telefon raqam", "Номер телефона")}</Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="+998 __ ___ __ __"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">{t("Parol", "Пароль")}</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("Parolingizni kiriting", "Введите пароль")}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>


              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white">
                {t("Kirish", "Войти")}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {t("Hisobingiz yo'qmi?", "Нет аккаунта?")}{" "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    {t("Ro'yxatdan o'tish", "Зарегистрироваться")}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{t("Yangi foydalanuvchi?", "Новый пользователь?")}</CardTitle>
              <CardDescription className="text-base">{t("Hisob yaratish", "Создать аккаунт")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">{t("Ism", "Имя")}</Label>
                <Input
                  id="reg-name"
                  type="text"
                  placeholder={t("Ismingizni kiriting", "Введите ваше имя")}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-phone">{t("Telefon raqam", "Номер телефона")}</Label>
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="+998 __ ___ __ __"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-password">{t("Parol yaratish", "Создать пароль")}</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPassword ? "text" : "password"}
                    placeholder={t("Kuchli parol yarating", "Создайте надежный пароль")}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>


              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white">
                {t("Ro'yxatdan o'tish", "Зарегистрироваться")}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-muted-foreground">
                  {t("Hisobingiz bormi?", "Уже есть аккаунт?")}{" "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    {t("Kirish", "Войти")}
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
