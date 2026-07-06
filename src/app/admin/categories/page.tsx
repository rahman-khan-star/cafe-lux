"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import Input from "@/components/ui/Input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types/food";

export default function CategoriesPage() {
  const { menuCategories, addCategory, updateCategory, deleteCategory } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<{ name: string; icon: string; description: string }>({ name: "", icon: "", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", icon: "", description: "" });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon, description: cat.description });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.icon.trim()) errs.icon = "Icon is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editing) {
      updateCategory(editing.id, form);
    } else {
      addCategory({ ...form, id: form.name.toLowerCase().replace(/\s+/g, "-") });
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) deleteCategory(id);
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "icon", label: "Icon", className: "w-16", render: (item) => (
      <span className="text-2xl">{String(item.icon)}</span>
    )},
    { key: "name", label: "Name", sortable: true, render: (item) => (
      <span className="font-medium text-gray-900">{String(item.name)}</span>
    )},
    { key: "description", label: "Description", render: (item) => (
      <span className="text-gray-500">{String(item.description)}</span>
    )},
    { key: "actions", label: "", className: "w-24", render: (item) => (
      <div className="flex items-center gap-1">
        <button onClick={() => openEdit(item as unknown as Category)} className="p-1.5 text-gray-400 hover:text-[#c8a97e] transition-colors">
          <Pencil className="w-4 h-4" />
        </button>
        <button onClick={() => handleDelete(String(item.id))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">{menuCategories.length} categories</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={menuCategories as unknown as Record<string, unknown>[]}
          searchable
          searchKey="name"
          searchPlaceholder="Search categories..."
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Category" : "Add Category"}>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Coffee"
            />
            <Input
              label="Icon (emoji)"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              error={errors.icon}
              placeholder="☕"
            />
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Handcrafted coffee blends"
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
            >
              {editing ? "Update" : "Add"} Category
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
