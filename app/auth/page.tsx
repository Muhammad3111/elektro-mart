"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

function AuthPageContent() {
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
        phone: "",
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
        } catch {
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
        } catch {
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
                                <CardTitle className="text-3xl">
                                    {t("Welcome!", "Добро пожаловать!")}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {t(
                                        "Sign in to your account",
                                        "Войдите в свой аккаунт"
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form
                                    onSubmit={handleLogin}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="login-phone">
                                            {t(
                                                "Phone Number",
                                                "Номер телефона"
                                            )}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <PhoneInput
                                            id="login-phone"
                                            value={loginData.phone}
                                            onChange={(value) =>
                                                setLoginData({
                                                    ...loginData,
                                                    phone: value,
                                                })
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">
                                            {t("Password", "Пароль")}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="login-password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder={t(
                                                    "Enter your password",
                                                    "Введите пароль"
                                                )}
                                                className="pr-10"
                                                value={loginData.password}
                                                onChange={(e) =>
                                                    setLoginData({
                                                        ...loginData,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                disabled={loading}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
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
                                                {t("Loading...", "Загрузка...")}
                                            </>
                                        ) : (
                                            t("Sign In", "Войти")
                                        )}
                                    </Button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Don't have an account?",
                                            "Нет аккаунта?"
                                        )}{" "}
                                        <button
                                            onClick={() => setIsLogin(false)}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {t(
                                                "Register",
                                                "Зарегистрироваться"
                                            )}
                                        </button>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-3xl">
                                    {t("New User?", "Новый пользователь?")}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {t("Create Account", "Создать аккаунт")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <form
                                    onSubmit={handleRegister}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-firstName">
                                                {t("First Name", "Имя")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="reg-firstName"
                                                type="text"
                                                placeholder={t(
                                                    "Your Name",
                                                    "Ваше имя"
                                                )}
                                                value={registerData.firstName}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        firstName:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="reg-lastName">
                                                {t("Last Name", "Фамилия")}{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="reg-lastName"
                                                type="text"
                                                placeholder={t(
                                                    "Your Last Name",
                                                    "Ваша фамилия"
                                                )}
                                                value={registerData.lastName}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        lastName:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">
                                            {t("Email", "Email")}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="reg-email"
                                            type="email"
                                            placeholder="email@example.com"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-phone">
                                            {t(
                                                "Phone Number",
                                                "Номер телефона"
                                            )}
                                        </Label>
                                        <PhoneInput
                                            id="reg-phone"
                                            value={registerData.phone}
                                            onChange={(value) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    phone: value,
                                                })
                                            }
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">
                                            {t(
                                                "Create Password",
                                                "Создать пароль"
                                            )}{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="reg-password"
                                                type={
                                                    showRegPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder={t(
                                                    "Create a strong password",
                                                    "Создайте надежный пароль"
                                                )}
                                                className="pr-10"
                                                value={registerData.password}
                                                onChange={(e) =>
                                                    setRegisterData({
                                                        ...registerData,
                                                        password:
                                                            e.target.value,
                                                    })
                                                }
                                                required
                                                minLength={6}
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowRegPassword(
                                                        !showRegPassword
                                                    )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                disabled={loading}
                                            >
                                                {showRegPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
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
                                                {t("Loading...", "Загрузка...")}
                                            </>
                                        ) : (
                                            t("Register", "Зарегистрироваться")
                                        )}
                                    </Button>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="text-sm text-muted-foreground">
                                        {t(
                                            "Already have an account?",
                                            "Уже есть аккаунт?"
                                        )}{" "}
                                        <button
                                            onClick={() => setIsLogin(true)}
                                            className="text-primary hover:underline font-medium"
                                        >
                                            {t("Sign In", "Войти")}
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

export default function AuthPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-1 flex items-center justify-center bg-background p-4">
                        <div className="w-full max-w-md">
                            <Card>
                                <CardContent className="p-8">
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                    <Footer />
                </div>
            }
        >
            <AuthPageContent />
        </Suspense>
    );
}
