import { Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function OrderItemsList({ order }: { order: any }) {
  const { t } = useTranslation();
  const items = order.items ?? [];

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-5 h-5 text-gray-400" />
        <h3 className="font-bold text-gray-900">{t('order.detail.orderItems')}</h3>
      </div>
      <div className="space-y-5">
        {items.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-4 md:gap-5 items-center">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-50 flex items-center justify-center">
              <Package className="w-8 h-8 text-gray-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm md:text-base text-gray-900 line-clamp-2">
                {item.skuName}
              </p>
              {item.artistName && (
                <p className="text-xs text-gray-400 mt-0.5">{item.artistName}</p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">
                {t('order.detail.quantity', { count: item.quantity })} · ₩{Number(item.unitPrice).toLocaleString()}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-black text-sm md:text-base text-gray-900">
                ₩{Number(item.lineTotalAmount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-50 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('order.detail.productAmount')}</span>
          <span className="font-medium">₩{Number(order.productAmount ?? order.totalAmount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('order.detail.shippingAmount')}</span>
          <span className="font-medium">
            {Number(order.shippingAmount ?? 0) === 0 ? t('order.detail.freeShipping') : `₩${Number(order.shippingAmount).toLocaleString()}`}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-900">{t('order.detail.totalAmount')}</span>
          <span className="text-xl font-black text-black tracking-tighter">
            ₩{Number(order.totalAmount).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}