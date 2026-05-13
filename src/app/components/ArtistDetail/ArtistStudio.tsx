import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtistStudioProps {
  studioImages?: string[];
  artistName?: string;
}

export function ArtistStudio({ studioImages, artistName }: ArtistStudioProps) {
  if (!studioImages || studioImages.length === 0) return null;
  const images = studioImages;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest mb-4">
        작업실 Studio
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((src, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={src}
              alt={`${artistName ?? '작가'} 작업실 ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
