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

  const [first, second, third, ...rest] = images;

  return (
    <>
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-400 mb-5">재질 / 소재</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* 왼쪽: 위 2장(정사각) + 아래 넓은 이미지 */}
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {first && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(0)}
                >
                  <ImageWithFallback src={first} alt={`${title} 소재 1`} className={imgClass} />
                </div>
              )}
              {second && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(1)}
                >
                  <ImageWithFallback src={second} alt={`${title} 소재 2`} className={imgClass} />
                </div>
              )}
            </div>
            {third && (
              <div
                className="w-full aspect-[2/1] bg-gray-100 overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(2)}
              >
                <ImageWithFallback src={third} alt={`${title} 소재 3`} className={imgClass} />
              </div>
            )}
          </div>

          {/* 오른쪽: 설명 텍스트 */}
          <div className="flex flex-col justify-start gap-2 pl-1">
            {description && (
              <>
                <p className="text-xs font-semibold text-gray-500">설명문</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </>
            )}
          </div>
        </div>

        {/* 4장 이상 추가 이미지 */}
        {rest.map((src, idx) => (
          <div
            key={idx}
            className="w-full aspect-square bg-gray-100 overflow-hidden mt-2 cursor-zoom-in"
            onClick={() => setLightboxIndex(idx + 3)}
          >
            <ImageWithFallback src={src} alt={`${title} 소재 ${idx + 4}`} className={imgClass} />
          </div>
        ))}
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
