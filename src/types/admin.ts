export type AdminRole = "customer" | "admin";

export type ReservationStatus = "pending" | "confirmed" | "seated" | "completed" | "cancelled";

export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalReservations: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  reservationsChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  orders: number;
}

export interface PopularFood {
  name: string;
  orders: number;
  revenue: number;
}
