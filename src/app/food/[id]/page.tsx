"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { foods } from "@/data/foods";
import { useCart } from "@/context/CartContext";
import { Star, Clock, Flame, ChefHat, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function FoodDetailPage() {
  const params = useParams();
  const food = foods.find((f) => f.id === params.id);
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  if (!food) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-32">
          <h1 className="text-2xl font-bold text-gray-900">Item not found</h1>
          <Link href="/menu" className="text-[#c8a97e] mt-4 inline-block">
            Back to menu
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const cartItem = items.find((i) => i.food.id === food.id);

  const handleAdd = () => {
    addItem(food);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const categoryFoods = foods.filter((f) => f.category === food.category && f.id !== food.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Navbar />

      {/* Back link */}
      <div className="pt-28 pb-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#c8a97e] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="pb-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-72 sm:h-96 md:h-[500px] overflow-hidden"
            >
              <Image
                src={food.image}
                alt={food.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {food.badge && (
                <span className="absolute top-4 left-4 bg-[#c8a97e] text-white text-xs font-bold uppercase tracking-wider px-4 py-2">
                  {food.badge}
                </span>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <span className="text-[#c8a97e] text-xs font-medium tracking-[0.3em] uppercase mb-2">
                {food.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {food.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(food.rating)
                          ? "fill-[#c8a97e] text-[#c8a97e]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {food.rating} ({food.reviewCount} reviews)
                </span>
              </div>

              <p className="text-gray-500 leading-relaxed mb-8 text-lg">
                {food.description}
              </p>

              {/* Info boxes */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-[#faf9f7] p-4 text-center">
                  <Clock className="w-5 h-5 text-[#c8a97e] mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Prep Time</p>
                  <p className="font-semibold text-gray-900">{food.prepTime} min</p>
                </div>
                <div className="bg-[#faf9f7] p-4 text-center">
                  <Flame className="w-5 h-5 text-[#c8a97e] mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Calories</p>
                  <p className="font-semibold text-gray-900">{food.calories}</p>
                </div>
                <div className="bg-[#faf9f7] p-4 text-center">
                  <ChefHat className="w-5 h-5 text-[#c8a97e] mx-auto mb-2" />
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">{food.category}</p>
                </div>
              </div>

              {/* Price & Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <span className="text-3xl md:text-4xl font-bold text-[#c8a97e]">
                    ${food.price.toFixed(2)}
                  </span>
                  {food.originalPrice && (
                    <span className="ml-3 text-lg text-gray-400 line-through">
                      ${food.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAdd}
                className={`inline-flex items-center justify-center gap-3 px-10 py-4 font-semibold text-sm uppercase tracking-widest transition-all duration-300 ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[#c8a97e] hover:bg-[#b8945c] text-white hover:shadow-xl"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              {cartItem && cartItem.quantity > 0 && (
                <p className="text-sm text-gray-400 mt-3">
                  {cartItem.quantity} in cart
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="py-16 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ingredients
            </h2>
            <div className="flex flex-wrap gap-2">
              {food.ingredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="px-4 py-2 bg-white text-gray-700 text-sm shadow-sm"
                >
                  {ingredient}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Items */}
      {categoryFoods.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-2xl font-bold text-gray-900">
                More in {food.category}
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categoryFoods.map((related, i) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group bg-[#faf9f7] overflow-hidden hover:shadow-md transition-shadow"
                >
                  <Link href={`/food/${related.id}`}>
                    <div className="relative h-40 overflow-hidden">
                      <Image
                        src={related.image}
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/food/${related.id}`}>
                      <h3 className="font-semibold text-gray-900 text-sm hover:text-[#c8a97e] transition-colors">
                        {related.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-[#c8a97e] text-sm">
                        ${related.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Star className="w-3 h-3 fill-[#c8a97e] text-[#c8a97e]" />
                        {related.rating}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
