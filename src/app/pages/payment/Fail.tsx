import { useSearchParams, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ONSITE_TOKEN_KEY } from '@/api/onsite';

const KNOWN_ERRORS = new Set<string>([
  'USER_CANCEL',
  'REJECT_CARD_COMPANY',
  'INVALID_CARD_EXPIRATION',
  'INVALID_STOPPED_CARD',
  'EXCEED_MAX_DAILY_PAYMENT_COUNT',
  'EXCEED_MAX_PAYMENT_AMOUNT',
  'INVALID_CARD_INSTALLMENT_PLAN',
  'NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT',
  'REJECT_CARD_PAYMENT',
  'REJECT_TOSSPAY_INVALID_ACCOUNT',
  'INVALID_PASSWORD',
  'NOT_AVAILABLE_BANK',
  'PAYMENT_AMOUNT_MISMATCH',
  'TOSS_ERROR',
]);

export default function PaymentFail() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const onSiteToken = peekOnSiteToken();

  const errorCode = searchParams.get('code');
  const rawMessage = searchParams.get('message');

  const orderId = searchParams.get('orderId');
  const errorMessage =
    (errorCode && KNOWN_ERRORS.has(errorCode) ? t(`payment.errors.${errorCode}`) : null) ||
    rawMessage ||
    t('payment.cancelled');

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center p-8 max-w-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">{t('payment.failTitle')}</h1>
        <p className="text-gray-500 text-sm mb-1">{errorMessage}</p>
        {errorCode && (
          <p className="text-gray-300 text-xs mb-8">({errorCode})</p>
        )}
        <div className="space-y-3">
          {onSiteToken ? (
            <button
              onClick={() => navigate(`/pay/${onSiteToken}`)}
              className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors"
            >
              {t('onsite.retry')}
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors"
              >
                {t('payment.retry')}
              </button>
              <button
                onClick={() => navigate('/cart')}
                className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                {t('checkout.backToCart')}
              </button>
            </>
          )}
        </div>
        {orderId && (
          <p className="text-[10px] text-gray-300 mt-4">{t('payment.orderNo', { no: orderId })}</p>
        )}
      </div>
    </div>
  );
}

function peekOnSiteToken(): string | null {
  try {
    return sessionStorage.getItem(ONSITE_TOKEN_KEY);
  } catch {
    return null;
  }
}
