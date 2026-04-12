import Navigation from '@/app/components/layouts/Header';

export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-28 pb-20 px-8">
        <div className="max-w-5xl mx-auto">
          {/* Back button skeleton */}
          <div className="h-4 w-24 bg-gray-100 rounded mb-10 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-10 animate-pulse">
            {/* Image area */}
            <div className="flex gap-3">
              {/* Thumbnails */}
              <div className="flex flex-col gap-2 w-[68px]">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-[68px] h-[68px] rounded-xl bg-gray-100" />
                ))}
              </div>
              {/* Main image */}
              <div className="flex-1 aspect-square rounded-2xl bg-gray-100" />
            </div>

            {/* Info area */}
            <div className="space-y-4 pt-2">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-gray-100 rounded" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-gray-100 rounded" />
              <div className="h-4 w-1/3 bg-gray-100 rounded" />
              <div className="h-8 w-1/2 bg-gray-100 rounded mt-2" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
              <div className="flex gap-2 pt-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-100" />
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
              <div className="flex gap-2.5 pt-4">
                <div className="flex-1 h-12 bg-gray-100 rounded-xl" />
                <div className="w-[52px] h-[52px] bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
