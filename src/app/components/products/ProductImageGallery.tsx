import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { ImageLightbox } from '@/app/components/common/ImageLightbox';

interface Props {
  sku: any;
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export function ProductImageGallery({ sku, images, selectedImage, setSelectedImage }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex gap-3 h-full">
        <div className="flex flex-col gap-2 w-[68px] flex-shrink-0">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative w-[68px] h-[68px] overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                selectedImage === index
                  ? 'border-gray-900 opacity-100'
                  : 'border-transparent opacity-45 hover:opacity-75'
              }`}
            >
              <ImageWithFallback
                src={image}
                alt={`${sku.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
        <div
          className="flex-1 relative overflow-hidden bg-gray-50 aspect-square cursor-zoom-in group"
          onClick={() => setLightboxIndex(selectedImage)}
        >
          <ImageWithFallback
            src={images[selectedImage]}
            alt={sku.name}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
          <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <ZoomIn className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          title={sku.name}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
