"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] max-h-[1000px] lg:h-[100vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/CAFABACK.png"
          alt="The Club Cafe exterior"
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: "center 40%" }}
        />
      </div>

      {/* Gradient overlay — stronger on left for text readability, lighter on right to show the café */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
      {/* Subtle bottom gradient for scroll indicator area */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Hero Content — Left-aligned editorial composition */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="max-w-[560px] lg:max-w-[620px] ml-[8%] lg:ml-[10%]">
          {/* Eyebrow text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex items-center gap-4 mb-6 lg:mb-8"
          >
            <span className="w-8 h-[1px] bg-[#c8a97e]" />
            <span className="text-[#c8a97e] text-[11px] lg:text-xs font-medium tracking-[0.25em] uppercase">
              Welcome to The Club Cafe
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="font-[family-name:var(--font-playfair)] text-[clamp(2.5rem,5.5vw,5.125rem)] font-medium leading-[1.08] tracking-[-0.01em] text-[#f5f0e8] mb-5 lg:mb-6"
          >
            Good Coffee.
            <br />
            Better Company.
          </motion.h1>

          {/* Supporting text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-[15px] lg:text-[17px] text-white/65 leading-relaxed mb-8 lg:mb-10 max-w-[420px]"
          >
            Peshawar&apos;s café experience in a warm, modern and welcoming setting.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-3 lg:gap-4"
          >
            <Link
              href="/menu"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-[#1a1a2e] text-[13px] font-semibold uppercase tracking-[0.12em] rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#c8a97e]/20"
            >
              View Menu
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              href="#about"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-white/25 hover:border-white/45 text-[#f5f0e8]/80 hover:text-[#f5f0e8] text-[13px] font-medium uppercase tracking-[0.12em] rounded-full transition-all duration-300"
            >
              Visit Us
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — bottom left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-6 lg:left-10 z-10"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-1.5"
          >
            <div className="w-[1.5px] h-2 bg-white/50 rounded-full" />
          </motion.div>
          <span className="text-[10px] text-white/40 font-medium tracking-[0.2em] uppercase">
            Scroll Down
          </span>
        </div>
      </motion.div>
    </section>
  );
}
