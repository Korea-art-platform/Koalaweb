import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface Props {
  sku: any;
  images: string[];
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

export function ProductImageGallery({ sku, images, selectedImage, setSelectedImage }: Props) {
  return (
    <div className="flex gap-3 h-full">
      {/* Vertical thumbnail strip — always shown */}
      <div className="flex flex-col gap-2 w-[68px] flex-shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-[68px] h-[68px] rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
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

      {/* Main image */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
        <ImageWithFallback
          src={images[selectedImage]}
          alt={sku.name}
          className="w-full h-full object-cover transition-opacity duration-200"
        />
      </div>
    </div>
  );
}
