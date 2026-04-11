import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CartItemProps {
  item: any;
  onUpdateQuantity: (id: number, currentQty: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex gap-6">
        <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={item.primaryImageUrl ?? 'https://via.placeholder.com/128'}
            alt={item.skuName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-medium text-lg mb-1">{item.skuName}</h3>
            <p className="text-sm text-gray-400 mb-1">
              ₩{item.unitPrice.toLocaleString()} / {t('cart.item.perItem')}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-xl">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => onRemoveItem(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="font-semibold text-lg">₩{item.lineAmount.toLocaleString()}</p>
          {item.quantity > 1 && (
            <p className="text-xs text-gray-400 mt-1">
              {t('cart.item.perItem')} ₩{item.unitPrice.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}