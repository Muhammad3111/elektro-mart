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
import { useSearch } from "@/contexts/search-context";
import { useFavorites } from "@/contexts/favorites-context";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
    const { language, setLanguage, t } = useLanguage();
    const { cartCount } = useCart();
    const { favoritesCount } = useFavorites();
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
    } = useSearch();
    const pathname = usePathname();
    const router = useRouter();
    const [showResults, setShowResults] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const prevPathnameRef = useRef(pathname);

    // Close mobile menu on route change - proper pattern
    if (prevPathnameRef.current !== pathname) {
        prevPathnameRef.current = pathname;
        if (mobileMenuOpen) setMobileMenuOpen(false);
        if (mobileSearchOpen) setMobileSearchOpen(false);
    }

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

    const handleProductClick = (productId: number) => {
        setShowResults(false);
        setSearchQuery("");
        router.push(`/products/${productId}`);
    };

    const handleViewAll = () => {
        setShowResults(false);
        router.push(
            `/catalog?search=${searchQuery}&category=${selectedCategory}`
        );
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname?.startsWith(path);
    };

    return (
        <header className="border-b border-primary/20 bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between gap-8">
                    {/* Logo and Brand */}
                    <Link
                        href="/"
                        className="flex flex-col gap-0.5 flex-shrink-0 cursor-pointer"
                    >
                        <div className="flex items-center gap-2">
                            <Zap className="h-7 w-7 text-primary" />
                            <h2 className="text-xl font-bold">Sobirov</h2>
                        </div>
                        <span className="text-xs text-muted-foreground ml-9">
                            +998 33 470 47 00
                        </span>
                    </Link>

                    {/* Search Bar with Category and Results */}
                    <div
                        className="hidden md:flex flex-1 max-w-2xl"
                        ref={searchRef}
                    >
                        <div className="relative w-full">
                            <div className="relative flex items-center border border-primary/20 rounded-lg overflow-hidden bg-accent/50 focus-within:border-primary focus-within:bg-background transition-all">
                                {/* Category Selector - Integrated */}
                                <div className="relative border-r border-primary/20">
                                    <Select
                                        value={selectedCategory}
                                        onValueChange={setSelectedCategory}
                                    >
                                        <SelectTrigger className="w-[130px] h-11! border-0 rounded-none bg-transparent focus:ring-0">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {t("Barchasi", "Все")}
                                            </SelectItem>
                                            <SelectItem value="Kabellar">
                                                {t("Kabellar", "Кабели")}
                                            </SelectItem>
                                            <SelectItem value="Yoritish">
                                                {t("Yoritish", "Освещение")}
                                            </SelectItem>
                                            <SelectItem value="Rozetkalar">
                                                {t("Rozetkalar", "Розетки")}
                                            </SelectItem>
                                            <SelectItem value="Avtomatlar">
                                                {t("Avtomatlar", "Автоматы")}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Search Input - Integrated */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        onFocus={() =>
                                            searchQuery.length > 0 &&
                                            setShowResults(true)
                                        }
                                        placeholder={t(
                                            "Mahsulotlarni qidirish...",
                                            "Поиск товаров..."
                                        )}
                                        className="w-full pl-10 pr-4 h-11 border-0 bg-transparent focus-visible:ring-0"
                                    />
                                </div>
                            </div>

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
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.category}
                                                        </p>
                                                    </div>
                                                    <div className="text-sm font-bold text-primary">
                                                        {product.price} UZS
                                                    </div>
                                                </button>
                                            ))}
                                        {searchResults.length > 5 && (
                                            <button
                                                onClick={handleViewAll}
                                                className="w-full mt-2 p-3 text-center text-sm font-medium text-primary hover:bg-accent rounded-lg transition-colors"
                                            >
                                                {t(
                                                    "Barcha natijalarni ko'rish",
                                                    "Посмотреть все результаты"
                                                )}{" "}
                                                ({searchResults.length})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`text-lg font-medium hover:text-primary transition-colors relative cursor-pointer ${
                                isActive("/") ? "text-primary" : ""
                            }`}
                        >
                            {t("Bosh sahifa", "Главная")}
                            {isActive("/") && (
                                <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </Link>
                        <Link
                            href="/catalog"
                            className={`text-lg font-medium hover:text-primary transition-colors relative cursor-pointer ${
                                isActive("/catalog") ? "text-primary" : ""
                            }`}
                        >
                            {t("Katalog", "Каталог")}
                            {isActive("/catalog") && (
                                <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </Link>
                        <Link
                            href="/about"
                            className={`text-lg font-medium hover:text-primary transition-colors relative cursor-pointer ${
                                isActive("/about") ? "text-primary" : ""
                            }`}
                        >
                            {t("Biz haqimizda", "О нас")}
                            {isActive("/about") && (
                                <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </Link>
                        <Link
                            href="/contact"
                            className={`text-lg font-medium hover:text-primary transition-colors relative cursor-pointer ${
                                isActive("/contact") ? "text-primary" : ""
                            }`}
                        >
                            {t("Aloqa", "Контакты")}
                            {isActive("/contact") && (
                                <span className="absolute -bottom-[19px] left-0 right-0 h-0.5 bg-primary" />
                            )}
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Language Selector */}
                        <Select
                            value={language}
                            onValueChange={(val) =>
                                setLanguage(val as "uz" | "ru")
                            }
                        >
                            <SelectTrigger className="w-[100px]">
                                <Globe className="h-4 w-4 mr-2" />
                                <SelectValue
                                    placeholder={language.toUpperCase()}
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uz">UZ</SelectItem>
                                <SelectItem value="ru">RU</SelectItem>
                            </SelectContent>
                        </Select>

                        <Link href="/profile">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/favorites">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Heart className="h-5 w-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                        {favoritesCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        {/* Mobile Search Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                                setMobileSearchOpen(!mobileSearchOpen)
                            }
                        >
                            <Search className="h-5 w-5" />
                        </Button>

                        {/* Mobile Favorites */}
                        <Link href="/favorites">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <Heart className="h-5 w-5" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                        {favoritesCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Cart */}
                        <Link href="/cart">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="relative z-50"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {mobileSearchOpen && (
                    <div className="md:hidden border-t border-border bg-background p-4 animate-in slide-in-from-top duration-300">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                value={searchQuery}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                placeholder={t("Qidirish...", "Поиск...")}
                                className="pl-10 h-12"
                            />
                        </div>

                        {/* Mobile Search Results */}
                        {showResults && searchResults.length > 0 && (
                            <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
                                {searchResults.map((product) => (
                                    <div
                                        key={product.id}
                                        onClick={() =>
                                            handleProductClick(product.id)
                                        }
                                        className="flex items-center gap-3 p-3 hover:bg-accent cursor-pointer border-b last:border-0"
                                    >
                                        <div className="w-12 h-12 bg-accent rounded flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {product.category}
                                            </p>
                                        </div>
                                        <p className="font-bold text-primary text-sm">
                                            {product.price} UZS
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Menu Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-background z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    mobileMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <Link href="/" className="flex flex-col gap-0.5 cursor-pointer">
                            <div className="flex items-center gap-2">
                                <Zap className="h-8 w-8 text-primary" />
                                <span className="font-black text-xl">
                                    Sobirov
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground ml-10">
                                +998 33 470 47 00
                            </span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Mobile Menu Content */}
                    <div className="flex-1 overflow-y-auto">
                        {/* User Section */}
                        <div className="p-4 border-b">
                            <Link
                                href="/auth"
                                onClick={() => setMobileMenuOpen(false)}
                                className="cursor-pointer"
                            >
                                <Button className="w-full justify-start gap-2 bg-green-600 hover:bg-green-700 text-white">
                                    <User className="h-5 w-5" />
                                    {t("Kirish", "Войти")}
                                </Button>
                            </Link>
                        </div>

                        {/* Navigation Links */}
                        <nav className="p-4 space-y-1">
                            <Link
                                href="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                                    isActive("/")
                                        ? "bg-primary text-white"
                                        : "hover:bg-accent"
                                }`}
                            >
                                {t("Bosh sahifa", "Главная")}
                            </Link>
                            <Link
                                href="/catalog"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                                    isActive("/catalog")
                                        ? "bg-primary text-white"
                                        : "hover:bg-accent"
                                }`}
                            >
                                {t("Katalog", "Каталог")}
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                                    isActive("/about")
                                        ? "bg-primary text-white"
                                        : "hover:bg-accent"
                                }`}
                            >
                                {t("Biz haqimizda", "О нас")}
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                                    isActive("/contact")
                                        ? "bg-primary text-white"
                                        : "hover:bg-accent"
                                }`}
                            >
                                {t("Aloqa", "Контакты")}
                            </Link>
                        </nav>

                        {/* Language Selector */}
                        <div className="p-4 border-t">
                            <p className="text-sm font-medium mb-3 text-muted-foreground">
                                {t("Til", "Язык")}
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant={
                                        language === "uz"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setLanguage("uz")}
                                    className="w-full"
                                >
                                    O'zbek
                                </Button>
                                <Button
                                    variant={
                                        language === "ru"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setLanguage("ru")}
                                    className="w-full"
                                >
                                    Русский
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="p-4 border-t bg-accent/50">
                        <p className="text-xs text-center text-muted-foreground">
                            © 2024 Sobirov
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
