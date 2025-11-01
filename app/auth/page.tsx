"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { login, register, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(loginData);
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(registerData);
    } catch (error) {
      // Error handled in auth context
    } finally {
      setLoading(false);
    }
  };

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
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t("Email", "Email")}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@elektromart.com"
                    className="h-12"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    disabled={loading}
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
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("Yuklanmoqda...", "Загрузка...")}
                    </>
                  ) : (
                    t("Kirish", "Войти")
                  )}
                </Button>
              </form>

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
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-firstName">{t("Ism", "Имя")}</Label>
                    <Input
                      id="reg-firstName"
                      type="text"
                      placeholder={t("Ismingiz", "Ваше имя")}
                      className="h-12"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-lastName">{t("Familiya", "Фамилия")}</Label>
                    <Input
                      id="reg-lastName"
                      type="text"
                      placeholder={t("Familiyangiz", "Ваша фамилия")}
                      className="h-12"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t("Email", "Email")}</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="email@example.com"
                    className="h-12"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-phone">{t("Telefon raqam", "Номер телефона")}</Label>
                  <Input
                    id="reg-phone"
                    type="tel"
                    placeholder="+998901234567"
                    className="h-12"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    disabled={loading}
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
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      minLength={6}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={loading}
                    >
                      {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t("Yuklanmoqda...", "Загрузка...")}
                    </>
                  ) : (
                    t("Ro'yxatdan o'tish", "Зарегистрироваться")
                  )}
                </Button>
              </form>

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
