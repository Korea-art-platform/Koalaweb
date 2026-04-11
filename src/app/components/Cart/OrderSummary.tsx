import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ cartItems, subtotal, shipping, total }: OrderSummaryProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
      <h2 className="text-xl mb-6 font-semibold">{t('cart.summary.title')}</h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('cart.summary.subtotal')}</span>
          <span className="font-medium">₩{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">{t('cart.summary.shipping')}</span>
          <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
            {shipping === 0 ? t('cart.summary.freeShipping') : `₩${shipping.toLocaleString()}`}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-gray-400">{t('cart.summary.shippingNotice')}</p>
        )}

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex justify-between items-end">
            <span className="font-medium text-gray-900">{t('cart.summary.total')}</span>
            <div className="text-right">
              <span className="block text-2xl font-bold text-black">
                ₩{total.toLocaleString()}
              </span>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                {t('cart.summary.vatIncluded')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/checkout"
        state={{ cartItems, subtotal, shipping, total }}
        className="block w-full py-4 bg-black text-white text-center rounded-2xl hover:bg-gray-900 transition-transform active:scale-[0.98] font-medium"
      >
        {t('cart.summary.checkout')}
      </Link>

      <div className="mt-6 flex flex-col items-center gap-2">
        <p className="text-[11px] text-gray-400 text-center">
          {t('cart.summary.securePayment')}
        </p>
      </div>
    </div>
  );
}