"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  ShoppingCart,
  Users,
  Calendar,
  Ticket,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/reservations", label: "Reservations", icon: Calendar },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#1a1a2e] text-white z-40 transition-all duration-300 flex flex-col ${
        collapsed ? "w-[70px]" : "w-64"
      }`}
    >
      <div className={`p-5 border-b border-white/10 flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-9 h-9 bg-[#c8a97e] rounded-lg flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && (
          <span className="font-bold text-lg tracking-tight">
            Café<span className="text-[#c8a97e]">Lux</span>
            <span className="text-xs text-gray-400 font-normal ml-1">Admin</span>
          </span>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all relative ${
                collapsed ? "justify-center px-3" : ""
              } ${
                isActive
                  ? "text-[#c8a97e] bg-white/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="admin-nav"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#c8a97e]"
                />
              )}
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 py-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
