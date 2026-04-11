import { CreditCard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface ConfirmPaymentInfoProps {
  paymentIcon: string;
  paymentMethodName: string;
}

export function ConfirmPaymentInfo({ paymentIcon, paymentMethodName }: ConfirmPaymentInfoProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg">{t('order.confirmation.payment.title')}</h2>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          {t('order.confirmation.payment.change')}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{paymentIcon}</div>
          <div>
            <p className="font-medium mb-0.5">{paymentMethodName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}