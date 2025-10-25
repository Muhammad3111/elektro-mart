"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  brand?: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchResults: Product[];
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Mock products data
const mockProducts: Product[] = [
  { id: 1, name: "Elektr kabeli 2.5mm", price: "25000", image: "/placeholder.svg", category: "Kabellar", brand: "ElectroPro" },
  { id: 2, name: "Elektr kabeli 4mm", price: "35000", image: "/placeholder.svg", category: "Kabellar", brand: "ElectroPro" },
  { id: 3, name: "LED lampa 10W", price: "15000", image: "/placeholder.svg", category: "Yoritish", brand: "LightMax" },
  { id: 4, name: "LED lampa 20W", price: "25000", image: "/placeholder.svg", category: "Yoritish", brand: "LightMax" },
  { id: 5, name: "Rozetka 2x", price: "8000", image: "/placeholder.svg", category: "Rozetkalar", brand: "PowerPlus" },
  { id: 6, name: "Rozetka 4x", price: "12000", image: "/placeholder.svg", category: "Rozetkalar", brand: "PowerPlus" },
  { id: 7, name: "Avtomat 16A", price: "45000", image: "/placeholder.svg", category: "Avtomatlar", brand: "SafeGuard" },
  { id: 8, name: "Avtomat 25A", price: "55000", image: "/placeholder.svg", category: "Avtomatlar", brand: "SafeGuard" },
  { id: 9, name: "Elektr simlar 1.5mm", price: "18000", image: "/placeholder.svg", category: "Kabellar", brand: "WireTech" },
  { id: 10, name: "Lyustra zamonaviy", price: "250000", image: "/placeholder.svg", category: "Yoritish", brand: "LuxLight" },
];

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  // Filter products based on search query and category
  const searchResults = mockProducts.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesQuery && matchesCategory && searchQuery.length > 0;
  });

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
