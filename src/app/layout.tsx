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
  title: "Café Lux | Premium Dining Experience",
  description:
    "Indulge in handcrafted cuisine made with the finest ingredients. From artisanal coffee to gourmet dishes — every bite is an experience.",
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
    title: "Café Lux | Premium Dining Experience",
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
