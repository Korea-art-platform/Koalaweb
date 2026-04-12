import { Link, useLocation, useNavigate } from 'react-router';
import { CheckCircle, Package, MapPin, CreditCard, ChevronRight, Home } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    if (location.state) {
      setOrderData(location.state);
    } else {
      // state 없으면 주문 목록으로
      navigate('/account/orders');
    }
  }, [location]);

  if (!orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <p className="text-gray-500 mb-8">{t('order.detail.noShippingInfo')}</p>
        <Link to="/" className="px-8 py-3 bg-black text-white rounded-2xl font-medium">
          {t('search.backToHome')}
        </Link>
      </div>
    );
  }

  const { orderNo, orderInfo, shippingAddress, paymentMethod } = orderData;

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-20 px-8">
        <div className="max-w-2xl mx-auto">

          {/* 성공 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-[32px] mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-3 text-gray-900">
              주문이 완료되었습니다!
            </h1>
            <p className="text-gray-400">
              KoALa와 함께해주셔서 감사합니다. 소중한 작품을 곧 보내드릴게요.
            </p>
          </div>

          {/* 주문 정보 카드 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
                  {t('order.detail.orderNo')}
                </p>
                <p className="text-lg font-bold text-gray-900">{orderNo}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">
                  {t('order.detail.orderDate')}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date().toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>

            <div className="py-8 border-b border-gray-100 space-y-6 text-sm">
              {/* 배송지 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{t('order.detail.shippingInfo')}</p>
                  <p className="text-gray-600">
                    {shippingAddress?.recipient} ({shippingAddress?.phone})
                  </p>
                  <p className="text-gray-400 mt-0.5">
                    {shippingAddress?.address} {shippingAddress?.address2}
                  </p>
                </div>
              </div>

              {/* 결제 수단 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">{t('order.detail.paymentMethodTitle')}</p>
                  <p className="text-gray-600">{paymentMethod ?? t('order.status.PAID')}</p>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-gray-400">{t('order.detail.totalAmount')}</span>
                <span className="text-3xl font-black text-black tracking-tighter">
                  ₩{orderInfo?.total?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 주문 상품 목록 */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 mb-10">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
              {t('order.detail.orderItems')}
            </h2>
            <div className="space-y-4">
              {orderInfo?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-5 items-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img
                      src={item.primaryImageUrl ?? 'https://via.placeholder.com/64'}
                      className="w-full h-full object-cover"
                      alt={item.skuName}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.skuName}</p>
                    <p className="text-xs text-gray-400">{t('order.detail.quantity', { count: item.quantity })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₩{item.lineAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 금액 요약 */}
            <div className="mt-8 pt-8 border-t border-gray-50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('order.detail.productAmount')}</span>
                <span className="text-gray-900 font-medium">
                  ₩{orderInfo?.subtotal?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('order.detail.shippingAmount')}</span>
                <span className="font-medium">
                  {orderInfo?.shipping === 0
                    ? t('order.detail.freeShipping')
                    : `₩${orderInfo?.shipping?.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/account/orders"
              className="flex-1 py-5 bg-black text-white rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              {t('order.history.viewDetail')} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/store"
              className="flex-1 py-5 bg-white border border-gray-200 text-gray-600 rounded-[24px] font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <Home className="w-4 h-4" /> {t('order.detail.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
