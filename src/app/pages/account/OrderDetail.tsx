import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getOrder, cancelOrder } from '@/api/order';

import {
  OrderStatusStepper,
  OrderSummaryHeader,
  OrderItemsList,
  OrderInfoCards,
  OrderActions,
} from '@/app/components/Order';

export default function OrderDetail() {
  const { t } = useTranslation();
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderNo) return;
    getOrder(orderNo)
      .then((res) => setOrder(res.data.data))
      .catch(() => navigate('/account/orders'))
      .finally(() => setLoading(false));
  }, [orderNo, navigate]);

  const handleCancel = async () => {
    if (!window.confirm(t('order.detail.confirmCancel'))) return;
    setCancelling(true);
    try {
      await cancelOrder(orderNo!);
      setOrder((prev: any) => ({ ...prev, orderStatus: 'CANCELLED' }));
    } catch (e: any) {
      alert(e.response?.data?.message || t('order.detail.cancelFailed'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 mb-6 md:mb-8 px-1">
        <button
          onClick={() => navigate('/account/orders')}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('order.detail.backToList')}
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <h2 className="text-xl md:text-2xl font-bold italic">{t('order.detail.title')}</h2>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="bg-white rounded-3xl h-32" />
          <div className="bg-white rounded-3xl h-48" />
          <div className="bg-white rounded-3xl h-40" />
        </div>
      ) : order ? (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <OrderSummaryHeader order={order} />
            <div className="px-6 md:px-10 py-8">
              <OrderStatusStepper status={order.orderStatus} />
            </div>
          </div>

          <OrderItemsList order={order} />
          <OrderInfoCards order={order} />
          <OrderActions order={order} onCancel={handleCancel} cancelling={cancelling} />
        </div>
      ) : null}
    </>
  );
}
