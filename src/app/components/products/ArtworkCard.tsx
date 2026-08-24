import { Link } from 'react-router';
import { Sparkles } from 'lucide-react';
import WishBookmark from '@/app/components/common/WishBookmark';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtworkCardProps {
  id: string;
  image: string;
  title: string;
  artist: string;
  category?: string;
  price?: number;
  isAICurated?: boolean;
  size?: 'large' | 'medium' | 'small';
}

export default function ArtworkCard({
  id,
  image,
  title,
  artist,
  category,
  price,
  isAICurated,
  size = 'medium',
}: ArtworkCardProps) {
  const heights = {
    large: 'h-[600px]',
    medium: 'h-[450px]',
    small: 'h-[350px]',
  };

  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-gray-50">
        <div className={`${heights[size]} relative`}>
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {isAICurated && (
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs">품절 직전!</span>
            </div>
          )}

          <button aria-label="찜하기" className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-gray-500">
            <WishBookmark active={false} size={17} />
          </button>
        </div>
      </div>
      <div className="mt-4 px-1">
        {category && (
          <div className="text-xs text-gray-400 tracking-wide uppercase mb-1">
            {category}
          </div>
        )}
        <h3 className="text-lg mb-1 group-hover:text-gray-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">{artist}</p>
        {price && (
          <p className="text-sm">
            ${price.toLocaleString()}
          </p>
        )}
      </div>
    </Link>
  );
}
