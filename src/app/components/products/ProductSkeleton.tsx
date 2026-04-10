import Navigation from '@/app/components/layouts/Header';
export function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 animate-pulse">
          <div className="aspect-square bg-gray-100 rounded-[32px]" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-12 bg-gray-100 rounded w-1/2" />
            <div className="h-6 bg-gray-100 rounded w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}