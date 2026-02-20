'use client';

export default function LandmarkLoading() {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-white">
      <div className="bg-walkavel-gray-100 relative h-100 w-full animate-pulse" />

      <div className="space-y-8 px-6 py-8">
        <div className="space-y-3">
          <div className="bg-walkavel-gray-100 h-8 w-2/3 animate-pulse rounded-lg" />
          <div className="bg-walkavel-gray-100 h-5 w-1/3 animate-pulse rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="bg-walkavel-gray-100 h-6 w-6 animate-pulse rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="bg-walkavel-gray-100 h-4 w-1/4 animate-pulse rounded" />
                <div className="bg-walkavel-gray-100 h-4 w-3/4 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
