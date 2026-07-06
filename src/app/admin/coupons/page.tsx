"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import Input from "@/components/ui/Input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Coupon } from "@/types/food";

export default function CouponsPage() {
  const { adminCoupons, addCoupon, updateCoupon, deleteCoupon } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<{ code: string; discount: number; type: "percentage" | "fixed"; minOrder: number }>({
    code: "", discount: 0, type: "percentage", minOrder: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditing(null);
    setForm({ code: "", discount: 0, type: "percentage", minOrder: 0 });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setForm({ code: coupon.code, discount: coupon.discount, type: coupon.type, minOrder: coupon.minOrder });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.code.trim()) errs.code = "Code is required";
    if (form.discount <= 0) errs.discount = "Discount must be greater than 0";
    if (form.minOrder < 0) errs.minOrder = "Minimum order cannot be negative";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateCoupon(editing.code, form);
    } else {
      addCoupon(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (code: string) => {
    if (confirm("Delete this coupon?")) deleteCoupon(code);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "code", label: "Code", sortable: true, render: (item) => (
      <span className="font-mono font-semibold text-[#c8a97e]">{String(item.code)}</span>
    )},
    { key: "discount", label: "Discount", sortable: true, render: (item) => (
      <span className="font-semibold">
        {String(item.type) === "percentage" ? `${Number(item.discount)}%` : `$${Number(item.discount).toFixed(2)}`}
      </span>
    )},
    { key: "type", label: "Type", render: (item) => (
      <span className="capitalize text-gray-500">{String(item.type)}</span>
    )},
    { key: "minOrder", label: "Min Order", render: (item) => (
      <span className="text-gray-500">${Number(item.minOrder).toFixed(2)}</span>
    )},
    { key: "actions", label: "", className: "w-24", render: (item) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(item as unknown as Coupon)} className="p-1.5 text-gray-400 hover:text-[#c8a97e] transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(String(item.code))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">{adminCoupons.length} active coupons</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </button>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={adminCoupons as unknown as Record<string, unknown>[]}
          searchable
          searchKey="code"
          searchPlaceholder="Search coupons..."
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Coupon" : "Add Coupon"}>
        <div className="space-y-5">
          <Input
            label="Coupon Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            error={errors.code}
            placeholder="SUMMER20"
            disabled={!!editing}
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-[#c8a97e]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              type="number"
              step="0.01"
              value={form.discount || ""}
              onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
              error={errors.discount}
              placeholder={form.type === "percentage" ? "20" : "5.00"}
            />
          </div>
          <Input
            label="Minimum Order ($)"
            type="number"
            step="0.01"
            value={form.minOrder || ""}
            onChange={(e) => setForm({ ...form, minOrder: parseFloat(e.target.value) || 0 })}
            error={errors.minOrder}
            placeholder="30.00"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
            >
              {editing ? "Update" : "Add"} Coupon
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
