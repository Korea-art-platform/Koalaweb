import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';

interface ArtMaterialProps {
  images: string[];
  description?: string | null;
  title?: string;
}

export function ArtMaterial({ images, description, title = '작품' }: ArtMaterialProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0 && !description) return null;

  const imgClass =
    'w-full h-full object-cover cursor-zoom-in transition-opacity duration-200 hover:opacity-90';

  return (
    <>
      <section className="mb-16">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">재질 / 소재</p>

        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            {images.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-100 overflow-hidden"
                onClick={() => setLightboxIndex(idx)}
              >
                <ImageWithFallback
                  src={src}
                  alt={`${title} 소재 ${idx + 1}`}
                  className={imgClass}
                />
              </div>
            ))}
          </div>
        )}

        {description && (
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        )}
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={`${title} 소재`}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
