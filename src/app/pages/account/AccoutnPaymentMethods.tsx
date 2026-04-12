import { CreditCard, Plus, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 나중을 위해 남겨둔 목업 데이터
const paymentOptions = [
  { id: 'toss', name: '토스페이', icon: '💙', description: '토스 앱 간편 결제', color: 'bg-blue-50 border-blue-100' },
  { id: 'kakao', name: '카카오페이', icon: '💛', description: '카카오톡 간편 결제', color: 'bg-yellow-50 border-yellow-100' },
  { id: 'naver', name: '네이버페이', icon: '💚', description: '네이버 포인트 적립', color: 'bg-green-50 border-green-100' },
  { id: 'card', name: '신용/체크카드', icon: '💳', description: '일반 카드 직접 입력', color: 'bg-gray-50 border-gray-100' },
];

export default function AccountPaymentMethods() {
  const { t } = useTranslation();

  return (
    <>
      <div className="mb-6 md:mb-8 px-1">
        <h2 className="text-xl md:text-2xl font-bold mb-1 italic">{t('account.payment.title')}</h2>
        <p className="text-xs md:text-sm text-gray-400 font-medium">
          {t('account.payment.subtitle')}
        </p>
      </div>

      {/* 지원 결제 수단 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {paymentOptions.map((method) => (
          <div
            key={method.id}
            className={`bg-white rounded-2xl p-6 border ${method.color} flex items-center gap-4`}
          >
            <div className="text-4xl">{method.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 mb-0.5">
                {t(`order.confirmation.payment.methods.${method.id}`, method.name)}
              </p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">
              {t('account.payment.supported')}
            </div>
          </div>
        ))}
      </div>

      {/* 저장된 카드 */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">{t('account.payment.savedCards.title')}</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
            <Plus className="w-4 h-4" />
            {t('account.payment.savedCards.addCard')}
          </button>
        </div>
        <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
          <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="font-bold text-gray-400 mb-1">{t('account.payment.savedCards.emptyTitle')}</p>
          <p className="text-xs text-gray-400">
            {t('account.payment.savedCards.emptyDesc')}
          </p>
        </div>
      </div>

      {/* 보안 안내 */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-bold mb-1 text-blue-900">{t('account.payment.security.title')}</h3>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              {t('account.payment.security.desc')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}