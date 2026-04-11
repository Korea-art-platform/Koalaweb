import { Link } from 'react-router';
import { Box, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface OrderActionsProps {
  order: any;
  onCancel: () => void;
  cancelling: boolean;
}
export function OrderActions({ order, onCancel, cancelling }: OrderActionsProps) {
  const { t } = useTranslation();
  const canCancel = order && ['PENDING_PAYMENT', 'PAID', 'PREPARING'].includes(order.orderStatus);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {order.orderStatus === 'SHIPPED' && (
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all">
          <Box className="w-4 h-4" /> {t('order.detail.trackShipping')}
        </button>
      )}
      {canCancel && (
        <button
          onClick={onCancel}
          disabled={cancelling}
          className="flex items-center justify-center gap-2 px-6 py-4 border border-red-200 text-red-500 rounded-2xl font-bold text-sm hover:bg-red-50 transition-all disabled:opacity-50"
        >
          {cancelling ? t('order.detail.cancelling') : t('order.detail.cancelOrder')}
        </button>
      )}
      <Link
        to="/store"
        className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all">
        {t('order.detail.continueShopping')} <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
}