import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

interface ConfirmSummarySidebarProps {
  orderInfo: any;
  paymentMethodName: string;
  isProcessing: boolean;
  onConfirm: () => void;
}

export function ConfirmSummarySidebar({
  orderInfo,
  paymentMethodName,
  isProcessing,
  onConfirm,
}: ConfirmSummarySidebarProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-28">
      <h2 className="text-lg mb-6">{t('order.confirmation.summary.title')}</h2>

      {/* Pricing */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('order.confirmation.summary.subtotal')}</span>
          <span>₩{orderInfo.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('order.confirmation.summary.shipping')}</span>
          <span>₩{orderInfo.shipping.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('order.confirmation.summary.tax')}</span>
          <span>₩{orderInfo.tax.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 mt-3">
          <div className="flex justify-between mb-1">
            <span className="font-medium">{t('order.confirmation.summary.total')}</span>
            <span className="font-medium text-xl">₩{orderInfo.total.toLocaleString()}</span>
          </div>
          <p className="text-xs text-gray-400">
            {t('order.confirmation.summary.paymentVia', { method: paymentMethodName })}
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <button
        onClick={onConfirm}
        disabled={isProcessing}
        className={`w-full py-4 rounded-xl mb-3 transition-all ${
          isProcessing
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-koala-navy text-white hover:bg-koala-navy-hover'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
            {t('order.confirmation.summary.processing')}
          </span>
        ) : (
          t('order.confirmation.summary.confirmButton')
        )}
      </button>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        {t('order.confirmation.summary.termsPrefix')}
        <Link to="/terms" className="text-black hover:underline mx-1">
          {t('order.confirmation.summary.termsLink')}
        </Link>
        {t('order.confirmation.summary.termsSuffix')}
      </p>
    </div>
  );
}