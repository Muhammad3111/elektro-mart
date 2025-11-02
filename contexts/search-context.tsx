"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { productsAPI } from "@/lib/api";
import type { Product } from "@/types/product";

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchResults: Product[];
  isSearching: boolean;
  totalResults: number;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search effect
  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        setTotalResults(0);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const result = await productsAPI.search({
          q: searchQuery,
          limit: 5, // Faqat 5 ta natija header dropdown uchun
        });
        setSearchResults(result.data);
        setTotalResults(result.total);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
        setTotalResults(0);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        searchResults,
        isSearching,
        totalResults,
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
