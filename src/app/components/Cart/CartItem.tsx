import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CartItem as CartItemType } from '@/api/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, currentQty: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex gap-4">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={item.primaryImageUrl ?? '/placeholder.svg'}
            alt={item.skuName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* 상단: 상품명 + 삭제 */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-base md:text-lg mb-1 truncate">{item.skuName}</h3>
              <p className="text-xs md:text-sm text-gray-400">
                ₩{item.unitPrice.toLocaleString()} / {t('cart.item.perItem')}
              </p>
            </div>
            <button
              onClick={() => onRemoveItem(item.id)}
              aria-label={t('cart.clearAll')}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-1"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          {/* 하단: 수량 조절 + 금액 */}
          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                aria-label="수량 감소"
                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                aria-label="수량 증가"
                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="font-semibold text-base md:text-lg whitespace-nowrap">
              ₩{item.lineAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
