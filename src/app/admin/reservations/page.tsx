"use client";

import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { ReservationStatusBadge, RESERVATION_STATUS_OPTIONS } from "@/components/admin/StatusBadge";
import type { Reservation, ReservationStatus } from "@/types/admin";

export default function ReservationsPage() {
  const { reservations, updateReservationStatus } = useAuth();

  const handleStatusChange = (id: string, status: ReservationStatus) => {
    updateReservationStatus(id, status);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "customerName", label: "Customer", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-gray-900">{String(item.customerName)}</p>
        <p className="text-xs text-gray-500">{String(item.customerEmail)}</p>
      </div>
    )},
    { key: "date", label: "Date", sortable: true, render: (item) => (
      <span className="text-sm">{String(item.date)}</span>
    )},
    { key: "time", label: "Time", sortable: true, render: (item) => (
      <span className="text-sm font-medium">{String(item.time)}</span>
    )},
    { key: "guests", label: "Guests", render: (item) => (
      <span className="text-sm">{Number(item.guests)} people</span>
    )},
    { key: "status", label: "Status", render: (item) => (
      <ReservationStatusBadge status={item.status as ReservationStatus} />
    )},
    { key: "notes", label: "Notes", render: (item) => (
      <span className="text-sm text-gray-500 truncate max-w-[200px] block">{String(item.notes || "—")}</span>
    )},
    { key: "actions", label: "", className: "w-40", render: (item) => {
      const res = item as unknown as Reservation;
      return (
        <select
          value={res.status}
          onChange={(e) => handleStatusChange(res.id, e.target.value as ReservationStatus)}
          className="text-xs border border-gray-200 px-2 py-1.5 bg-white focus:outline-none focus:border-[#c8a97e]"
        >
          {RESERVATION_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
        <p className="text-sm text-gray-500 mt-1">{reservations.length} total reservations</p>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={reservations as unknown as Record<string, unknown>[]}
          searchable
          searchKey="customerName"
          searchPlaceholder="Search by customer name..."
        />
      </div>
    </div>
  );
}
