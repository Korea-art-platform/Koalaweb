import { Heart } from 'lucide-react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Sku } from '@/api/types';

interface ProductCardProps {
  sku: Sku;
  viewMode: 'grid' | 'large';
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function ProductCard({
  sku,
  viewMode,
  isWishlisted,
  isWishlistLoading,
  onWishlistClick,
}: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link to={`/product/${sku.skuCode}`} className="group block">
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-100">
        <div className={`relative w-full ${viewMode === 'grid' ? 'aspect-[3/4] sm:aspect-square' : 'aspect-[4/3]'}`}>
          <ImageWithFallback
            src={sku.primaryImageUrl ?? '/placeholder.svg'}
            alt={sku.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* 뱃지 */}
          <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 flex flex-col gap-1.5">
            <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-white/90 backdrop-blur-sm text-[9px] md:text-xs font-bold tracking-tight uppercase shadow-sm">
              {/* 💡 수정 1: as string 추가 및 defaultValue 옵션 객체 형태로 변경 */}
              {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre }) as string}
            </div>
            {sku.isLimitedEdition && (
              <div className="w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-koala-navy text-white text-[9px] md:text-xs font-bold uppercase shadow-sm">
                {/* 💡 수정 2: as string 추가 */}
                {t('store.product.limited') as string}
              </div>
            )}
          </div>

          {/* 상태 뱃지 */}
          <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4">
            <div
              className={`px-2 py-1 md:px-3 md:py-1.5 rounded-md text-[9px] md:text-xs font-bold backdrop-blur-sm shadow-sm ${
                sku.status === 'ACTIVE'
                  ? 'bg-green-500/90 text-white'
                  : sku.status === 'OUT_OF_STOCK'
                  ? 'bg-gray-900/90 text-white'
                  : 'bg-blue-500/90 text-white'
              }`}
            >
              {sku.status === 'ACTIVE' 
                ? t('store.product.status.available') as string // 💡 수정 3: as string 추가
                : sku.status === 'OUT_OF_STOCK' 
                ? t('store.product.status.soldOut') as string // 💡 수정 4: as string 추가
                : sku.status}
            </div>
          </div>

          {/* 위시리스트 버튼 */}
          <button
            onClick={(e) => onWishlistClick(e, sku.skuCode)}
            disabled={isWishlistLoading}
            className={`absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 p-2 md:p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-400'
            } ${isWishlistLoading ? 'opacity-60 cursor-wait' : ''}`}
          >
            <Heart className="w-4 h-4 md:w-4.5 md:h-4.5" fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="mt-4 px-0.5">
        <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase mb-1.5 font-medium">
          {/* 💡 수정 5: as string 추가 및 defaultValue 형태 수정 */}
          {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre }) as string}
        </div>
        <h3 className="text-sm md:text-lg lg:text-xl font-bold mb-1 group-hover:text-gray-600 transition-colors truncate">
          {sku.name}
        </h3>
        <p className="text-[12px] md:text-sm text-gray-500 mb-2 font-medium">{sku.artistName}</p>
        <p className="text-sm md:text-lg font-black tracking-tight">
          ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}