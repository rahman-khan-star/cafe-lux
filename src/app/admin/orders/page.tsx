"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { OrderStatusBadge, ORDER_STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import Modal from "@/components/admin/Modal";
import type { Order, OrderStatus } from "@/types/order";

export default function OrdersPage() {
  const { orders, updateOrderStatus } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    }
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "id", label: "Order ID", sortable: true, render: (item) => (
      <button onClick={() => openDetail(item as unknown as Order)} className="font-mono font-semibold text-[#c8a97e] hover:underline">
        {String(item.id)}
      </button>
    )},
    { key: "total", label: "Total", sortable: true, render: (item) => (
      <span className="font-semibold">${Number(item.total).toFixed(2)}</span>
    )},
    { key: "status", label: "Status", render: (item) => (
      <OrderStatusBadge status={item.status as OrderStatus} />
    )},
    { key: "deliveryMethod", label: "Type", render: (item) => (
      <span className="capitalize text-gray-500">{String(item.deliveryMethod)}</span>
    )},
    { key: "paymentMethod", label: "Payment", render: (item) => (
      <span className="uppercase text-xs text-gray-500">{String(item.paymentMethod)}</span>
    )},
    { key: "createdAt", label: "Date", sortable: true, render: (item) => (
      <span className="text-gray-500">{new Date(String(item.createdAt)).toLocaleDateString()}</span>
    )},
    { key: "actions", label: "", className: "w-32", render: (item) => {
      const order = item as unknown as Order;
      const nextStatus = getNextStatus(order.status);
      return (
        <div className="flex items-center gap-1">
          {nextStatus && (
            <button
              onClick={() => handleStatusChange(order.id, nextStatus)}
              className="px-3 py-1 bg-[#c8a97e]/10 text-[#c8a97e] text-xs font-medium hover:bg-[#c8a97e] hover:text-white transition-colors"
            >
              {ORDER_STATUS_OPTIONS.find((s) => s.value === nextStatus)?.label}
            </button>
          )}
          <button
            onClick={() => openDetail(order)}
            className="px-3 py-1 text-gray-500 text-xs font-medium hover:text-gray-900 transition-colors"
          >
            View
          </button>
        </div>
      );
    }},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={orders as unknown as Record<string, unknown>[]}
          searchable
          searchKey="id"
          searchPlaceholder="Search by order ID..."
        />
      </div>

      <Modal isOpen={detailOpen} onClose={() => setDetailOpen(false)} title={`Order ${selectedOrder?.id || ""}`} maxWidth="max-w-2xl">
        {selectedOrder && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <OrderStatusBadge status={selectedOrder.status} />
              <span className="text-sm text-gray-500">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Update Status</h4>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleStatusChange(selectedOrder.id, opt.value)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedOrder.status === opt.value
                        ? "bg-[#c8a97e] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Delivery</h4>
                <p className="text-sm text-gray-700 capitalize">{selectedOrder.deliveryMethod}</p>
                <p className="text-xs text-gray-500 mt-1">ETA: {new Date(selectedOrder.estimatedDelivery).toLocaleTimeString()}</p>
              </div>
              <div className="bg-gray-50 p-4">
                <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Payment</h4>
                <p className="text-sm text-gray-700 uppercase">{selectedOrder.paymentMethod}</p>
                {selectedOrder.couponCode && (
                  <p className="text-xs text-green-600 mt-1">Coupon: {selectedOrder.couponCode}</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">Items</h4>
              <div className="divide-y divide-gray-100 border border-gray-200">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity} &middot; ${item.price.toFixed(2)} each</p>
                    </div>
                    <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${selectedOrder.subtotal.toFixed(2)}</span></div>
              {selectedOrder.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${selectedOrder.discount.toFixed(2)}</span></div>}
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>${selectedOrder.delivery.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>${selectedOrder.tax.toFixed(2)}</span></div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900"><span>Total</span><span>${selectedOrder.total.toFixed(2)}</span></div>
            </div>

            {selectedOrder.notes && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-700">
                <strong>Notes:</strong> {selectedOrder.notes}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const flow: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"];
  const idx = flow.indexOf(current);
  if (idx === -1 || idx === flow.length - 1) return null;
  return flow[idx + 1];
}
