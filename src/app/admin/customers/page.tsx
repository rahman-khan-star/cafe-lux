"use client";

import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { Mail, Phone } from "lucide-react";

export default function CustomersPage() {
  const { customers, orders } = useAuth();

  const getCustomerOrders = (customerId: string) => orders.filter((o) => o.id.includes(customerId.slice(-1)));

  const columns: Column<Record<string, unknown>>[] = [
    { key: "avatar", label: "", className: "w-12", render: (item) => (
      <img src={String(item.avatar || "")} alt="" className="w-9 h-9 rounded-full object-cover" />
    )},
    { key: "name", label: "Customer", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-gray-900">{String(item.name)}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Mail className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-500">{String(item.email)}</span>
        </div>
      </div>
    )},
    { key: "phone", label: "Phone", render: (item) => (
      <div className="flex items-center gap-1.5 text-gray-500">
        <Phone className="w-3 h-3" />
        <span className="text-sm">{String(item.phone)}</span>
      </div>
    )},
    { key: "createdAt", label: "Joined", sortable: true, render: (item) => (
      <span className="text-gray-500 text-sm">{new Date(String(item.createdAt)).toLocaleDateString()}</span>
    )},
    { key: "totalSpent", label: "Total Spent", sortable: true, render: (item) => {
      const cust = item as unknown as { id: string };
      const custOrders = orders.filter((o) => {
        const cid = cust.id.replace("u", "");
        return o.id.includes(cid);
      });
      const total = custOrders.reduce((sum, o) => sum + o.total, 0);
      return <span className="font-semibold">${total.toFixed(2)}</span>;
    }},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-gray-500 mt-1">{customers.length} registered customers</p>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={customers as unknown as Record<string, unknown>[]}
          searchable
          searchKey="name"
          searchPlaceholder="Search customers..."
        />
      </div>
    </div>
  );
}
