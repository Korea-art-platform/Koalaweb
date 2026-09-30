import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';
import { useTranslation } from 'react-i18next';

interface ArtMaterialProps {
  images: string[];
  description?: string | null;
  title?: string;
}

export function ArtMaterial({ images, description, title: titleProp }: ArtMaterialProps) {
  const { t } = useTranslation();
  const title = titleProp ?? t('art.images.defaultTitle');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0 && !description) return null;

  const imgClass =
    'w-full h-full object-cover cursor-zoom-in transition-opacity duration-200 hover:opacity-90';

  const [first, second, third, ...rest] = images;

  return (
    <>
      <section className="mb-16">
        <h2 className="text-xl font-bold text-gray-400 mb-5">{t('art.material.heading')}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              {first && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(0)}
                >
                  <ImageWithFallback src={first} alt={t('art.material.alt', { title, n: 1 })} className={imgClass} />
                </div>
              )}
              {second && (
                <div
                  className="aspect-square bg-gray-100 overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxIndex(1)}
                >
                  <ImageWithFallback src={second} alt={t('art.material.alt', { title, n: 2 })} className={imgClass} />
                </div>
              )}
            </div>
            {third && (
              <div
                className="w-full aspect-[2/1] bg-gray-100 overflow-hidden cursor-zoom-in"
                onClick={() => setLightboxIndex(2)}
              >
                <ImageWithFallback src={third} alt={t('art.material.alt', { title, n: 3 })} className={imgClass} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-start gap-2 pl-1">
            {description && (
              <>
                <p className="text-xs font-semibold text-gray-500">{t('art.material.caption')}</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description}
                </p>
              </>
            )}
          </div>
        </div>

        {rest.map((src, idx) => (
          <div
            key={idx}
            className="w-full aspect-square bg-gray-100 overflow-hidden mt-2 cursor-zoom-in"
            onClick={() => setLightboxIndex(idx + 3)}
          >
            <ImageWithFallback src={src} alt={t('art.material.alt', { title, n: idx + 4 })} className={imgClass} />
          </div>
        ))}
      </section>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={t('art.material.lightbox', { title })}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
