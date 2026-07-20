export interface LoginRequest {
  username: string;
  password: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
}

export interface LoginResponse {
  message: string;
  role: string;
  username: string;
  userId: number;
  token: string;
}

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  tableNumber: number;
  items: OrderItemRequest[];
}

export type OrderStatus = "Pending" | "Preparing" | "Served";

export interface OrderItem {
  id: number;
  orderId: number;
  menuItemId: number;
  quantity: number;
  subtotal: number;
  menuItem: MenuItem;
}

export interface Order {
  id: number;
  customerName: string;
  tableNumber: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface CreateOrderResponse {
  message: string;
  orderId: number;
  status: OrderStatus;
  totalPrice: number;
}