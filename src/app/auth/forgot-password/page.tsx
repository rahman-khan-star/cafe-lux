"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#c8a97e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Café<span className="text-[#c8a97e]">Lux</span></span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Forgot Password</h1>
            <p className="text-gray-500 mt-2">We'll send you a reset link</p>
          </div>

          {sent ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white p-8 shadow-sm text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-500 text-sm mb-6">
                We've sent a password reset link to <strong className="text-gray-700">{email}</strong>
              </p>
              <Link href="/auth/login" className="text-[#c8a97e] font-semibold hover:underline text-sm">
                Back to Sign In
              </Link>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-5">
              <Input label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} placeholder="you@example.com" />
              <button type="submit" className="w-full py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Reset Link
              </button>
              <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#c8a97e] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Sign In
              </Link>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
