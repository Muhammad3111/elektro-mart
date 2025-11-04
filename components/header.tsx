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
    Phone,
    Mail,
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

    // Close search results when route changes
    useEffect(() => {
        setShowResults(false);
        setSearchQuery("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setShowResults(value.length > 0);
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
                                className="hover:underline flex items-center gap-2"
                            >
                                <Phone className="h-4 w-4" />
                                +998 33 470 47 00
                            </a>
                            <a
                                href="mailto:sobirovsardor138@gmail.com"
                                className="hover:underline flex items-center gap-2"
                            >
                                <Mail className="h-4 w-4" />
                                sobirovsardor138@gmail.com
                            </a>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="https://t.me/sobirovmarket"
                                target="_blank"
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.093.036.306.02.472z" />
                                </svg>
                            </Link>
                            <Link
                                href="https://instagram.com/sobirovmarket"
                                target="_blank"
                                className="text-white hover:text-white/80 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </Link>
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
                                                href={`/catalog?category=${category.id}`}
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            router.push(`/products/${product.id}`);
                                                        }}
                                                        className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
                                                    >
                                                        <div className="w-12 h-12 bg-accent rounded flex items-center justify-center shrink-0">
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
            <div className="md:hidden border-t border-border bg-background p-3 relative">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder={t("Qidirish...", "Поиск...")}
                            className="pl-9 h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
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
            </div>

            {/* Mobile Search Results - Outside parent to avoid event conflicts */}
            {showResults && searchResults.length > 0 && (
                <div className="md:hidden fixed left-0 right-0 mx-3 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[60vh] overflow-y-auto z-50" style={{ top: '140px' }}>
                        {searchResults.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onTouchEnd={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log('Navigating to:', product.id);
                                    router.push(`/products/${product.id}`);
                                }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log('Click navigation:', product.id);
                                    router.push(`/products/${product.id}`);
                                }}
                                className="w-full flex items-center gap-3 p-3 hover:bg-accent active:bg-accent cursor-pointer border-b last:border-0 text-left touch-manipulation"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
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
                            </button>
                        ))}
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-primary/20 z-40">
                <div className="flex items-center justify-around py-1.5">
                    {/* Katalog */}
                    <button
                        onClick={() => setCatalogOpen(!catalogOpen)}
                        className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors relative ${
                            isActive("/catalog") || isActive("/categories")
                                ? "text-primary"
                                : "hover:text-primary"
                        }`}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="text-[10px] font-medium">
                            {t("Katalog", "Каталог")}
                        </span>
                    </button>

                    {/* Sevimlilar */}
                    <Link
                        href="/favorites"
                        className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors relative ${
                            isActive("/favorites")
                                ? "text-primary"
                                : "hover:text-primary"
                        }`}
                    >
                        <Heart className="h-5 w-5" />
                        <span className="text-[10px] font-medium">
                            {t("Sevimlilar", "Избранное")}
                        </span>
                        {favoritesCount > 0 && (
                            <span className="absolute top-0 right-1 bg-red-500 text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                                {favoritesCount}
                            </span>
                        )}
                    </Link>

                    {/* Savatcha */}
                    <Link
                        href="/cart"
                        className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors relative ${
                            isActive("/cart")
                                ? "text-primary"
                                : "hover:text-primary"
                        }`}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="text-[10px] font-medium">
                            {t("Savatcha", "Корзина")}
                        </span>
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-1 bg-primary text-white text-[9px] rounded-full h-4 w-4 flex items-center justify-center font-semibold">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Kirish / Profile */}
                    {isAuthenticated && user ? (
                        <Link
                            href="/profile"
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                                isActive("/profile")
                                    ? "text-primary"
                                    : "hover:text-primary"
                            }`}
                        >
                            <UserAvatar
                                firstName={user.firstName}
                                lastName={user.lastName}
                                size="sm"
                            />
                            <span className="text-[10px] font-medium">
                                {t("Profil", "Профиль")}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/auth"
                            className={`flex flex-col items-center gap-0.5 px-2 py-1 transition-colors ${
                                isActive("/auth")
                                    ? "text-primary"
                                    : "hover:text-primary"
                            }`}
                        >
                            <User className="h-5 w-5" />
                            <span className="text-[10px] font-medium">
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
                                    <button
                                        key={category.id}
                                        type="button"
                                        onTouchEnd={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCatalogOpen(false);
                                            router.push(`/catalog?category=${category.id}`);
                                        }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setCatalogOpen(false);
                                            router.push(`/catalog?category=${category.id}`);
                                        }}
                                        className="w-full text-left px-4 py-3 hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <p className="font-medium">
                                            {language === "uz"
                                                ? category.nameUz
                                                : category.nameRu}
                                        </p>
                                    </button>
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
                                        href="/catalog"
                                        className={`block px-4 py-3 rounded-lg hover:bg-accent transition-colors ${
                                            isActive("/catalog")
                                                ? "bg-accent text-primary"
                                                : ""
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {t("Katalog", "Каталог")}
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
                            
                            {/* Social Media Icons */}
                            <div className="p-4 border-t border-border">
                                <p className="text-sm font-medium mb-3 text-muted-foreground">
                                    {t("Ijtimoiy tarmoqlar", "Социальные сети")}
                                </p>
                                <div className="flex gap-3">
                                    <Link
                                        href="https://t.me/sobirovmarket"
                                        target="_blank"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 7.002-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z"/>
                                        </svg>
                                    </Link>
                                    <Link
                                        href="https://instagram.com/sobirovmarket"
                                        target="_blank"
                                        className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary hover:text-white transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
