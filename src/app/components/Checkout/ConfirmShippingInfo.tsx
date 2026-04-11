import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

interface ConfirmShippingInfoProps {
  shippingAddress: any;
}

export function ConfirmShippingInfo({ shippingAddress }: ConfirmShippingInfoProps) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // 🌟 동적 배송 예정일 계산 로직 (현재 날짜 기준 +2일 ~ +4일)
  const today = new Date();
  const minDate = new Date(today.getTime() + 86400000 * 2); // +2일
  const maxDate = new Date(today.getTime() + 86400000 * 4); // +4일

  // 언어 설정(i18n.language)에 맞춰 날짜 포맷팅 (기본값: 한국어)
  const currentLang = i18n.language || 'ko-KR';
  const minDateString = minDate.toLocaleDateString(currentLang, { month: 'long', day: 'numeric' });
  const maxDateString = maxDate.toLocaleDateString(currentLang, { month: 'long', day: 'numeric' });
  
  // 예: "4월 13일 ~ 4월 15일 도착 예정"
  const estimatedDateText = currentLang.startsWith('ko') 
    ? `${minDateString} ~ ${maxDateString} 도착 예정`
    : `Estimated arrival: ${minDateString} - ${maxDateString}`;

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <h2 className="text-lg">{t('order.confirmation.shipping.title')}</h2>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="text-sm text-gray-400 hover:text-black transition-colors"
        >
          {t('order.confirmation.shipping.edit')}
        </button>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <p className="font-medium mb-2">{shippingAddress.recipient}</p>
        <p className="text-sm text-gray-600 mb-1">{shippingAddress.address}</p>
        <p className="text-sm text-gray-600 mb-2">
          {shippingAddress.city} {shippingAddress.zipCode}
        </p>
        <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <p className="text-xs text-gray-600 mb-1 font-medium">
          {t('order.confirmation.shipping.estimatedDelivery')}
        </p>
        <p className="text-sm text-gray-700">{estimatedDateText}</p>
      </div>
    </div>
  );
}