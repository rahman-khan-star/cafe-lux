"use client";

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react";
import { type Food, type CartItem, type Coupon } from "@/types/food";
import { coupons, deliveryFee, taxRate } from "@/data/foods";

interface CartContextType {
  items: CartItem[];
  addItem: (food: Food) => void;
  removeItem: (foodId: string) => void;
  increaseQuantity: (foodId: string) => void;
  decreaseQuantity: (foodId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
  delivery: number;
  tax: number;
  total: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const addItem = useCallback((food: Food) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { food, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((foodId: string) => {
    setItems((prev) => prev.filter((item) => item.food.id !== foodId));
  }, []);

  const increaseQuantity = useCallback((foodId: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.food.id === foodId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((foodId: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.food.id === foodId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.food.price * item.quantity, 0),
    [items]
  );

  const applyCoupon = useCallback(
    (code: string): boolean => {
      const coupon = coupons.find(
        (c) => c.code.toUpperCase() === code.toUpperCase() && subtotal >= c.minOrder
      );
      if (coupon) {
        setAppliedCoupon(coupon);
        return true;
      }
      return false;
    },
    [subtotal]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return subtotal * (appliedCoupon.discount / 100);
    }
    return appliedCoupon.discount;
  }, [appliedCoupon, subtotal]);

  const delivery = useMemo(() => (subtotal > 0 ? deliveryFee : 0), [subtotal]);
  const tax = useMemo(() => (subtotal - discount) * taxRate, [subtotal, discount]);

  const total = useMemo(
    () => Math.max(0, subtotal - discount + delivery + tax),
    [subtotal, discount, delivery, tax]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        itemCount,
        subtotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        discount,
        delivery,
        tax,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
