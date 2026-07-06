import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-bold text-[#c8a97e] mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos; exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-8 py-3 bg-[#c8a97e] hover:bg-[#b8945c] text-white font-semibold text-sm uppercase tracking-widest transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
