import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface Props {
  sku: any;
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export function ProductImageGallery({ sku, images, selectedImage, setSelectedImage }: Props) {
  const { t } = useTranslation('koala');

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[32px] bg-gray-50 aspect-square border border-gray-100">
        <ImageWithFallback src={images[selectedImage]} alt={sku.name} className="w-full h-full object-cover" />
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold shadow-sm uppercase tracking-wider text-black border border-gray-100">
            {sku.genre}
          </div>
          {sku.isLimitedEdition && (
            <div className="px-4 py-2 rounded-full bg-black text-white text-xs font-bold uppercase shadow-sm">
              {t('product.detail.gallery.limitedEdition')}
            </div>
          )}
        </div>
        <div className="absolute top-6 right-6">
          <div className={`px-4 py-2 rounded-full backdrop-blur-md text-xs font-bold shadow-sm ${
            sku.status === 'ACTIVE' ? 'bg-green-500/90 text-white' : sku.status === 'OUT_OF_STOCK' ? 'bg-gray-900/90 text-white' : 'bg-blue-500/90 text-white'
          }`}>
            {sku.status === 'ACTIVE' ? t('product.detail.gallery.status.active') 
              : sku.status === 'OUT_OF_STOCK' ? t('product.detail.gallery.status.outOfStock') 
              : sku.status}
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative overflow-hidden rounded-2xl aspect-square transition-all duration-300 border-2 ${
                selectedImage === index ? 'border-black scale-[0.98]' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <ImageWithFallback src={image} alt={`${sku.name} ${index}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}