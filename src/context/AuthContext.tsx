"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { User, Address, Order, OrderStatus } from "@/types/order";
import type { Food, Category, Coupon } from "@/types/food";
import type { Reservation, ReservationStatus } from "@/types/admin";
import { foods as initialFoods, categories as initialCategories, coupons as initialCoupons } from "@/data/foods";

const MOCK_ADMIN: User = {
  id: "admin1",
  name: "Admin User",
  email: "admin@cafelux.com",
  phone: "+1 (555) 000-0001",
  avatar: "https://i.pravatar.cc/100?img=12",
  role: "admin",
  createdAt: "2024-01-01",
};

const MOCK_USER: User = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "+1 (555) 987-6543",
  avatar: "https://i.pravatar.cc/100?img=11",
  role: "customer",
  createdAt: "2024-03-15",
};

const MOCK_ADDRESSES: Address[] = [
  { id: "a1", label: "Home", street: "456 Oak Avenue, Apt 2B", city: "New York", state: "NY", zip: "10001", isDefault: true },
  { id: "a2", label: "Work", street: "789 Madison Avenue, Floor 12", city: "New York", state: "NY", zip: "10065", isDefault: false },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2024-001", items: [{ foodId: "truffle-burger", name: "Truffle Wagyu Burger", price: 18.99, quantity: 2, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80" }, { foodId: "fresh-lemonade", name: "Fresh Mint Lemonade", price: 4.99, quantity: 1, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600&q=80" }],
    subtotal: 42.97, discount: 0, delivery: 4.99, tax: 3.44, total: 51.40, status: "delivered", deliveryMethod: "delivery", paymentMethod: "cod", addressId: "a1",
    createdAt: "2024-12-20T18:30:00Z", estimatedDelivery: "2024-12-20T19:15:00Z",
  },
  {
    id: "ORD-2024-002", items: [{ foodId: "margherita", name: "Margherita Classica", price: 16.49, quantity: 1, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80" }, { foodId: "tiramisu", name: "Classic Tiramisu", price: 9.99, quantity: 2, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80" }],
    subtotal: 36.47, discount: 5.47, delivery: 0, tax: 2.48, total: 33.48, status: "preparing", deliveryMethod: "pickup", paymentMethod: "stripe", couponCode: "WELCOME20",
    createdAt: "2025-01-05T12:00:00Z", estimatedDelivery: "2025-01-05T12:25:00Z",
  },
  {
    id: "ORD-2024-003", items: [{ foodId: "avocado-toast", name: "Avocado Smash Toast", price: 12.99, quantity: 1, image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=600&q=80" }, { foodId: "cold-brew", name: "Cold Brew Nitro", price: 5.49, quantity: 2, image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&q=80" }],
    subtotal: 23.97, discount: 0, delivery: 4.99, tax: 1.92, total: 30.88, status: "out-for-delivery", deliveryMethod: "delivery", paymentMethod: "cod", addressId: "a1",
    createdAt: "2025-01-06T09:15:00Z", estimatedDelivery: "2025-01-06T09:55:00Z",
  },
  {
    id: "ORD-2024-004", items: [{ foodId: "truffle-mushroom", name: "Truffle Mushroom Pizza", price: 19.99, quantity: 1, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80" }],
    subtotal: 19.99, discount: 0, delivery: 4.99, tax: 1.60, total: 26.58, status: "pending", deliveryMethod: "delivery", paymentMethod: "cod",
    createdAt: "2025-01-07T11:30:00Z", estimatedDelivery: "2025-01-07T12:10:00Z",
  },
  {
    id: "ORD-2024-005", items: [{ foodId: "berry-smoothie", name: "Acai Berry Smoothie", price: 7.49, quantity: 3, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&q=80" }, { foodId: "creme-brulee", name: "Crème Brûlée", price: 8.99, quantity: 2, image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=600&q=80" }],
    subtotal: 40.45, discount: 6.07, delivery: 4.99, tax: 2.76, total: 42.13, status: "confirmed", deliveryMethod: "delivery", paymentMethod: "stripe", couponCode: "CAFE15",
    createdAt: "2025-01-07T13:00:00Z", estimatedDelivery: "2025-01-07T13:40:00Z",
  },
  {
    id: "ORD-2024-006", items: [{ foodId: "espresso-classico", name: "Espresso Classico", price: 4.99, quantity: 2, image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&q=80" }, { foodId: "buttermilk-pancakes", name: "Buttermilk Pancakes", price: 14.49, quantity: 1, image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80" }],
    subtotal: 24.47, discount: 0, delivery: 0, tax: 1.96, total: 26.43, status: "delivered", deliveryMethod: "pickup", paymentMethod: "cod",
    createdAt: "2025-01-06T08:00:00Z", estimatedDelivery: "2025-01-06T08:30:00Z",
  },
];

const MOCK_CUSTOMERS: User[] = [
  { id: "u1", name: "Alex Johnson", email: "alex@example.com", phone: "+1 (555) 987-6543", avatar: "https://i.pravatar.cc/100?img=11", role: "customer", createdAt: "2024-03-15" },
  { id: "u2", name: "Sarah Williams", email: "sarah@example.com", phone: "+1 (555) 234-5678", avatar: "https://i.pravatar.cc/100?img=1", role: "customer", createdAt: "2024-05-20" },
  { id: "u3", name: "Michael Brown", email: "michael@example.com", phone: "+1 (555) 345-6789", avatar: "https://i.pravatar.cc/100?img=3", role: "customer", createdAt: "2024-07-10" },
  { id: "u4", name: "Emily Davis", email: "emily@example.com", phone: "+1 (555) 456-7890", avatar: "https://i.pravatar.cc/100?img=5", role: "customer", createdAt: "2024-09-01" },
  { id: "u5", name: "James Wilson", email: "james@example.com", phone: "+1 (555) 567-8901", avatar: "https://i.pravatar.cc/100?img=8", role: "customer", createdAt: "2024-11-15" },
  { id: "u6", name: "Priya Patel", email: "priya@example.com", phone: "+1 (555) 678-9012", avatar: "https://i.pravatar.cc/100?img=9", role: "customer", createdAt: "2025-01-02" },
];

const MOCK_RESERVATIONS: Reservation[] = [
  { id: "res1", customerName: "Alex Johnson", customerEmail: "alex@example.com", customerPhone: "+1 (555) 987-6543", date: "2025-01-10", time: "19:00", guests: 4, status: "confirmed", notes: "Window seat preferred", createdAt: "2025-01-05T10:00:00Z" },
  { id: "res2", customerName: "Sarah Williams", customerEmail: "sarah@example.com", customerPhone: "+1 (555) 234-5678", date: "2025-01-10", time: "20:00", guests: 2, status: "pending", createdAt: "2025-01-06T14:30:00Z" },
  { id: "res3", customerName: "Michael Brown", customerEmail: "michael@example.com", customerPhone: "+1 (555) 345-6789", date: "2025-01-11", time: "18:30", guests: 6, status: "confirmed", notes: "Birthday celebration", createdAt: "2025-01-07T09:15:00Z" },
  { id: "res4", customerName: "Emily Davis", customerEmail: "emily@example.com", customerPhone: "+1 (555) 456-7890", date: "2025-01-09", time: "12:00", guests: 3, status: "completed", createdAt: "2025-01-03T11:00:00Z" },
  { id: "res5", customerName: "James Wilson", customerEmail: "james@example.com", customerPhone: "+1 (555) 567-8901", date: "2025-01-12", time: "13:00", guests: 2, status: "pending", createdAt: "2025-01-07T16:45:00Z" },
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  changePassword: (current: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  addresses: Address[];
  addAddress: (addr: Omit<Address, "id">) => void;
  updateAddress: (id: string, addr: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (data: {
    items: { foodId: string; name: string; price: number; quantity: number; image: string }[];
    subtotal: number; discount: number; delivery: number; tax: number; total: number;
    deliveryMethod: "delivery" | "pickup"; paymentMethod: "cod" | "stripe";
    addressId?: string; couponCode?: string; notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  customers: User[];
  reservations: Reservation[];
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  menuItems: Food[];
  addMenuItem: (item: Food) => void;
  updateMenuItem: (id: string, data: Partial<Food>) => void;
  deleteMenuItem: (id: string) => void;
  menuCategories: Category[];
  addCategory: (cat: Category) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  adminCoupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  updateCoupon: (code: string, data: Partial<Coupon>) => void;
  deleteCoupon: (code: string) => void;
  deleteReview: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(MOCK_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [customers] = useState<User[]>(MOCK_CUSTOMERS);
  const [reservations, setReservations] = useState<Reservation[]>(MOCK_RESERVATIONS);
  const [menuItems, setMenuItems] = useState<Food[]>(initialFoods);
  const [menuCategories, setMenuCategories] = useState<Category[]>(initialCategories);
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>(initialCoupons);
  const [reviewIds, setReviewIds] = useState<string[]>(["r1", "r2", "r3", "r4", "r5"]);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    if (email === "admin@cafelux.com" && password === "admin123") {
      setUser(MOCK_ADMIN);
      return { success: true };
    }
    if (email === "alex@example.com" && password === "password") {
      setUser(MOCK_USER);
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    if (password.length < 6) return { success: false, error: "Password must be at least 6 characters." };
    setUser({ id: `u${Date.now()}`, name, email, phone: "", role: "customer", createdAt: new Date().toISOString() });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    await new Promise((r) => setTimeout(r, 500));
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
    return { success: true };
  }, []);

  const changePassword = useCallback(async (current: string, newPass: string) => {
    await new Promise((r) => setTimeout(r, 500));
    if (!current) return { success: false, error: "Current password is required." };
    if (newPass.length < 6) return { success: false, error: "New password must be at least 6 characters." };
    if (current === newPass) return { success: false, error: "New password must be different from current." };
    return { success: true };
  }, []);

  const addAddress = useCallback((addr: Omit<Address, "id">) => {
    const newAddr: Address = { ...addr, id: `a${Date.now()}` };
    setAddresses((prev) => {
      if (newAddr.isDefault) prev.forEach((a) => (a.isDefault = false));
      return [...prev, newAddr];
    });
  }, []);

  const updateAddress = useCallback((id: string, addr: Partial<Address>) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...addr } : a)));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const getOrder = useCallback((id: string) => orders.find((o) => o.id === id), [orders]);

  const placeOrder = useCallback(
    (data: {
      items: { foodId: string; name: string; price: number; quantity: number; image: string }[];
      subtotal: number; discount: number; delivery: number; tax: number; total: number;
      deliveryMethod: "delivery" | "pickup"; paymentMethod: "cod" | "stripe";
      addressId?: string; couponCode?: string; notes?: string;
    }) => {
      const order: Order = {
        id: `ORD-2025-${String(orders.length + 1).padStart(3, "0")}`,
        items: data.items,
        subtotal: data.subtotal,
        discount: data.discount,
        delivery: data.delivery,
        tax: data.tax,
        total: data.total,
        status: "pending",
        deliveryMethod: data.deliveryMethod,
        paymentMethod: data.paymentMethod,
        addressId: data.addressId,
        couponCode: data.couponCode,
        notes: data.notes,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 35 * 60000).toISOString(),
      };
      setOrders((prev) => [order, ...prev]);
      return order;
    },
    [orders.length]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
  }, []);

  const updateReservationStatus = useCallback((id: string, status: ReservationStatus) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const addMenuItem = useCallback((item: Food) => {
    setMenuItems((prev) => [...prev, item]);
  }, []);

  const updateMenuItem = useCallback((id: string, data: Partial<Food>) => {
    setMenuItems((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const addCategory = useCallback((cat: Category) => {
    setMenuCategories((prev) => [...prev, cat]);
  }, []);

  const updateCategory = useCallback((id: string, data: Partial<Category>) => {
    setMenuCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setMenuCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addCoupon = useCallback((coupon: Coupon) => {
    setAdminCoupons((prev) => [...prev, coupon]);
  }, []);

  const updateCoupon = useCallback((code: string, data: Partial<Coupon>) => {
    setAdminCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, ...data } : c)));
  }, []);

  const deleteCoupon = useCallback((code: string) => {
    setAdminCoupons((prev) => prev.filter((c) => c.code !== code));
  }, []);

  const deleteReview = useCallback((id: string) => {
    setReviewIds((prev) => prev.filter((r) => r !== id));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user, isAuthenticated: !!user, isAdmin: user?.role === "admin", isLoading,
        login, register, logout, updateProfile, changePassword,
        addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress,
        orders, getOrder, placeOrder, updateOrderStatus,
        customers, reservations, updateReservationStatus,
        menuItems, addMenuItem, updateMenuItem, deleteMenuItem,
        menuCategories, addCategory, updateCategory, deleteCategory,
        adminCoupons, addCoupon, updateCoupon, deleteCoupon,
        deleteReview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
}
