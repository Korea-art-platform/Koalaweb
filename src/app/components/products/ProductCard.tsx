import { useState } from 'react';
import { Heart, ShoppingCart, Check, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { addCartItem } from '@/api/cart';
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
  const navigate = useNavigate();
  const detailPath = `/product/${sku.skuCode}`;

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (adding || added) return;
    setAdding(true);
    try {
      // 로딩 애니메이션이 보이도록 최소 표시 시간 확보 (SaveToggle 느낌)
      await Promise.all([
        addCartItem(sku.skuCode, 1),
        new Promise((r) => setTimeout(r, 500)),
      ]);
      window.dispatchEvent(new Event('cart-updated'));
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        // 비로그인 → 로그인 후 이 상품으로 복귀
        navigate('/login', { state: { from: detailPath } });
      } else {
        alert(t('product.detail.toast.cartAddFailed', { defaultValue: '장바구니 담기에 실패했습니다.' }) as string);
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group relative flex flex-col">
      {/* 이미지 */}
      <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-100">
        <Link to={detailPath} className="block">
          <div className={`relative w-full ${viewMode === 'grid' ? 'aspect-[3/4] sm:aspect-square' : 'aspect-[4/3]'}`}>
            <ImageWithFallback
              src={sku.primaryImageUrl ?? '/placeholder.svg'}
              alt={sku.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* 뱃지 */}
        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 flex flex-col gap-1.5 pointer-events-none">
          <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-white/90 backdrop-blur-sm text-[9px] md:text-xs font-bold tracking-tight uppercase shadow-sm">
            {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre }) as string}
          </div>
          {sku.isLimitedEdition && (
            <div className="w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-koala-red text-white text-[9px] md:text-xs font-bold uppercase shadow-sm">
              {t('store.product.limited') as string}
            </div>
          )}
        </div>

        {/* 상태 뱃지 */}
        <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4 pointer-events-none">
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
              ? t('store.product.status.available') as string
              : sku.status === 'OUT_OF_STOCK'
              ? t('store.product.status.soldOut') as string
              : sku.status}
          </div>
        </div>

        {/* 찜 버튼 */}
        <motion.button
          onClick={(e) => onWishlistClick(e, sku.skuCode)}
          disabled={isWishlistLoading}
          aria-label="찜하기"
          whileTap={{ scale: 0.85 }}
          className={`absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 p-2 md:p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-colors duration-200 ${
            isWishlisted ? 'bg-koala-red text-white' : 'bg-white/90 text-gray-500 hover:bg-white hover:text-koala-red'
          } ${isWishlistLoading ? 'cursor-wait' : ''}`}
        >
          {isWishlistLoading ? (
            <span className="block w-4 h-4 md:w-[18px] md:h-[18px] border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <motion.span
              key={isWishlisted ? 'on' : 'off'}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 13 }}
              className="block"
            >
              <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" fill={isWishlisted ? 'currentColor' : 'none'} />
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* 정보 */}
      <div className="mt-4 px-0.5 flex flex-col">
        <Link to={detailPath} className="block">
          <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase mb-1.5 font-medium">
            {t(`store.categories.${sku.genre}`, { defaultValue: sku.genre }) as string}
          </div>
          <h3 className="text-sm md:text-lg lg:text-xl font-bold mb-1 group-hover:text-gray-600 transition-colors truncate">
            {sku.name}
          </h3>
        </Link>
        <p className="text-[12px] md:text-sm text-gray-500 mb-2 font-medium">{sku.artistName}</p>
        <p className="text-sm md:text-lg font-black tracking-tight">
          ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
        </p>

        {/* 확장 영역 — 데스크탑: 호버 시 펼침 / 모바일: 항상 표시 */}
        <div
          className="grid grid-rows-[1fr] opacity-100 md:grid-rows-[0fr] md:opacity-0 md:group-hover:grid-rows-[1fr] md:group-hover:opacity-100 transition-all duration-300 ease-out"
        >
          <div className="overflow-hidden min-h-0">
            {sku.description && (
              <p className="mt-2.5 text-xs text-gray-500 leading-relaxed line-clamp-2 break-keep">
                {sku.description}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={adding}
                whileTap={{ scale: 0.96 }}
                className={`relative flex-1 flex items-center justify-center py-2.5 rounded-xl text-xs font-bold overflow-hidden transition-colors duration-300 disabled:opacity-90 ${
                  added ? 'bg-green-600 text-white' : 'bg-koala-navy text-white hover:bg-koala-navy-hover'
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> 담겼어요
                    </motion.span>
                  ) : adding ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      담는 중
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> 장바구니
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <Link
                to={detailPath}
                className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                자세히 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
