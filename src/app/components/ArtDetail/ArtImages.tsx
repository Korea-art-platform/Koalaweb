import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">작품 - 상세</p>
      {images.length === 1 ? (
        <div className="w-full aspect-square bg-gray-100 overflow-hidden">
          <ImageWithFallback
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              className={`bg-gray-100 overflow-hidden ${idx === 0 ? 'col-span-2 md:col-span-3 aspect-[2/1]' : 'aspect-square'}`}
            >
              <ImageWithFallback
                src={src}
                alt={`${title} ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
