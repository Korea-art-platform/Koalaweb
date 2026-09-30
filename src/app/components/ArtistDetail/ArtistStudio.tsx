import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface ArtistStudioProps {
  studioImages?: string[];
  artistName?: string;
}

export function ArtistStudio({ studioImages, artistName }: ArtistStudioProps) {
  const { t } = useTranslation();
  if (!studioImages || studioImages.length === 0) return null;
  const images = studioImages;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest mb-4">
        {t('artistPage.studio.title')}
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {images.map((src, idx) => (
          <div key={idx} className="aspect-square bg-gray-100 overflow-hidden">
            <ImageWithFallback
              src={src}
              alt={t('artistPage.studio.alt', { name: artistName ?? t('art.artist.defaultName'), n: idx + 1 })}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
