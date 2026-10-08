import axiosClient from "./axiosClient";
import type { CreateOrderRequest, CreateOrderResponse, Order } from "../types";

export const createOrder = (data: CreateOrderRequest) =>
  axiosClient.post<CreateOrderResponse>("/orders", data);

export const getAllOrders = () => axiosClient.get<Order[]>("/orders");

export const getOrderById = (id: number) =>
  axiosClient.get<Order>(`/orders/${id}`);

export const updateOrderStatus = (id: number, status: string) =>
  axiosClient.put(`/orders/${id}/status`, { status });

export const getOrderHistory = () => axiosClient.get<Order[]>("/orders/history");