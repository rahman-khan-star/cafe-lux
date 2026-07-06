"use client";

import { useState, useEffect } from "react";
import { reviews as allReviews } from "@/data/foods";
import DataTable, { type Column } from "@/components/admin/DataTable";
import { Star, Trash2 } from "lucide-react";

export default function ReviewsPage() {
  const [reviewList, setReviewList] = useState(allReviews);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());

  const visibleReviews = reviewList.filter((r) => !deletedIds.has(r.id));

  const handleDelete = (id: string) => {
    if (confirm("Delete this review?")) {
      setDeletedIds((prev) => new Set(prev).add(id));
    }
  };

  const columns: Column<Record<string, unknown>>[] = [
    { key: "avatar", label: "", className: "w-12", render: (item) => (
      <img src={String(item.avatar)} alt="" className="w-9 h-9 rounded-full object-cover" />
    )},
    { key: "name", label: "Customer", sortable: true, render: (item) => (
      <div>
        <p className="font-medium text-gray-900">{String(item.name)}</p>
        <p className="text-xs text-gray-500">{String(item.date)}</p>
      </div>
    )},
    { key: "rating", label: "Rating", sortable: true, render: (item) => (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < Number(item.rating) ? "fill-[#c8a97e] text-[#c8a97e]" : "text-gray-200"}`}
          />
        ))}
        <span className="text-sm ml-1">{Number(item.rating)}</span>
      </div>
    )},
    { key: "comment", label: "Comment", render: (item) => (
      <p className="text-sm text-gray-600 line-clamp-2 max-w-md">{String(item.comment)}</p>
    )},
    { key: "actions", label: "", className: "w-16", render: (item) => (
      <button
        onClick={() => handleDelete(String(item.id))}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    )},
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">{visibleReviews.length} customer reviews</p>
      </div>

      <div className="bg-white shadow-sm p-6">
        <DataTable
          columns={columns}
          data={visibleReviews as unknown as Record<string, unknown>[]}
          searchable
          searchKey="name"
          searchPlaceholder="Search reviews..."
        />
      </div>
    </div>
  );
}
