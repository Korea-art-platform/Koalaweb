import Navigation from '@/app/components/layouts/Header';

export function ArtistDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 pb-32 px-6 animate-pulse">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[3/4] bg-gray-100 rounded-[3rem]" />
          <div className="space-y-6 pt-8">
            <div className="h-8 bg-gray-100 rounded w-1/4" />
            <div className="h-16 bg-gray-100 rounded w-3/4" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}