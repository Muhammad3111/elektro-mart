"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoriteItem {
    id: number | string;
    name: string;
    price: string;
    image: string;
    description?: string;
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    favoritesCount: number;
    addToFavorites: (item: FavoriteItem) => void;
    removeFromFavorites: (id: number | string) => void;
    isFavorite: (id: number | string) => boolean;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (item: FavoriteItem) => {
        setFavorites((prev) => {
            // Check if already exists
            if (prev.some((fav) => fav.id === item.id)) {
                return prev;
            }
            return [...prev, item];
        });
    };

    const removeFromFavorites = (id: number | string) => {
        setFavorites((prev) => prev.filter((item) => item.id !== id));
    };

    const isFavorite = (id: number | string) => {
        return favorites.some((item) => item.id === id);
    };

    const clearFavorites = () => {
        setFavorites([]);
    };

    const favoritesCount = favorites.length;

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                favoritesCount,
                addToFavorites,
                removeFromFavorites,
                isFavorite,
                clearFavorites,
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
}
