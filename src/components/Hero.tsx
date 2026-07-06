"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&q=85')",
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Decorative corner accents */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t-2 border-l-2 border-[#c8a97e]/50" />
      <div className="absolute top-12 right-12 w-24 h-24 border-t-2 border-r-2 border-[#c8a97e]/50" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-b-2 border-l-2 border-[#c8a97e]/50" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b-2 border-r-2 border-[#c8a97e]/50" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block text-[#c8a97e] text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-6">
            Welcome to Café Lux
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6"
        >
          Where Every
          <br />
          <span className="text-[#c8a97e]">Flavor</span> Tells a Story
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Indulge in handcrafted cuisine made with the finest ingredients.
          From artisanal coffee to gourmet dishes — every bite is an experience.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/menu"
            className="px-10 py-4 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:shadow-xl hover:shadow-[#c8a97e]/25"
          >
            Order Now
          </Link>
          <Link
            href="/menu"
            className="px-10 py-4 border-2 border-white/30 hover:border-white/60 text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 hover:bg-white/10"
          >
            View Menu
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
