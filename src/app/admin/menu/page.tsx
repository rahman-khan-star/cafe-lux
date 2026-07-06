"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import DataTable, { type Column } from "@/components/admin/DataTable";
import Modal from "@/components/admin/Modal";
import ImageUpload from "@/components/admin/ImageUpload";
import Input from "@/components/ui/Input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Food } from "@/types/food";

const emptyFood: Food = {
  id: "", name: "", description: "", price: 0, rating: 0, reviewCount: 0,
  prepTime: 0, calories: 0, ingredients: [], image: "", category: "",
};

export default function MenuPage() {
  const { menuItems, menuCategories, addMenuItem, updateMenuItem, deleteMenuItem } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Food | null>(null);
  const [form, setForm] = useState<Food>(emptyFood);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientsInput, setIngredientsInput] = useState("");

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyFood, id: `food-${Date.now()}` });
    setIngredientsInput("");
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item: Food) => {
    setEditing(item);
    setForm({ ...item });
    setIngredientsInput(item.ingredients.join(", "));
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.description.trim()) errs.description = "Description is required";
    if (form.price <= 0) errs.price = "Price must be greater than 0";
    if (!form.category) errs.category = "Category is required";
    if (!form.image.trim()) errs.image = "Image is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const item = { ...form, ingredients: ingredientsInput.split(",").map((s) => s.trim()).filter(Boolean) };
    if (editing) {
      updateMenuItem(editing.id, item);
    } else {
      addMenuItem(item);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this menu item?")) deleteMenuItem(id);
  };

  const columns: Column<Record<string, unknown>>[] = [
    {
      key: "image", label: "", className: "w-12",
      render: (item) => (
        <img src={String(item.image)} alt="" className="w-10 h-10 object-cover" />
      ),
    },
    { key: "name", label: "Name", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-gray-900">{String(item.name)}</p>
        <p className="text-xs text-gray-400 capitalize">{String(item.category)}</p>
      </div>
    )},
    { key: "price", label: "Price", sortable: true, render: (item) => (
      <span className="font-semibold">${Number(item.price).toFixed(2)}</span>
    )},
    { key: "rating", label: "Rating", sortable: true, render: (item) => (
      <span>{Number(item.rating)} / 5</span>
    )},
    { key: "prepTime", label: "Prep", render: (item) => (
      <span>{Number(item.prepTime)} min</span>
    )},
    { key: "actions", label: "", className: "w-24",
      render: (item) => (
        <div className="flex items-center gap-1">
          <button onClick={() => openEdit(item as unknown as Food)} className="p-1.5 text-gray-400 hover:text-[#c8a97e] transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          <button onClick={() => handleDelete(String(item.id))} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Items</h1>
          <p className="text-sm text-gray-500 mt-1">{menuItems.length} items in your menu</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={menuItems as unknown as Record<string, unknown>[]}
          searchable
          searchKey="name"
          searchPlaceholder="Search menu items..."
        />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Menu Item" : "Add Menu Item"} maxWidth="max-w-2xl">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
              placeholder="Truffle Wagyu Burger"
            />
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={form.price || ""}
              onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
              error={errors.price}
              placeholder="18.99"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#c8a97e] resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`}
              placeholder="Describe the dish..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm focus:outline-none focus:border-[#c8a97e] ${errors.category ? "border-red-400" : "border-gray-300"}`}
              >
                <option value="">Select</option>
                {menuCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>
            <Input
              label="Prep Time (min)"
              type="number"
              value={form.prepTime || ""}
              onChange={(e) => setForm({ ...form, prepTime: parseInt(e.target.value) || 0 })}
              placeholder="15"
            />
            <Input
              label="Calories"
              type="number"
              value={form.calories || ""}
              onChange={(e) => setForm({ ...form, calories: parseInt(e.target.value) || 0 })}
              placeholder="500"
            />
          </div>
          <Input
            label="Ingredients (comma separated)"
            value={ingredientsInput}
            onChange={(e) => setIngredientsInput(e.target.value)}
            placeholder="Beef, Lettuce, Tomato"
          />
          <div className="grid sm:grid-cols-2 gap-5">
            <Input
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating || ""}
              onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 0 })}
              placeholder="4.5"
            />
            <Input
              label="Badge"
              value={form.badge || ""}
              onChange={(e) => setForm({ ...form, badge: e.target.value })}
              placeholder="Popular, New, etc."
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={form.featured || false}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="accent-[#c8a97e]"
            />
            Featured item
          </label>
          <ImageUpload
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            error={errors.image}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
            >
              {editing ? "Update" : "Add"} Item
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
