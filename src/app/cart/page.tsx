"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Ticket, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CartPage() {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discount,
    delivery,
    tax,
    total,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const success = applyCoupon(couponInput.trim());
    if (success) {
      setCouponInput("");
      setCouponError("");
    } else {
      setCouponError("Invalid coupon or minimum order not met.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c8a97e] transition-colors mb-3"
              >
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Your Cart
              </h1>
              <p className="text-gray-500 mt-1">
                {items.length === 0
                  ? "Your cart is empty"
                  : `${items.length} item${items.length > 1 ? "s" : ""} in your cart`}
              </p>
            </div>
            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-500 mb-8">
                Looks like you haven't added anything yet.
              </p>
              <Link
                href="/menu"
                className="inline-flex px-8 py-4 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300"
              >
                Explore Our Menu
              </Link>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-10">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.food.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex items-center gap-4 bg-white p-4 shadow-sm"
                    >
                      <Link
                        href={`/food/${item.food.id}`}
                        className="relative w-20 h-20 shrink-0 overflow-hidden"
                      >
                        <Image
                          src={item.food.image}
                          alt={item.food.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/food/${item.food.id}`}>
                          <h3 className="font-semibold text-gray-900 text-sm hover:text-[#c8a97e] transition-colors">
                            {item.food.name}
                          </h3>
                        </Link>
                        <p className="text-[#c8a97e] font-bold text-sm mt-1">
                          ${(item.food.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.food.id)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQuantity(item.food.id)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.food.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white p-6 shadow-sm sticky top-28">
                  <h3 className="font-bold text-lg text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  {/* Coupon */}
                  <div className="mb-6">
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Ticket className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-700">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-xs text-green-500">
                            (-{appliedCoupon.type === "percentage"
                              ? `${appliedCoupon.discount}%`
                              : `$${appliedCoupon.discount}`})
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Coupon code"
                            className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-[#c8a97e] transition-colors"
                            onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                          />
                          <button
                            onClick={handleApplyCoupon}
                            className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-red-500 text-xs mt-1">{couponError}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery Fee</span>
                      <span>${delivery.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between font-bold text-gray-900 text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full mt-6 px-8 py-4 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-xl text-center"
                  >
                    Proceed to Checkout
                  </Link>

                  <div className="mt-4 text-center text-xs text-gray-400">
                    Secure checkout. No payment info required yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
