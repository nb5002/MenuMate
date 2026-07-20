import axiosClient from "./axiosClient";
import type { MenuItem } from "../types";

export const getAllMenuItems = () => axiosClient.get<MenuItem[]>("/menu");

export const getMenuItemById = (id: number) =>
  axiosClient.get<MenuItem>(`/menu/${id}`);

export const createMenuItem = (data: Omit<MenuItem, "id">) =>
  axiosClient.post("/menu", data);

export const updateMenuItem = (id: number, data: Partial<Omit<MenuItem, "id">>) =>
  axiosClient.put(`/menu/${id}`, data);

export const deleteMenuItem = (id: number) =>
  axiosClient.delete(`/menu/${id}`);