"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ShoppingCart,
    Menu,
    Zap,
    Globe,
    Search,
    X,
    User,
    Heart,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { useCart } from "@/contexts/cart-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useAuth } from "@/contexts/auth-context";
import { useSearch } from "@/contexts/search-context";
import { UserAvatar } from "@/components/user-avatar";
import { formatPrice } from "@/lib/utils/format-price";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { categoriesAPI } from "@/lib/api";
import type { Category } from "@/types/category";

export function Header() {
    const { language, setLanguage, t } = useLanguage();
    const { cartCount } = useCart();
    const { favoritesCount } = useFavorites();
    const { user, isAuthenticated } = useAuth();
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        totalResults,
        isSearching,
    } = useSearch();
    const pathname = usePathname();
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const catalogRef = useRef<HTMLDivElement>(null);

    // Load categories
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoriesAPI.getAll();
                setCategories(data.filter((c) => !c.parentId && c.isActive));
            } catch (error) {
                console.error("Failed to load categories:", error);
            }
        };
        loadCategories();
    }, []);

    // Close catalog dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                catalogRef.current &&
                !catalogRef.current.contains(event.target as Node)
            ) {
                setCatalogOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
    }, [pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setShowResults(value.length > 0);
    };

    const handleProductClick = (productId: string) => {
        setShowResults(false);
        setSearchQuery("");
        router.push(`/products/${productId}`);
    };

    const handleViewAll = () => {
        setShowResults(false);
        setSearchQuery("");
        router.push(`/catalog?search=${searchQuery}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            handleViewAll();
        }
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname?.startsWith(path);
    };

    return (
        <header className="border-b border-primary/20 bg-background sticky top-0 z-50">
            {/* Top Bar - Contact Info (Desktop Only) */}
            <div className="hidden md:block bg-primary text-white py-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-6">
                            <a
                                href="tel:+998334704700"
                                className="hover:underline"
                            >
                                +998 33 470 47 00
                            </a>
                            <a
                                href="mailto:info@sobirov.uz"
                                className="hover:underline"
                            >
                                info@sobirov.uz
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Select
                                value={language}
                                onValueChange={(val) =>
                                    setLanguage(val as "uz" | "ru")
                                }
                            >
                                <SelectTrigger className="w-full h-7 bg-transparent border-white/30 text-white hover:bg-white/10">
                                    <Globe className="h-3 w-3 mr-1" />
                                    <SelectValue
                                        placeholder={
                                            language === "uz" ? "O'Z" : "RU"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="uz">
                                        O&apos;zbek
                                    </SelectItem>
                                    <SelectItem value="ru">Русский</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header Row (Desktop) */}
            <div className="hidden md:block bg-background py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Zap className="h-8 w-8 text-primary" />
                            <h2 className="text-2xl font-bold">Sobirov</h2>
                        </Link>

                        {/* Katalog Button with Dropdown */}
                        <div className="relative" ref={catalogRef}>
                            <Button
                                onClick={() => setCatalogOpen(!catalogOpen)}
                                className="bg-primary hover:bg-primary/90 text-white h-11 px-6 gap-2"
                            >
                                <Menu className="h-5 w-5" />
                                {t("Katalog", "Каталог")}
                            </Button>

                            {/* Catalog Dropdown */}
                            {catalogOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-primary/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                    <div className="p-2">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.id}
                                                href={`/categories/${category.id}`}
                                                onClick={() =>
                                                    setCatalogOpen(false)
                                                }
                                                className="block px-4 py-3 hover:bg-accent rounded-lg transition-colors cursor-pointer"
                                            >
                                                <p className="font-medium">
                                                    {language === "uz"
                                                        ? category.nameUz
                                                        : category.nameRu}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search Bar */}
                        <div className="flex-1" ref={searchRef}>
                            <div className="relative">
                                <Input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    onKeyPress={handleKeyPress}
                                    onFocus={() =>
                                        searchQuery.length > 0 &&
                                        setShowResults(true)
                                    }
                                    placeholder={t("Qidirish...", "Поиск...")}
                                    className="w-full h-11 pl-4 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0 border-2"
                                />
                                <Button className="absolute right-0 top-0 h-11 px-6! bg-primary hover:bg-primary/90 text-white rounded-l-none">
                                    <Search className="h-5 w-5" />
                                </Button>

                                {/* Search Results Dropdown */}
                                {showResults && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-primary/20 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
                                        <div className="p-2">
                                            <div className="text-xs text-muted-foreground px-3 py-2">
                                                {searchResults.length}{" "}
                                                {t(
                                                    "mahsulot topildi",
                                                    "товаров найдено"
                                                )}
                                            </div>
                                            {searchResults
                                                .slice(0, 5)
                                                .map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() =>
                                                            handleProductClick(
                                                                product.id
                                                            )
                                                        }
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                                                    >
                                                        <div className="w-12 h-12 bg-accent rounded flex items-center justify-center flex-shrink-0">
                                                            <Zap className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">
                                                                {language ===
                                                                "uz"
                                                                    ? product.nameUz
                                                                    : product.nameRu}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {product.category
                                                                    ? t(
                                                                          product
                                                                              .category
                                                                              .nameUz,
                                                                          product
                                                                              .category
                                                                              .nameRu
                                                                      )
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                        <div className="text-sm font-bold text-primary">
                                                            {formatPrice(
                                                                product.price
                                                            )}{" "}
                                                            UZS
                                                        </div>
                                                    </button>
                                                ))}
                                            {totalResults > 5 && (
                                                <button
                                                    onClick={handleViewAll}
                                                    className="w-full mt-2 p-3 text-center text-sm font-medium text-primary hover:bg-accent rounded-lg transition-colors"
                                                >
                                                    {t(
                                                        "Barcha natijalarni ko'rish",
                                                        "Посмотреть все результаты"
                                                    )}{" "}
                                                    ({totalResults})
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Actions */}
                        <div className="flex items-center gap-2">
                            {/* Kirish */}
                            {isAuthenticated && user ? (
                                <Link href="/profile">
                                    <Button
                                        variant="ghost"
                                        className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                                    >
                                        <UserAvatar
                                            firstName={user.firstName}
                                            lastName={user.lastName}
                                            size="sm"
                                        />
                                        <span className="text-xs">
                                            {t("Profil", "Профиль")}
                                        </span>
                                    </Button>
                                </Link>
                            ) : (
                                <Link href="/auth">
                                    <Button
                                        variant="ghost"
                                        className="flex flex-col items-center gap-1 h-auto py-2 px-3"
                                    >
                                        <User className="h-7! w-7!" />
                                        <span className="text-xs">
                                            {t("Kirish", "Войти")}
                                        </span>
                                    </Button>
                                </Link>
                            )}

                            {/* Sevimlilar */}
                            <Link href="/favorites">
                                <Button
                                    variant="ghost"
                                    className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative"
                                >
                                    <Heart className="h-7! w-7!" />
                                    <span className="text-xs">
                                        {t("Sevimlilar", "Избранное")}
                                    </span>
                                    {favoritesCount > 0 && (
                                        <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                            {favoritesCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>

                            {/* Savatcha */}
                            <Link href="/cart">
                                <Button
                                    variant="ghost"
                                    className="flex flex-col items-center gap-1 h-auto py-2 px-3 relative"
                                >
                                    <ShoppingCart className="h-7! w-7!" />
                                    <span className="text-xs">
                                        {t("Savatcha", "Корзина")}
                                    </span>
                                    {cartCount > 0 && (
                                        <span className="absolute top-1 right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Menu - Bottom Row (Desktop) */}
            <div className="hidden md:block border-t border-primary/10 bg-background">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-8 py-3">
                        <Link
                            href="/"
                            className={`text-sm font-medium hover:text-primary transition-colors ${
                                isActive("/") ? "text-primary" : ""
                            }`}
                        >
                            {t("Bosh sahifa", "Главная")}
                        </Link>
                        <Link
                            href="/catalog"
                            className={`text-sm font-medium hover:text-primary transition-colors ${
                                isActive("/catalog") ? "text-primary" : ""
                            }`}
                        >
                            {t("Katalog", "Каталог")}
                        </Link>
                        <Link
                            href="/about"
                            className={`text-sm font-medium hover:text-primary transition-colors ${
                                isActive("/about") ? "text-primary" : ""
                            }`}
                        >
                            {t("Biz haqimizda", "О нас")}
                        </Link>
                        <Link
                            href="/contact"
                            className={`text-sm font-medium hover:text-primary transition-colors ${
                                isActive("/contact") ? "text-primary" : ""
                            }`}
                        >
                            {t("Aloqa", "Контакты")}
                        </Link>
                    </nav>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden">
                <div className="container mx-auto px-4 py-3">
                    {/* Mobile Header - Top Row */}
                    <div className="flex md:hidden items-center justify-between w-full">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Zap className="h-7 w-7 text-primary" />
                            <h2 className="text-lg font-bold">Sobirov</h2>
                        </Link>

                        {/* Language Selector */}
                        <Select
                            value={language}
                            onValueChange={(val) =>
                                setLanguage(val as "uz" | "ru")
                            }
                        >
                            <SelectTrigger className="w-max h-9">
                                <Globe className="h-3 w-3 mr-1" />
                                <SelectValue
                                    placeholder={
                                        language === "uz" ? "O'zbek" : "Русский"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uz">O&apos;zbek</SelectItem>
                                <SelectItem value="ru">Русский</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar - Second Row */}
            <div className="md:hidden border-t border-border bg-background p-3">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder={t("Qidirish...", "Поиск...")}
                            className="pl-9 h-10 text-sm"
                        />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="h-10 w-10"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </Button>
                </div>

                {/* Mobile Search Results */}
                {showResults && searchResults.length > 0 && (
                    <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
                        {searchResults.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleProductClick(product.id)}
                                className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-0"
                            >
                                <div className="w-12 h-12 bg-accent rounded shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">
                                        {language === "uz"
                                            ? product.nameUz
                                            : product.nameRu}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.category
                                            ? t(
                                                  product.category.nameUz,
                                                  product.category.nameRu
                                              )
                                            : ""}
                                    </p>
                                </div>
                                <p className="font-bold text-primary text-sm">
                                    {formatPrice(product.price)} UZS
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-primary/20 z-50">
                <div className="flex items-center justify-around py-2">
                    {/* Katalog */}
                    <button
                        onClick={() => setCatalogOpen(!catalogOpen)}
                        className="flex flex-col items-center gap-1 px-3 py-2 hover:text-primary transition-colors relative"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="text-xs font-medium">
                            {t("Katalog", "Каталог")}
                        </span>
                    </button>

                    {/* Sevimlilar */}
                    <Link
                        href="/favorites"
                        className="flex flex-col items-center gap-1 px-3 py-2 hover:text-primary transition-colors relative"
                    >
                        <Heart className="h-6 w-6" />
                        <span className="text-xs font-medium">
                            {t("Sevimlilar", "Избранное")}
                        </span>
                        {favoritesCount > 0 && (
                            <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                {favoritesCount}
                            </span>
                        )}
                    </Link>

                    {/* Savatcha */}
                    <Link
                        href="/cart"
                        className="flex flex-col items-center gap-1 px-3 py-2 hover:text-primary transition-colors relative"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        <span className="text-xs font-medium">
                            {t("Savatcha", "Корзина")}
                        </span>
                        {cartCount > 0 && (
                            <span className="absolute top-1 right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Kirish / Profile */}
                    {isAuthenticated && user ? (
                        <Link
                            href="/profile"
                            className="flex flex-col items-center gap-1 px-3 py-2 hover:text-primary transition-colors"
                        >
                            <UserAvatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                size="sm"
                            />
                            <span className="text-xs font-medium">
                                {t("Profil", "Профиль")}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/auth"
                            className="flex flex-col items-center gap-1 px-3 py-2 hover:text-primary transition-colors"
                        >
                            <User className="h-6 w-6" />
                            <span className="text-xs font-medium">
                                {t("Kirish", "Войти")}
                            </span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Catalog Dropdown for Mobile */}
            {catalogOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setCatalogOpen(false)}
                >
                    <div
                        className="absolute bottom-16 left-0 right-0 bg-background border-t border-primary/20 rounded-t-xl shadow-lg max-h-[60vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-3">
                                {t("Katalog", "Каталог")}
                            </h3>
                            <div className="space-y-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.id}`}
                                        onClick={() => setCatalogOpen(false)}
                                        className="block px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <p className="font-medium">
                                            {language === "uz"
                                                ? category.nameUz
                                                : category.nameRu}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Sidebar */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div
                        className="absolute top-0 right-0 h-full w-[280px] bg-background shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between p-4 border-b">
                                <h3 className="font-semibold text-lg">
                                    {t("Menyu", "Меню")}
                                </h3>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <nav className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-2">
                                    <Link
                                        href="/"
                                        className={`block px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                                            isActive("/")
                                                ? "bg-accent text-primary"
                                                : ""
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t("Bosh sahifa", "Главная")}
                                    </Link>
                                    <Link
                                        href="/about"
                                        className={`block px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                                            isActive("/about")
                                                ? "bg-accent text-primary"
                                                : ""
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t("Biz haqimizda", "О нас")}
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className={`block px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                                            isActive("/contact")
                                                ? "bg-accent text-primary"
                                                : ""
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t("Aloqa", "Контакты")}
                                    </Link>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
