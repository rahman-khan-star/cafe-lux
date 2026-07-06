"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  error?: string;
}

export default function ImageUpload({ value, onChange, label = "Image URL", error }: ImageUploadProps) {
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 tracking-wide uppercase text-[11px]">
        {label}
      </label>

      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={preview}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className={`flex-1 px-4 py-3 bg-white border text-gray-900 text-sm placeholder:text-gray-400 transition-colors focus:outline-none focus:border-[#c8a97e] ${
            error ? "border-red-400" : "border-gray-300"
          }`}
        />
        <label className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium transition-colors cursor-pointer flex items-center gap-2 shrink-0">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline">Upload</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {preview && (
        <div className="relative inline-block mt-2">
          <img
            src={preview}
            alt="Preview"
            className="w-24 h-24 object-cover border border-gray-200"
            onError={() => setPreview("")}
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {!preview && (
        <div className="w-24 h-24 border-2 border-dashed border-gray-200 flex items-center justify-center mt-2">
          <ImageIcon className="w-8 h-8 text-gray-300" />
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
