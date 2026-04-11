import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';

import { NoticeBanner } from '@/app/components/Checkout/NoticeBanner';
import { ConfirmOrderItems } from '@/app/components/Checkout/ConfirmOrderItem';
import { ConfirmShippingInfo } from '@/app/components/Checkout/ConfirmShippingInfo';
import { ConfirmPaymentInfo } from '@/app/components/Checkout/ConfirmPaymentInfo';
import { ConfirmSummarySidebar } from '@/app/components/Checkout/ConfirmSummarySidebar';

const PAYMENT_ICONS: Record<string, string> = {
  toss: '💙',
  kakao: '💛',
  naver: '💚',
  payco: '❤️',
  samsung: '📱',
  card: '💳',
};

export default function OrderConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const orderInfo = location.state?.orderInfo || {
    subtotal: 450000,
    shipping: 15000,
    tax: 45000,
    total: 510000,
    items: [
      { name: 'Modern Hanbok Series #001', artist: 'Kim Min-ji', price: 450000 }
    ]
  };

  const paymentMethod = location.state?.paymentMethod || 'card';
  const paymentMethodName = t(`order.confirmation.payment.methods.${paymentMethod}`);
  const paymentIcon = PAYMENT_ICONS[paymentMethod] || '💳';

  const shippingAddress = {
    recipient: 'Kim Min-ji',
    address: '123 Gangnam-daero, Gangnam-gu',
    city: 'Seoul',
    zipCode: '06123',
    phone: '+82 10-1234-5678',
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/checkout/success', {
        state: { orderInfo, paymentMethod, shippingAddress }
      });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navigation />

      <div className="pt-24 pb-16 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('order.confirmation.back')}
          </button>

          <div className="mb-8">
            <h1 className="text-3xl tracking-tight mb-2">{t('order.confirmation.title')}</h1>
            <p className="text-sm text-gray-400">
              {t('order.confirmation.subtitle')}
            </p>
          </div>

          {/* 1. 상단 알림 배너 */}
          <NoticeBanner />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* 2. 주문 상품 목록 */}
              <ConfirmOrderItems items={orderInfo.items} />

              {/* 3. 배송지 정보 */}
              <ConfirmShippingInfo shippingAddress={shippingAddress} />

              {/* 4. 결제 수단 정보 */}
              <ConfirmPaymentInfo 
                paymentIcon={paymentIcon} 
                paymentMethodName={paymentMethodName} 
              />
            </div>

            <div className="lg:col-span-1">
              {/* 5. 주문 요약 및 확정 사이드바 */}
              <ConfirmSummarySidebar 
                orderInfo={orderInfo}
                paymentMethodName={paymentMethodName}
                isProcessing={isProcessing}
                onConfirm={handleConfirmOrder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}