import type { OrderStatus } from "@/types/order";
import type { ReservationStatus } from "@/types/admin";

const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  preparing: { label: "Preparing", color: "bg-orange-100 text-orange-700" },
  ready: { label: "Ready", color: "bg-purple-100 text-purple-700" },
  "out-for-delivery": { label: "Out for Delivery", color: "bg-indigo-100 text-indigo-700" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
};

const reservationStatusConfig: Record<ReservationStatus, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700" },
  seated: { label: "Seated", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-600" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  const config = reservationStatusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

export const ORDER_STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "preparing", "ready", "out-for-delivery", "delivered"];

export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out-for-delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const RESERVATION_STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "seated", label: "Seated" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];
