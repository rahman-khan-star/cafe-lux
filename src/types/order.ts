export type AdminRole = "customer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: AdminRole;
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface OrderItem {
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = "pending" | "confirmed" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled";

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery: number;
  tax: number;
  total: number;
  status: OrderStatus;
  deliveryMethod: "delivery" | "pickup";
  paymentMethod: "cod" | "stripe";
  addressId?: string;
  couponCode?: string;
  createdAt: string;
  estimatedDelivery: string;
  notes?: string;
}

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "cod" | "stripe";

export interface CheckoutData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  addressId?: string;
  address?: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  notes: string;
}
