"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X, ImageOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Category } from "@/types/category";
import { categoriesAPI } from "@/lib/api";
import Image from "next/image";

interface Subcategory {
    id: number;
    name: string;
    nameRu: string;
    slug: string;
    parentId?: string;
}

interface Brand {
    id: string;
    name: string;
}

interface ProductFilterProps {
    subcategories?: Subcategory[];
    brands?: Brand[];
    onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
    search: string;
    categories: string[];
    subcategories: string[];
    brands: string[];
    priceRange: number[];
    isNew: boolean;
    hasDiscount: boolean;
}

export function ProductFilter({
    subcategories = [],
    brands = [],
    onFilterChange,
}: ProductFilterProps) {
    const { t } = useLanguage();
    const [isExpanded, setIsExpanded] = useState(true);
    const maxPrice = 500000;
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        search: "",
        categories: [],
        subcategories: [],
        brands: [],
        priceRange: [0, maxPrice],
        isNew: false,
        hasDiscount: false,
    });
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setLoadingCategories(true);
            const data = await categoriesAPI.getAll();
            const parentCategories = data.filter((c) => !c.parentId && c.isActive);
            setCategories(parentCategories);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    const updateFilters = (newFilters: Partial<FilterState>) => {
        const updated = { ...filters, ...newFilters };
        setFilters(updated);
        onFilterChange?.(updated);
    };

    const handleBrandToggle = (brandId: string) => {
        const newBrands = filters.brands.includes(brandId)
            ? filters.brands.filter((id) => id !== brandId)
            : [...filters.brands, brandId];
        updateFilters({ brands: newBrands });
    };

    const handleCategoryToggle = (categoryId: string) => {
        const newCategories = filters.categories.includes(categoryId)
            ? filters.categories.filter((id) => id !== categoryId)
            : [...filters.categories, categoryId];
        updateFilters({ categories: newCategories });
    };

    const handleSubcategoryToggle = (subcategoryId: string) => {
        const newSubcategories = filters.subcategories.includes(subcategoryId)
            ? filters.subcategories.filter((id) => id !== subcategoryId)
            : [...filters.subcategories, subcategoryId];
        updateFilters({ subcategories: newSubcategories });
    };

    const toggleCategoryExpansion = (categoryId: string) => {
        setExpandedCategories(prev => 
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const clearFilters = () => {
        const clearedFilters: FilterState = {
            search: "",
            categories: [],
            subcategories: [],
            brands: [],
            priceRange: [0, maxPrice],
            isNew: false,
            hasDiscount: false,
        };
        setFilters(clearedFilters);
        setExpandedCategories([]);
        onFilterChange?.(clearedFilters);
    };

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">
                        {t("Filtrlar", "Фильтры")}
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-6">
                    {/* Categories Filter */}
                    <div className="space-y-2">
                        <Label>{t("Kategoriyalar", "Категории")}</Label>
                        {loadingCategories ? (
                            <div className="space-y-2">
                                <div className="h-8 bg-muted animate-pulse rounded-md" />
                                <div className="h-8 bg-muted animate-pulse rounded-md" />
                                <div className="h-8 bg-muted animate-pulse rounded-md" />
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {categories.map((category) => {
                                    const hasSubcategories = subcategories.some(sub => sub.parentId === category.id);
                                    const categorySubcategories = subcategories.filter(sub => sub.parentId === category.id);
                                    const isExpanded = expandedCategories.includes(category.id);
                                    
                                    return (
                                        <div key={category.id} className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`category-${category.id}`}
                                                    checked={filters.categories.includes(category.id)}
                                                    onCheckedChange={() => handleCategoryToggle(category.id)}
                                                />
                                                <div className="flex items-center gap-2 flex-1">
                                                    {category.image ? (
                                                        <div className="relative w-4 h-4">
                                                            <Image
                                                                src={category.image}
                                                                alt={category.nameUz}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <ImageOff className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                    <label
                                                        htmlFor={`category-${category.id}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                                    >
                                                        {t(category.nameUz, category.nameRu)}
                                                    </label>
                                                    {hasSubcategories && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => toggleCategoryExpansion(category.id)}
                                                            className="h-6 w-6 p-0"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronUp className="h-3 w-3" />
                                                            ) : (
                                                                <ChevronDown className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Subcategories */}
                                            {hasSubcategories && isExpanded && (
                                                <div className="ml-6 space-y-2 border-l-2 border-muted pl-3">
                                                    {categorySubcategories.map((subcategory) => (
                                                        <div key={subcategory.id} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                id={`subcategory-${subcategory.id}`}
                                                                checked={filters.subcategories.includes(subcategory.id.toString())}
                                                                onCheckedChange={() => handleSubcategoryToggle(subcategory.id.toString())}
                                                            />
                                                            <label
                                                                htmlFor={`subcategory-${subcategory.id}`}
                                                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                            >
                                                                {t(subcategory.name, subcategory.nameRu)}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>


                    {/* Price Range Slider */}
                    <div className="space-y-2">
                        <Label>{t("Narx oralig'i", "Диапазон цен")}</Label>
                        <div className="space-y-4 pt-2">
                            <Slider
                                min={0}
                                max={maxPrice}
                                step={10000}
                                value={filters.priceRange}
                                onValueChange={(value) =>
                                    updateFilters({ priceRange: value })
                                }
                                className="w-full"
                            />
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-medium text-primary">
                                    {filters.priceRange[0].toLocaleString()} UZS
                                </span>
                                <span className="text-muted-foreground">-</span>
                                <span className="font-medium text-primary">
                                    {filters.priceRange[1].toLocaleString()} UZS
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Brands */}
                    {brands.length > 0 && (
                        <div className="space-y-2">
                            <Label>{t("Brendlar", "Бренды")}</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {brands.map((brand) => (
                                    <div
                                        key={brand.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            id={`brand-${brand.id}`}
                                            checked={filters.brands.includes(
                                                brand.id
                                            )}
                                            onCheckedChange={() =>
                                                handleBrandToggle(brand.id)
                                            }
                                        />
                                        <label
                                            htmlFor={`brand-${brand.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                        >
                                            {brand.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Additional Filters */}
                    <div className="space-y-3">
                        <Label>{t("Qo'shimcha", "Дополнительно")}</Label>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isNew"
                                    checked={filters.isNew}
                                    onCheckedChange={(checked) =>
                                        updateFilters({
                                            isNew: checked as boolean,
                                        })
                                    }
                                />
                                <label
                                    htmlFor="isNew"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {t("Yangi", "Новинки")}
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="hasDiscount"
                                    checked={filters.hasDiscount}
                                    onCheckedChange={(checked) =>
                                        updateFilters({
                                            hasDiscount: checked as boolean,
                                        })
                                    }
                                />
                                <label
                                    htmlFor="hasDiscount"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    {t("Chegirmada", "Со скидкой")}
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={clearFilters}
                    >
                        <X className="h-4 w-4 mr-2" />
                        {t("Filtrlarni tozalash", "Очистить фильтры")}
                    </Button>
                </CardContent>
            )}
        </Card>
    );
}
