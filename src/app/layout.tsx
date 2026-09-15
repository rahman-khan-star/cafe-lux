import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
title: "The Club Cafe | Peshawar",
    description:
      "Good coffee. Better company. Peshawar's café experience in a warm, modern and welcoming setting.",
  keywords: [
    "cafe",
    "restaurant",
    "fine dining",
    "coffee",
    "gourmet",
    "breakfast",
    "burgers",
    "pizza",
    "desserts",
  ],
  openGraph: {
title: "The Club Cafe | Peshawar",
    description:
      "Indulge in handcrafted cuisine made with the finest ingredients.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
