import { useSearchParams, useNavigate } from 'react-router';

const TOSS_ERROR_MESSAGES: Record<string, string> = {
  USER_CANCEL: '결제를 취소하셨습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했습니다. 카드 정보를 확인해 주세요.',
  INVALID_CARD_EXPIRATION: '카드 유효기간이 올바르지 않습니다.',
  INVALID_STOPPED_CARD: '정지된 카드입니다.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '하루 결제 한도를 초과했습니다.',
  EXCEED_MAX_PAYMENT_AMOUNT: '결제 가능 금액을 초과했습니다.',
  INVALID_CARD_INSTALLMENT_PLAN: '할부 개월 수가 올바르지 않습니다.',
  NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT: '이 카드는 할부가 지원되지 않습니다.',
  REJECT_CARD_PAYMENT: '카드사에서 결제를 거부했습니다.',
  REJECT_TOSSPAY_INVALID_ACCOUNT: '토스페이에 등록된 계좌가 없습니다.',
  INVALID_PASSWORD: '결제 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.',
  NOT_AVAILABLE_BANK: '현재 이용할 수 없는 은행입니다.',
  PAYMENT_AMOUNT_MISMATCH: '결제 금액이 일치하지 않습니다. 다시 시도해 주세요.',
  TOSS_ERROR: '결제 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
};

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const errorCode = searchParams.get('code');
  const rawMessage = searchParams.get('message');
  // Toss가 failUrl에 붙여주는 orderId — 결제 재시도 시 Checkout으로 돌아가는 데 사용
  const orderId = searchParams.get('orderId');
  const errorMessage =
    (errorCode && TOSS_ERROR_MESSAGES[errorCode]) ||
    rawMessage ||
    '결제가 취소되었습니다.';

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center p-8 max-w-sm">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">✕</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">결제 실패</h1>
        <p className="text-gray-500 text-sm mb-1">{errorMessage}</p>
        {errorCode && (
          <p className="text-gray-300 text-xs mb-8">({errorCode})</p>
        )}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="w-full py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            장바구니로 돌아가기
          </button>
        </div>
        {orderId && (
          <p className="text-[10px] text-gray-300 mt-4">주문번호: {orderId}</p>
        )}
      </div>
    </div>
  );
}
