import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  sku: any;
  cartLoading: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onWishlist: () => void;
}

export function ProductActions({ sku, cartLoading, isWishlisted, onAddToCart, onWishlist }: Props) {
  const { t } = useTranslation();
  const isOutOfStock = sku.status === 'OUT_OF_STOCK';

  return (
    <div className="flex gap-2.5 mt-6">
      <button
        onClick={onAddToCart}
        disabled={cartLoading || isOutOfStock}
        className="flex-1 py-3.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isOutOfStock
          ? t('product.detail.actions.outOfStock')
          : cartLoading
          ? t('product.detail.actions.addingToCart')
          : t('product.detail.actions.addToCart')}
      </button>

      <button
        onClick={onWishlist}
        className="w-[52px] h-[52px] flex items-center justify-center border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] flex-shrink-0"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'
          }`}
        />
      </button>
    </div>
  );
}
