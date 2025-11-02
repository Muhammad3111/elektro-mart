/**
 * Orders API
 * Order management endpoints
 */

import { apiRequest } from "./client";
import type { Order, CreateOrderDto, UpdateOrderDto } from "@/types/order";

export const ordersAPI = {
  /**
   * Create new order (POST /orders)
   */
  createOrder: async (data: CreateOrderDto): Promise<Order> => {
    return apiRequest<Order>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Get all orders - Admin only (GET /orders)
   */
  getAllOrders: async (): Promise<Order[]> => {
    return apiRequest<Order[]>("/orders", {
      method: "GET",
    });
  },

  /**
   * Get user's own orders (GET /orders/my-orders)
   */
  getMyOrders: async (): Promise<Order[]> => {
    return apiRequest<Order[]>("/orders/my-orders", {
      method: "GET",
    });
  },

  /**
   * Get single order by ID (GET /orders/:id)
   */
  getOrderById: async (id: string): Promise<Order> => {
    return apiRequest<Order>(`/orders/${id}`, {
      method: "GET",
    });
  },

  /**
   * Update order - Admin only (PATCH /orders/:id)
   */
  updateOrder: async (id: string, data: UpdateOrderDto): Promise<Order> => {
    return apiRequest<Order>(`/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update order status - Admin only (PATCH /orders/:id/status)
   */
  updateOrderStatus: async (id: string, status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"): Promise<Order> => {
    return apiRequest<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Delete order - Admin only (DELETE /orders/:id)
   */
  deleteOrder: async (id: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/orders/${id}`, {
      method: "DELETE",
    });
  },
};
