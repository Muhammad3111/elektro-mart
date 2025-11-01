"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authAPI, getToken, removeToken } from "@/lib/api";
import type { User, LoginDto, RegisterDto } from "@/types/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = getToken();
      if (token) {
        const userData = await authAPI.getProfile();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginDto) => {
    try {
      const response = await authAPI.login(data);
      setUser(response.user);
      toast.success(
        response.user.role === "admin"
          ? "Admin tizimga kirdi"
          : "Tizimga muvaffaqiyatli kirdingiz"
      );
      
      // Redirect based on role
      if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.user);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz");
      router.push("/");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    toast.success("Tizimdan chiqdingiz");
    router.push("/auth");
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
