import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { getOrder, cancelOrder, getReturnByOrder } from '@/api/order';
import { ProductToast } from '@/app/components/products/ProductToast';
import type { Order } from '@/api/types';

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
  const [order, setOrder] = useState<Order | null>(null);
  const [returnStatus, setReturnStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = () => {
    if (!orderNo) return;
    getOrder(orderNo)
      .then((res) => {
        const o = res.data.data;
        setOrder(o);

        if (o.orderStatus === 'DELIVERED') {
          getReturnByOrder(orderNo)
            .then((r) => setReturnStatus(r.data.data.status))
            .catch(() => setReturnStatus(null));
        }
      })
      .catch(() => navigate('/account/orders'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrder(); }, [orderNo]);

  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleCancel = async () => {
    if (!window.confirm(t('order.detail.confirmCancel'))) return;
    setCancelling(true);
    try {
      await cancelOrder(orderNo!);
      setOrder((prev) => prev ? { ...prev, orderStatus: 'CANCELLED' } : null);
      setToast(t('order.detail.cancelledMessage'));
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || t('order.detail.cancelFailed'));
    } finally {
      setCancelling(false);
    }
  };

  const orderWithReturn = order ? { ...order, returnStatus } : null;

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
      ) : orderWithReturn ? (
        <div className="space-y-4 md:space-y-6">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <OrderSummaryHeader order={order!} />
            <div className="px-6 md:px-10 py-8">
              <OrderStatusStepper status={order!.orderStatus} />
            </div>
          </div>
          <OrderItemsList order={order!} />
          <OrderInfoCards order={order!} />
          <OrderActions
            order={orderWithReturn}
            onCancel={handleCancel}
            cancelling={cancelling}
            onReturnSuccess={fetchOrder}
          />
        </div>
      ) : null}
      <ProductToast show={!!toast} message={toast} onClose={() => setToast('')} />
    </>
  );
}
