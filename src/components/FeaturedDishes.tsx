"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { foods } from "@/data/foods";
import { useCart } from "@/context/CartContext";
import { Star, Clock, Plus } from "lucide-react";

const featured = foods.filter((f) => f.featured).slice(0, 6);

export default function FeaturedDishes() {
  const { addItem } = useCart();

  return (
    <section className="py-24 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#c8a97e] text-sm font-medium tracking-[0.3em] uppercase">
                From Our Kitchen
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Featured Dishes
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Signature creations our chefs are proud to serve
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((food, i) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group bg-white shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={food.image}
                  alt={food.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
                {food.badge && (
                  <span className="absolute top-3 left-3 bg-[#c8a97e] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                    {food.badge}
                  </span>
                )}
                <button
                  onClick={() => addItem(food)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#c8a97e] hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <Link href={`/food/${food.id}`}>
                    <h3 className="font-bold text-gray-900 text-lg hover:text-[#c8a97e] transition-colors">
                      {food.name}
                    </h3>
                  </Link>
                  <div className="text-right">
                    <span className="font-bold text-lg text-[#c8a97e]">
                      ${food.price.toFixed(2)}
                    </span>
                    {food.originalPrice && (
                      <span className="block text-xs text-gray-400 line-through">
                        ${food.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {food.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#c8a97e] text-[#c8a97e]" />
                    <span className="font-medium text-gray-700">{food.rating}</span>
                    <span>({food.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{food.prepTime} min</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-[#c8a97e] font-semibold hover:text-[#b8945c] transition-colors uppercase text-sm tracking-widest"
          >
            View Full Menu
            <span className="text-lg">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
