import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';

interface ArtPackagingProps {
  images: string[];
  packagingTitle?: string | null;
  title?: string;
}

export function ArtPackaging({ images, packagingTitle, title = '작품' }: ArtPackagingProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const imgClass =
    'w-full h-full object-cover cursor-zoom-in transition-opacity duration-200 hover:opacity-90';

  return (
    <>
      <section className="mb-16">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">포장</p>

        {packagingTitle && (
          <h3 className="text-base font-semibold text-gray-800 mb-4">{packagingTitle}</h3>
        )}

        <div className="grid grid-cols-2 gap-2">
          {images.map((src, idx) => (
            <div
              key={idx}
              className="aspect-square bg-gray-100 overflow-hidden"
              onClick={() => setLightboxIndex(idx)}
            >
              <ImageWithFallback
                src={src}
                alt={`${title} 포장 ${idx + 1}`}
                className={imgClass}
              />
            </div>
          ))}
        </div>
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={`${title} 포장`}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
