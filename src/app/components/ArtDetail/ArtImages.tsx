import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const [first, second, third, ...rest] = images;

  const imgClass = 'w-full h-full object-cover cursor-zoom-in transition-opacity duration-200 hover:opacity-90';

  return (
    <>
      <section className="mb-16">
        <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">작품 - 상세</p>

        {/* 1장: 전체 너비 정사각 */}
        {images.length === 1 && (
          <div
            className="w-full aspect-square bg-gray-100 overflow-hidden"
            onClick={() => setLightboxIndex(0)}
          >
            <ImageWithFallback src={first} alt={title} className={imgClass} />
          </div>
        )}

        {/* 2장 이상: 왼쪽 세로 큰 이미지 + 오른쪽 최대 2장 */}
        {images.length >= 2 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div
                className="aspect-[3/4] bg-gray-100 overflow-hidden"
                onClick={() => setLightboxIndex(0)}
              >
                <ImageWithFallback src={first} alt={`${title} 1`} className={imgClass} />
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className="flex-1 min-h-0 bg-gray-100 overflow-hidden"
                  onClick={() => setLightboxIndex(1)}
                >
                  <ImageWithFallback src={second} alt={`${title} 2`} className={imgClass} />
                </div>
                {third && (
                  <div
                    className="flex-1 min-h-0 bg-gray-100 overflow-hidden"
                    onClick={() => setLightboxIndex(2)}
                  >
                    <ImageWithFallback src={third} alt={`${title} 3`} className={imgClass} />
                  </div>
                )}
              </div>
            </div>

            {/* 4장 이상: 나머지 이미지 전체 너비 */}
            {rest.map((src, idx) => (
              <div
                key={idx}
                className="w-full aspect-square bg-gray-100 overflow-hidden mt-2"
                onClick={() => setLightboxIndex(idx + 3)}
              >
                <ImageWithFallback src={src} alt={`${title} ${idx + 4}`} className={imgClass} />
              </div>
            ))}
          </>
        )}
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
