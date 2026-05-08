import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

const PLACEHOLDER = 'https://via.placeholder.com/400x400';

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  const imgs = images && images.length > 0 ? images : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">작품 - 상세</p>
      <div className="grid grid-cols-3 gap-2">
        {imgs.slice(0, 3).map((src, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={src}
              alt={`${title} ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
