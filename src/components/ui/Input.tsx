"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-gray-700 tracking-wide uppercase text-[11px]">
          {label}
        </label>
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#c8a97e] ${
            error ? "border-red-400" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export default Input;
