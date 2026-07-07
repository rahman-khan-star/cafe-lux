"use client";

import Link from "next/link";
import { Clock, Phone, MapPin, Globe, Camera, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-5">
              <span className="font-bold text-xl">
                Café<span className="text-[#c8a97e]">Lux</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium dining experience since 2018. Handcrafted cuisine,
              artisanal coffee, and unforgettable moments.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-[#c8a97e]/20 hover:bg-[#c8a97e] rounded-full flex items-center justify-center transition-colors"
              >
                <Camera className="w-4 h-4 text-[#c8a97e] hover:text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-[#c8a97e]/20 hover:bg-[#c8a97e] rounded-full flex items-center justify-center transition-colors"
              >
                <Globe className="w-4 h-4 text-[#c8a97e] hover:text-white" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-[#c8a97e]/20 hover:bg-[#c8a97e] rounded-full flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#c8a97e] hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#c8a97e]">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "Our Menu", href: "/menu" },
                { label: "About Us", href: "/#about" },
                { label: "Gallery", href: "/#gallery" },
                { label: "Reservation", href: "/#reservation" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#c8a97e] text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#c8a97e]">
              Opening Hours
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c8a97e]" />
                <span>Mon - Fri: 7:00 AM - 11:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c8a97e]" />
                <span>Saturday: 8:00 AM - 12:00 AM</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#c8a97e]" />
                <span>Sunday: 8:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-5 text-[#c8a97e]">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#c8a97e] mt-0.5 shrink-0" />
                <span>
                  123 Gourmet Street, Culinary District, New York, NY 10001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c8a97e] shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} Café Lux. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-[#c8a97e] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#c8a97e] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
