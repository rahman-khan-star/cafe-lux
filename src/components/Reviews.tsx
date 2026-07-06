"use client";

import { motion } from "framer-motion";
import { reviews } from "@/data/foods";
import { Star, Quote } from "lucide-react";

export default function Reviews() {
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
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            Real stories from real guests
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-[#faf9f7] p-6 md:p-8 group hover:bg-[#c8a97e] transition-colors duration-300"
            >
              <Quote className="w-8 h-8 text-[#c8a97e]/30 group-hover:text-white/30 mb-4 transition-colors" />
              <p className="text-gray-600 group-hover:text-white/80 text-sm leading-relaxed mb-6 transition-colors">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? "fill-[#c8a97e] text-[#c8a97e] group-hover:fill-white group-hover:text-white"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-white/50"
                />
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-white text-sm transition-colors">
                    {review.name}
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-white/60 transition-colors">
                    {review.date}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
