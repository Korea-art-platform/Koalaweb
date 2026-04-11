import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface ArtistGalleryProps {
  images: any[];
  artistName: string;
}

export function ArtistGallery({ images, artistName }: ArtistGalleryProps) {
  const { t } = useTranslation('artistLab'); // 🌟 네임스페이스 지정

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-20 md:mb-32">
      <div className="flex items-end justify-between mb-6 md:mb-8 px-1">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
          {t('detail.titles.gallery')}
        </h2>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          {t('detail.labels.works')}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {images.map((image: any) => (
          <div
            key={image.id}
            className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square"
          >
            <ImageWithFallback
              src={image.fileUrl}
              alt={image.title ?? artistName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
            {image.title && (
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs font-bold">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}