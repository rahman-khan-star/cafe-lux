"use client";

import { motion } from "framer-motion";
import { categories } from "@/data/foods";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedCategories() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-[#c8a97e] text-sm font-medium tracking-[0.3em] uppercase">
            Explore
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Featured Categories
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Discover our carefully curated selection of culinary delights
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
        >
          {categories.map((cat) => (
            <motion.div key={cat.id} variants={itemVariants}>
              <Link
                href={`/menu?category=${cat.id}`}
                className="group flex flex-col items-center p-6 md:p-8 bg-[#faf9f7] hover:bg-[#c8a97e] transition-all duration-300 hover:shadow-xl"
              >
                <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </span>
                <h3 className="font-semibold text-gray-900 group-hover:text-white transition-colors text-sm md:text-base">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-400 group-hover:text-white/70 transition-colors mt-1 text-center hidden md:block">
                  {cat.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
