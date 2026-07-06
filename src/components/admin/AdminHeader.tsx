"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, ExternalLink } from "lucide-react";

export default function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-gray-900">Admin Panel</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#c8a97e] transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>

        <div className="w-px h-6 bg-gray-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-[11px] text-gray-400">{user?.email}</p>
          </div>
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
        </div>

        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
