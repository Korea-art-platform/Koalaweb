import { useState } from 'react';
import { Link } from 'react-router';
import { Box, ChevronRight, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ReturnRequestModal } from './ReturnRequestModal';

interface OrderActionsProps {
  order: any;
  onCancel: () => void;
  cancelling: boolean;
  onReturnSuccess?: () => void;
}
export function OrderActions({ order, onCancel, cancelling, onReturnSuccess }: OrderActionsProps) {
  const { t } = useTranslation();
  const [returnModalOpen, setReturnModalOpen] = useState(false);

  const canCancel = order && ['PENDING_PAYMENT', 'PAID', 'PREPARING'].includes(order.orderStatus);
  const canReturn = order?.orderStatus === 'DELIVERED' && order?.returnStatus == null;

  const handleReturnSuccess = () => {
    setReturnModalOpen(false);
    onReturnSuccess?.();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        {order.orderStatus === 'SHIPPED' && (
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-koala-navy text-white rounded-2xl font-bold text-sm hover:bg-koala-navy-hover transition-all">
            <Box className="w-4 h-4" /> {t('order.detail.trackShipping')}
          </button>
        )}
        {canReturn && (
          <button
            onClick={() => setReturnModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> {t('order.detail.returnRequest')}
          </button>
        )}
        {order?.returnStatus && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border border-gray-200 text-gray-500 rounded-2xl text-sm font-medium">
            <RotateCcw className="w-4 h-4" />
            {t(`order.detail.returnStatus.${order.returnStatus}`, { defaultValue: order.returnStatus })}
          </div>
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

      {returnModalOpen && (
        <ReturnRequestModal
          orderNo={order.orderNo}
          onClose={() => setReturnModalOpen(false)}
          onSuccess={handleReturnSuccess}
        />
      )}
    </>
  );
}
