import { useTranslation } from 'react-i18next';
import WishBookmark from '@/app/components/common/WishBookmark';

interface Props {
  sku: any;
  cartLoading: boolean;
  buying?: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onBuyNow?: () => void;
  onWishlist: () => void;
}

export function ProductActions({
  sku, cartLoading, buying = false, isWishlisted, onAddToCart, onBuyNow, onWishlist,
}: Props) {
  const { t } = useTranslation();
  const isOutOfStock = sku.status === 'OUT_OF_STOCK';

  return (
    <div className="mt-6">
    <div className="flex gap-2.5">
      <button
        onClick={onAddToCart}
        disabled={cartLoading || isOutOfStock}
        className="flex-1 py-3.5 bg-koala-navy text-white rounded-xl font-bold text-sm hover:bg-koala-navy-hover transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isOutOfStock
          ? t('product.detail.actions.outOfStock')
          : cartLoading
          ? t('product.detail.actions.addingToCart')
          : t('product.detail.actions.addToCart')}
      </button>
      <button
        onClick={onWishlist}
        aria-label="찜하기"
        className={`w-[52px] h-[52px] flex items-center justify-center border rounded-xl transition-all active:scale-[0.98] flex-shrink-0 ${
          isWishlisted
            ? 'border-koala-gold bg-koala-gold/5 text-koala-gold-deep'
            : 'border-gray-200 text-gray-400 hover:bg-gray-50 hover:border-gray-300'
        }`}
      >
        <WishBookmark active={isWishlisted} size={22} />
      </button>
    </div>

    {onBuyNow && (
      <button
        onClick={onBuyNow}
        disabled={buying || isOutOfStock}
        className="mt-2.5 w-full py-4 rounded-xl bg-gradient-to-r from-koala-purple to-koala-purple-bright text-white text-base font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[filter,transform] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:brightness-[1.12] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isOutOfStock ? t('product.detail.actions.outOfStock')
          : buying ? '주문서로 이동 중...' : '구매하기'}
      </button>
    )}
    </div>
  );
}
