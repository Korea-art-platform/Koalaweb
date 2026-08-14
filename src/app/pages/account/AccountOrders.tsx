import { Link } from 'react-router';
import { Package, ChevronRight, Box } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getMyOrders, cancelOrder } from '@/api/order';

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING_PAYMENT: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    PAID: 'bg-blue-50 text-blue-600 border-blue-100',
    PREPARING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    SHIPPED: 'bg-blue-50 text-blue-600 border-blue-100',
    DELIVERED: 'bg-green-50 text-green-600 border-green-100',
    CANCELLED: 'bg-gray-50 text-gray-600 border-gray-100',
  };
  return colors[status] || 'bg-gray-50 text-gray-600 border-gray-100';
};

export default function AccountOrders() {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders(page, 10);
        setOrders(res.data.data.content ?? []);
        setTotalPages(res.data.data.totalPages ?? 0);
      } catch (e) {
        console.error('주문 내역 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page]);

  const handleCancel = async (orderNo: string) => {
    if (!window.confirm(t('order.detail.confirmCancel'))) return;
    try {
      await cancelOrder(orderNo);
      setOrders((prev) => prev.map((o) => o.orderNo === orderNo ? { ...o, orderStatus: 'CANCELLED' } : o));
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      alert(msg || t('order.detail.cancelFailed'));
    }
  };

  return (
    <>
      <div className="mb-6 md:mb-8 px-1">
        <h2 className="text-xl md:text-2xl font-bold mb-1 italic">{t('order.history.title')}</h2>
        <p className="text-xs md:text-sm text-gray-400 font-medium">{t('order.history.totalCount', { count: orders.length })}</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white rounded-3xl h-40" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 md:p-20 shadow-sm border border-dashed border-gray-200 text-center">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg md:text-xl font-bold mb-2">{t('order.history.emptyMessage')}</h3>
          <Link to="/store" className="inline-block mt-6 px-8 py-3.5 bg-koala-navy text-white rounded-2xl hover:bg-koala-navy-hover font-bold text-sm">
            {t('order.history.goStore')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {orders.map((order) => (
            <div key={order.orderNo} className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden group">
              <div className="px-5 py-4 md:px-8 md:py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-y-3">
                <div className="flex gap-4 md:gap-8">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold">{t('order.detail.orderNo')}</p>
                    <p className="text-sm font-black text-gray-900">{order.orderNo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold">{t('order.detail.orderDate')}</p>
                    <p className="text-sm font-bold text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border uppercase ${getStatusColor(order.orderStatus)}`}>
                  {t(`order.status.${order.orderStatus}`)}
                </span>
              </div>
              <div className="p-5 md:p-8">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                    <img src={order.firstSkuImageUrl ?? '/placeholder.svg'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base truncate">{order.firstSkuName}</h4>
                    {order.itemCount > 1 && <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-bold">{t('order.detail.otherItems', { count: order.itemCount - 1 })}</span>}
                  </div>
                  <div className="text-right font-black text-gray-900">₩{order.totalAmount.toLocaleString()}</div>
                </div>
                <div className="flex gap-2 mt-8 pt-6 border-t border-gray-50">
                  {order.orderStatus === 'SHIPPED' && (
                    <button className="flex items-center gap-2 px-5 py-3 bg-koala-navy text-white rounded-xl text-xs font-bold"><Box className="w-4 h-4" /> {t('order.detail.trackShipping')}</button>
                  )}
                  {['PENDING_PAYMENT', 'PAID', 'PREPARING'].includes(order.orderStatus) && (
                    <button onClick={() => handleCancel(order.orderNo)} className="flex items-center gap-2 px-5 py-3 border border-red-200 text-red-500 rounded-xl text-xs font-bold">{t('order.detail.cancelOrder')}</button>
                  )}
                  <Link to={`/account/orders/${order.orderNo}`} className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-600">
                    {t('order.history.viewDetail')} <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30">{t('common.prev')}</button>
              <span className="px-6 py-2 text-sm text-gray-500">{page + 1} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30">{t('common.next')}</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
