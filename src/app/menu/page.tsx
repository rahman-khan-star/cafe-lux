"use client";

import { Suspense, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { foods, categories } from "@/data/foods";
import { useCart } from "@/context/CartContext";
import { Star, Clock, Plus, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function MenuContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItem } = useCart();

  const filtered = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        activeCategory === "all" || food.category === activeCategory;
      const matchesSearch =
        food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-[#c8a97e] text-sm font-medium tracking-[0.3em] uppercase">
              Our Menu
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mt-3 mb-4">
              Discover Our Flavors
            </h1>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Explore our carefully curated selection of handcrafted dishes and beverages
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-md mx-auto mt-10"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#faf9f7] border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:border-[#c8a97e] transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={`shrink-0 px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                activeCategory === "all"
                  ? "bg-[#c8a97e] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "bg-[#c8a97e] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No items found matching your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((food, i) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group bg-white shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <Link href={`/food/${food.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={food.image}
                        alt={food.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {food.badge && (
                        <span className="absolute top-2 left-2 bg-[#c8a97e] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-1">
                          {food.badge}
                        </span>
                      )}
                      {food.originalPrice && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[9px] font-bold px-2 py-1">
                          -{Math.round((1 - food.price / food.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1">
                      <Link href={`/food/${food.id}`}>
                        <h3 className="font-semibold text-gray-900 text-sm hover:text-[#c8a97e] transition-colors">
                          {food.name}
                        </h3>
                      </Link>
                      <span className="font-bold text-[#c8a97e] text-sm shrink-0 ml-2">
                        ${food.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-1">
                      {food.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Star className="w-3 h-3 fill-[#c8a97e] text-[#c8a97e]" />
                        <span className="text-gray-600 font-medium">{food.rating}</span>
                        <Clock className="w-3 h-3 ml-1" />
                        <span>{food.prepTime}m</span>
                      </div>
                      <button
                        onClick={() => addItem(food)}
                        className="w-8 h-8 bg-[#c8a97e]/10 hover:bg-[#c8a97e] text-[#c8a97e] hover:text-white rounded-full flex items-center justify-center transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />
      <Suspense fallback={
        <div className="pt-40 text-center">
          <div className="animate-pulse text-gray-400">Loading menu...</div>
        </div>
      }>
        <MenuContent />
      </Suspense>
      <Footer />
    </div>
  );
}
