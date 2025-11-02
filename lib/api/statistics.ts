/**
 * Statistics API Module
 * Admin dashboard statistika uchun API funksiyalari
 */

import { apiRequest } from "./client";

export interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: number;
}

export interface ProductsCount {
  total: number;
  active: number;
}

export interface OrdersCount {
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface UsersCount {
  total: number;
  admins: number;
  users: number;
}

export const statisticsAPI = {
  /**
   * Dashboard statistikasi (Admin only)
   */
  getDashboard: () => apiRequest<DashboardStats>("/statistics/dashboard"),

  /**
   * Mahsulotlar soni
   */
  getProductsCount: () => apiRequest<ProductsCount>("/statistics/products/count"),

  /**
   * Buyurtmalar soni
   */
  getOrdersCount: () => apiRequest<OrdersCount>("/statistics/orders/count"),

  /**
   * Foydalanuvchilar soni
   */
  getUsersCount: () => apiRequest<UsersCount>("/statistics/users/count"),
};
