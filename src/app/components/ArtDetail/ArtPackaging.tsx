import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';

interface ArtPackagingProps {
  images: string[];
  packagingTitle?: string | null;
  packagingDescription?: string | null;
  title?: string;
}

export function ArtPackaging({
  images,
  packagingTitle,
  packagingDescription,
  title = '작품',
}: ArtPackagingProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0 && !packagingTitle && !packagingDescription) return null;

  const imgClass =
    'w-full h-full object-cover cursor-zoom-in transition-opacity duration-200 hover:opacity-90';

  const [first, second, third, ...rest] = images;

  return (
    <>
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-400 mb-5">포장 사진</h2>

        <div className="grid grid-cols-2 gap-3">
          {/* 왼쪽: 이미지 그리드 (상단 2장 + 하단 1장) */}
          <div className="flex flex-col gap-2">
            {/* 상단 이미지 2장 */}
            <div className="grid grid-cols-2 gap-2">
              {first && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(0)}
                >
                  <ImageWithFallback src={first} alt={`${title} 포장 1`} className={imgClass} />
                </div>
              )}
              {second && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(1)}
                >
                  <ImageWithFallback src={second} alt={`${title} 포장 2`} className={imgClass} />
                </div>
              )}
            </div>

            {/* 하단 와이드 이미지 */}
            {third && (
              <div
                className="w-full aspect-[2/1] bg-gray-100 overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(2)}
              >
                <ImageWithFallback src={third} alt={`${title} 포장 3`} className={imgClass} />
              </div>
            )}
          </div>

          {/* 오른쪽: 제목 + 설명 */}
          <div className="flex flex-col justify-start gap-2 pl-1">
            {packagingTitle && (
              <h3 className="text-base font-semibold text-gray-900">{packagingTitle}</h3>
            )}
            {packagingDescription && (
              <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">
                {packagingDescription}
              </p>
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
            <ImageWithFallback src={src} alt={`${title} 포장 ${idx + 4}`} className={imgClass} />
          </div>
        ))}
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
