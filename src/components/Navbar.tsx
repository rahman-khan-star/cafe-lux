"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Search, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/#about", label: "About" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reservation", label: "Reservation" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/60 backdrop-blur-lg border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6C8 4.89543 8.89543 4 10 4H22C23.1046 4 24 4.89543 24 6V8C24 12.4183 20.4183 16 16 16C11.5817 16 8 12.4183 8 8V6Z" fill="#c8a97e" opacity="0.9"/>
              <path d="M6 18C6 16.8954 6.89543 16 8 16H24C25.1046 16 26 16.8954 26 18V20C26 24.4183 22.4183 28 18 28C13.5817 28 10 24.4183 10 20V18H6Z" fill="#c8a97e"/>
              <path d="M4 20C4 20 5 19 8 19C11 19 12 20 12 20" stroke="#c8a97e" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
            <span className={`font-semibold text-lg tracking-wide transition-colors duration-300 ${
              scrolled ? "text-white" : "text-white"
            }`}>
              The Club <span className="text-[#c8a97e] font-bold">Cafe</span>
            </span>
          </Link>

          {/* Desktop Nav - Centered */}
          <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("?")[0]);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-[0.12em] uppercase transition-colors duration-300 ${
                    isActive
                      ? "text-[#c8a97e]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="navIndicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#c8a97e] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-1">
            <button className={`p-2.5 rounded-full transition-colors duration-300 ${
              scrolled ? "text-white/70 hover:text-white hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}>
              <Search className="w-[18px] h-[18px]" />
            </button>

            <Link
              href="/cart"
              className={`relative p-2.5 rounded-full transition-colors duration-300 ${
                scrolled ? "text-white/70 hover:text-white hover:bg-white/10" : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <ShoppingCart className="w-[18px] h-[18px]" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#c8a97e] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-full transition-colors duration-300 text-white/70 hover:text-white hover:bg-white/10"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-black/70 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href.split("?")[0]);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-300 border-l-2 pl-4 ${
                      isActive
                        ? "text-[#c8a97e] border-[#c8a97e]"
                        : "text-white/60 border-transparent hover:text-white hover:border-white/30"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
