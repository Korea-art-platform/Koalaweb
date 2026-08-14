export default function ArtistListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 animate-pulse">
          <div className="aspect-[4/5] bg-gray-100 rounded-3xl" />
          <div className="space-y-4 pt-8">
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="h-10 bg-gray-100 rounded w-3/4" />
            <div className="h-20 bg-gray-100 rounded" />
            <div className="aspect-video bg-gray-100 rounded-2xl mt-6" />
          </div>
        </div>
      ))}
    </>
  );
}
