import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmOrderItemsProps {
  items: any[];
}

export function ConfirmOrderItems({ items }: ConfirmOrderItemsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-gray-400" />
        <h2 className="text-lg">{t('order.confirmation.items.title')}</h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-20 h-20 rounded-lg bg-gray-200"></div>
            <div className="flex-1">
              <p className="font-medium mb-1">{item.name}</p>
              <p className="text-sm text-gray-400 mb-2">
                {t('order.confirmation.items.byArtist', { artist: item.artist })}
              </p>
              <p className="text-sm">₩{item.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}