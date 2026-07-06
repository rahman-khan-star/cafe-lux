"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { User, Package, MapPin, LogOut, ChevronRight, Clock } from "lucide-react";
import type { Order, OrderStatus } from "@/types/order";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  pending: { color: "bg-yellow-100 text-yellow-700", label: "Pending" },
  confirmed: { color: "bg-blue-100 text-blue-700", label: "Confirmed" },
  preparing: { color: "bg-purple-100 text-purple-700", label: "Preparing" },
  ready: { color: "bg-indigo-100 text-indigo-700", label: "Ready" },
  "out-for-delivery": { color: "bg-orange-100 text-orange-700", label: "Out for Delivery" },
  delivered: { color: "bg-green-100 text-green-700", label: "Delivered" },
  cancelled: { color: "bg-red-100 text-red-700", label: "Cancelled" },
};

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
];

export default function DashboardPage() {
  const { user, orders, logout, addresses } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back, {user.name}</p>
            </div>
            <button onClick={() => { logout(); router.push("/"); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors border border-gray-200 hover:border-red-200">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm">
                <div className="p-6 border-b border-gray-100 text-center">
                  <img src={user.avatar || "https://i.pravatar.cc/100?img=11"} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover" />
                  <h2 className="font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
                <nav className="p-2 space-y-1">
                  {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id ? "bg-[#c8a97e]/10 text-[#c8a97e]" : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            <div className="lg:col-span-3">
              {activeTab === "overview" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white p-6 shadow-sm">
                      <Package className="w-8 h-8 text-[#c8a97e] mb-3" />
                      <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                      <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                    <div className="bg-white p-6 shadow-sm">
                      <Clock className="w-8 h-8 text-[#c8a97e] mb-3" />
                      <p className="text-2xl font-bold text-gray-900">{orders.filter((o) => o.status === "delivered").length}</p>
                      <p className="text-sm text-gray-500">Delivered</p>
                    </div>
                    <div className="bg-white p-6 shadow-sm">
                      <MapPin className="w-8 h-8 text-[#c8a97e] mb-3" />
                      <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                      <p className="text-sm text-gray-500">Saved Addresses</p>
                    </div>
                  </div>
                  <div className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <h3 className="font-semibold text-gray-900">Recent Orders</h3>
                      <button onClick={() => setActiveTab("orders")} className="text-sm text-[#c8a97e] hover:underline">View All</button>
                    </div>
                    {orders.slice(0, 3).map((order) => (
                      <Link key={order.id} href={`/dashboard/orders/${order.id}`}
                        className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{order.id}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${statusConfig[order.status].color}`}>
                            {statusConfig[order.status].label}
                          </span>
                          <span className="font-semibold text-gray-900 text-sm">${order.total.toFixed(2)}</span>
                          <ChevronRight className="w-4 h-4 text-gray-300" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "orders" && <OrdersTab orders={orders} statusConfig={statusConfig} />}
              {activeTab === "addresses" && <AddressesTab />}
              {activeTab === "profile" && <ProfileTab />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function OrdersTab({ orders, statusConfig: sc }: { orders: Order[]; statusConfig: Record<OrderStatus, { color: string; label: string }> }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white shadow-sm">
      {orders.length === 0 ? (
        <div className="p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <Link key={order.id} href={`/dashboard/orders/${order.id}`}
            className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="font-semibold text-gray-900">{order.id}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${sc[order.status].color}`}>
                  {sc[order.status].label}
                </span>
              </div>
              <p className="text-sm text-gray-500">{order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.deliveryMethod}</p>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
              <ChevronRight className="w-4 h-4 text-gray-300 ml-auto mt-1" />
            </div>
          </Link>
        ))
      )}
    </motion.div>
  );
}

function AddressesTab() {
  const { addresses, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: "", street: "", city: "", state: "", zip: "" });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({ ...form, isDefault: addresses.length === 0 });
    setForm({ label: "", street: "", city: "", state: "", zip: "" });
    setShowForm(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="text-sm px-4 py-2 bg-[#c8a97e] text-white font-medium hover:bg-[#b8945c] transition-colors">
          {showForm ? "Cancel" : "Add Address"}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 shadow-sm space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Label</label>
              <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home / Work"
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Street</label>
              <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Street address"
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">City</label>
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City"
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">State</label>
                <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="State"
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">ZIP</label>
                <input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="ZIP"
                  className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
              </div>
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-[#c8a97e] text-white text-sm font-semibold hover:bg-[#b8945c] transition-colors">Save Address</button>
        </form>
      )}
      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white p-5 shadow-sm flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900 text-sm">{addr.label}</span>
              {addr.isDefault && <span className="text-[10px] bg-[#c8a97e]/10 text-[#c8a97e] px-2 py-0.5 font-bold uppercase tracking-wider">Default</span>}
            </div>
            <p className="text-sm text-gray-500">{addr.street}</p>
            <p className="text-sm text-gray-500">{addr.city}, {addr.state} {addr.zip}</p>
          </div>
          <div className="flex items-center gap-2">
            {!addr.isDefault && <button onClick={() => setDefaultAddress(addr.id)} className="text-xs text-[#c8a97e] hover:underline">Set Default</button>}
            <button onClick={() => deleteAddress(addr.id)} className="text-xs text-red-500 hover:underline">Delete</button>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function ProfileTab() {
  const { user, updateProfile, changePassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone || "" });
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [passMsg, setPassMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile(profileForm);
    setMsg(res.success ? { type: "success", text: "Profile updated!" } : { type: "error", text: res.error || "Failed" });
    if (res.success) setEditing(false);
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirm) { setPassMsg({ type: "error", text: "Passwords do not match" }); return; }
    const res = await changePassword(passForm.current, passForm.newPass);
    setPassMsg(res.success ? { type: "success", text: "Password changed!" } : { type: "error", text: res.error || "Failed" });
    if (res.success) setPassForm({ current: "", newPass: "", confirm: "" });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Profile Information</h3>
          <button onClick={() => setEditing(!editing)} className="text-sm text-[#c8a97e] hover:underline">{editing ? "Cancel" : "Edit"}</button>
        </div>
        {msg && (<div className={`mb-4 px-4 py-3 text-sm ${msg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{msg.text}</div>)}
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Full Name</label>
              <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} disabled={!editing}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e] disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Email</label>
              <input value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} disabled={!editing}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e] disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Phone</label>
              <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} disabled={!editing}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e] disabled:bg-gray-50 disabled:text-gray-500" />
            </div>
          </div>
          {editing && <button type="submit" className="px-6 py-2.5 bg-[#c8a97e] text-white text-sm font-semibold hover:bg-[#b8945c] transition-colors">Save Changes</button>}
        </form>
      </div>
      <div className="bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-6">Change Password</h3>
        {passMsg && (<div className={`mb-4 px-4 py-3 text-sm ${passMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}>{passMsg.text}</div>)}
        <form onSubmit={handlePassword} className="max-w-md space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Current Password</label>
            <input type="password" value={passForm.current} onChange={(e) => setPassForm({ ...passForm, current: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">New Password</label>
              <input type="password" value={passForm.newPass} onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-gray-700 uppercase tracking-wide mb-1">Confirm</label>
              <input type="password" value={passForm.confirm} onChange={(e) => setPassForm({ ...passForm, confirm: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 text-sm focus:outline-none focus:border-[#c8a97e]" required />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">Update Password</button>
        </form>
      </div>
    </motion.div>
  );
}
