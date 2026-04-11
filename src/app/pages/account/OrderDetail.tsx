import { useEffect, useState } from 'react';
import {  useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import AccountSidebar from '@/app/components/layouts/AccountSidebar';
import { getMyProfile } from '@/api/user';
import { getOrder, cancelOrder } from '@/api/order';

// 🌟 분리된 컴포넌트들을 깔끔하게 가져옵니다!
import {
  OrderStatusStepper,
  OrderSummaryHeader,
  OrderItemsList,
  OrderInfoCards,
  OrderActions
} from '@/app/components/Order';

export default function OrderDetail() {
  const { t } = useTranslation();
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!orderNo) return;
    const fetchData = async () => {
      try {
        const [profileRes, orderRes] = await Promise.all([
          getMyProfile(),
          getOrder(orderNo),
        ]);
        setUser(profileRes.data.data);
        setOrder(orderRes.data.data);
      } catch {
        navigate('/account/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{t('account.title')}</h1>
            <p className="text-xs md:text-sm text-gray-400 font-medium">
              {t('account.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar currentPath="/account/orders" user={user} />
            </div>

            <div className="lg:col-span-3">
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
                  
                  {/* 1. 주문 요약 헤더 + 스텝퍼 */}
                  <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <OrderSummaryHeader order={order} />
                    <div className="px-6 md:px-10 py-8">
                      <OrderStatusStepper status={order.orderStatus} />
                    </div>
                  </div>

                  {/* 2. 주문 상품 및 금액 목록 */}
                  <OrderItemsList order={order} />

                  {/* 3. 배송지 및 결제 정보 카드 */}
                  <OrderInfoCards order={order} />

                  {/* 4. 하단 액션 버튼 */}
                  <OrderActions order={order} onCancel={handleCancel} cancelling={cancelling} />

                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}