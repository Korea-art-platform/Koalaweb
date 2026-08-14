import Navigation from '@/app/components/layouts/Header';

export function CartSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />
      <div className="pt-24 pb-16 px-8">
        <div className="max-w-[1200px] mx-auto animate-pulse">
          <div className="h-10 bg-gray-100 rounded w-1/4 mb-4" />
          <div className="h-4 bg-gray-100 rounded w-1/3 mb-12" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-40" />
              ))}
            </div>
            <div className="bg-white rounded-2xl p-8 h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}
