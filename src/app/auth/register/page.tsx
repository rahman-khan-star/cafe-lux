"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Min 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register(form.name, form.email, form.password);
    if (res.success) router.push("/dashboard");
    else setErrors({ form: res.error || "Registration failed" });
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
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join Café Lux today</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-5">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">{errors.form}</div>
            )}
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="John Doe" />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} placeholder="you@example.com" />

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters"
                  className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#c8a97e] pr-10 ${errors.password ? "border-red-400" : "border-gray-300"}`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat password"
                className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#c8a97e] ${errors.confirm ? "border-red-400" : "border-gray-300"}`}
              />
              {errors.confirm && <p className="text-red-500 text-xs">{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <span className="animate-pulse">Creating account...</span> : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#c8a97e] font-semibold hover:underline">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
