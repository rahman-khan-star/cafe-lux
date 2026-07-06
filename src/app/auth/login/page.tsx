"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/ui/Input";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await login(form.email, form.password);
    if (res.success) router.push("/dashboard");
    else setErrors({ form: res.error || "Login failed" });
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#c8a97e] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                Café<span className="text-[#c8a97e]">Lux</span>
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm space-y-5">
            {errors.form && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
                {errors.form}
              </div>
            )}

            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="you@example.com"
            />

            <div className="space-y-1.5">
              <label className="block text-[11px] font-medium text-gray-700 tracking-wide uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#c8a97e] pr-10 ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500">
                <input type="checkbox" className="accent-[#c8a97e]" /> Remember me
              </label>
              <Link href="/auth/forgot-password" className="text-[#c8a97e] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-[#c8a97e] font-semibold hover:underline">
                Create one
              </Link>
            </p>

            <div className="border-t border-gray-100 pt-4 text-center">
              <p className="text-xs text-gray-400">
                Demo: alex@example.com / password
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
