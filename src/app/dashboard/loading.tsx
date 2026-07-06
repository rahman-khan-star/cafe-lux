export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="pt-28 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 shadow-sm">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mt-3" />
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
        <div className="bg-white p-6 shadow-sm">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b border-gray-50">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
