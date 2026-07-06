"use client";

import { useAuth } from "@/context/AuthContext";
import StatsCard from "@/components/admin/StatsCard";
import { DollarSign, ShoppingCart, Users, Calendar, UtensilsCrossed } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const revenueData = [
  { month: "Jul", revenue: 8200, orders: 142 },
  { month: "Aug", revenue: 9100, orders: 158 },
  { month: "Sep", revenue: 7800, orders: 131 },
  { month: "Oct", revenue: 10200, orders: 176 },
  { month: "Nov", revenue: 11500, orders: 198 },
  { month: "Dec", revenue: 12800, orders: 220 },
];

const ordersByStatus = [
  { name: "Pending", value: 8, color: "#FBBF24" },
  { name: "Preparing", value: 5, color: "#F97316" },
  { name: "Delivered", value: 42, color: "#22C55E" },
  { name: "Cancelled", value: 3, color: "#EF4444" },
];

const popularFoods = [
  { name: "Truffle Wagyu Burger", orders: 234, revenue: 4442 },
  { name: "Margherita Classica", orders: 312, revenue: 5145 },
  { name: "Lavender Latte", orders: 156, revenue: 1090 },
  { name: "Classic Tiramisu", orders: 187, revenue: 1868 },
  { name: "Avocado Smash Toast", orders: 203, revenue: 2637 },
];

export default function AdminDashboardPage() {
  const { orders, customers, reservations, menuItems } = useAuth();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalReservations = reservations.length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          change={12.5}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
        />
        <StatsCard
          title="Total Orders"
          value={totalOrders}
          change={8.2}
          icon={ShoppingCart}
          color="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Customers"
          value={totalCustomers}
          change={15.3}
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Reservations"
          value={totalReservations}
          change={-3.1}
          icon={Calendar}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#c8a97e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {ordersByStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                {item.name} ({item.value})
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Popular Foods</h3>
          <div className="space-y-3">
            {popularFoods.map((food, idx) => (
              <div key={food.name} className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{food.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#c8a97e] h-1.5 rounded-full"
                        style={{ width: `${(food.orders / popularFoods[0].orders) * 100}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0">{food.orders} orders</span>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 shrink-0">${food.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">Orders Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "8px" }}
              />
              <Line type="monotone" dataKey="orders" stroke="#c8a97e" strokeWidth={2} dot={{ fill: "#c8a97e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
