import { ShoppingCart, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  sku: any;
  cartLoading: boolean;
  isWishlisted: boolean;
  onAddToCart: () => void;
  onWishlist: () => void;
}

export function ProductActions({ sku, cartLoading, isWishlisted, onAddToCart, onWishlist }: Props) {
  const { t } = useTranslation('koala');

  return (
    <div className="mt-auto flex gap-4 pt-6">
      <button
        onClick={onAddToCart}
        disabled={cartLoading || sku.status === 'OUT_OF_STOCK'}
        className="flex-1 flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50"
      >
        <ShoppingCart className="w-5 h-5" />
        {sku.status === 'OUT_OF_STOCK' ? t('product.detail.actions.outOfStock') 
          : cartLoading ? t('product.detail.actions.addingToCart') 
          : t('product.detail.actions.addToCart')}
      </button>
      <button
        onClick={onWishlist}
        className="p-5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]"
      >
        <Heart className={`w-6 h-6 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
      </button>
    </div>
  );
}