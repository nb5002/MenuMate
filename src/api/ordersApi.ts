import axiosClient from "./axiosClient";
import type { CreateOrderRequest, CreateOrderResponse, Order } from "../types";

export const createOrder = (data: CreateOrderRequest) =>
  axiosClient.post<CreateOrderResponse>("/api/orders", data);

export const getAllOrders = () => axiosClient.get<Order[]>("/api/orders");

export const getOrderById = (id: number) =>
  axiosClient.get<Order>(`/api/orders/${id}`);

export const updateOrderStatus = (id: number, status: string) =>
  axiosClient.put(`/api/orders/${id}/status`, { status });

export const getOrderHistory = () => axiosClient.get<Order[]>("/api/orders/history");