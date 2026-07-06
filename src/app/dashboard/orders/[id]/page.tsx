"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { OrderStatus } from "@/types/order";

const statusFlow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"];

const statusLabels: Record<OrderStatus, string> = {
  pending: "Order Placed",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getOrder, addresses, user } = useAuth();
  const order = getOrder(params.id as string);

  if (!user) { router.push("/auth/login"); return null; }
  if (!order) {
    return (
      <div className="min-h-screen bg-[#faf9f7]">
        <Navbar />
        <div className="pt-32 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Order Not Found</h1>
          <Link href="/dashboard" className="text-[#c8a97e] mt-2 inline-block">Back to Dashboard</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const address = order.addressId ? addresses.find((a) => a.id === order.addressId) : null;
  const currentIndex = statusFlow.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c8a97e] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Header */}
            <div className="bg-white p-6 shadow-sm mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{order.id}</h1>
                  <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 self-start ${
                  isCancelled ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                }`}>
                  {statusLabels[order.status]}
                </span>
              </div>
            </div>

            {/* Tracking */}
            {!isCancelled && (
              <div className="bg-white p-6 shadow-sm mb-6">
                <h3 className="font-semibold text-gray-900 mb-6 text-sm uppercase tracking-wider">Order Status</h3>
                <div className="flex items-center justify-between">
                  {statusFlow.map((s, i) => {
                    const isComplete = i <= currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div key={s} className="flex flex-col items-center flex-1 relative">
                        {i > 0 && (
                          <div className={`absolute top-4 left-0 right-1/2 h-0.5 -translate-y-1/2 ${isComplete ? "bg-[#c8a97e]" : "bg-gray-200"}`} />
                        )}
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isComplete ? "bg-[#c8a97e] text-white" : "bg-gray-100 text-gray-400"
                        }`}>
                          {isComplete ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        <p className={`text-[10px] mt-2 text-center font-medium ${isCurrent ? "text-[#c8a97e]" : isComplete ? "text-gray-600" : "text-gray-300"}`}>
                          {statusLabels[s]}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {order.estimatedDelivery && (
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 text-[#c8a97e]" />
                    Estimated {order.deliveryMethod === "pickup" ? "ready by" : "delivery by"}: {new Date(order.estimatedDelivery).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Delivery / Payment Info */}
              <div className="bg-white p-6 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Delivery Info</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {order.deliveryMethod === "pickup" ? <MapPin className="w-4 h-4 text-[#c8a97e]" /> : <MapPin className="w-4 h-4 text-[#c8a97e]" />}
                  <span className="capitalize">{order.deliveryMethod}</span>
                </div>
                {address && (
                  <div className="text-sm text-gray-500">
                    <p className="font-medium text-gray-700">{address.label}</p>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zip}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <CreditCard className="w-4 h-4 text-[#c8a97e]" />
                  <span className="capitalize">{order.paymentMethod === "cod" ? "Cash on Delivery" : "Credit Card"}</span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider mb-4">Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
                  {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discount.toFixed(2)}</span></div>}
                  <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{order.delivery === 0 ? "Free" : `$${order.delivery.toFixed(2)}`}</span></div>
                  <div className="flex justify-between text-gray-500"><span>Tax</span><span>${order.tax.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Items ({order.items.length})</h3>
              </div>
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#faf9f7] flex items-center justify-center text-[#c8a97e] font-bold text-sm">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
