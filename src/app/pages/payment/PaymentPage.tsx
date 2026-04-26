import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { Check, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Toss Payment API 개별 연동 방식 (test_ck_... 키 사용)
// 위젯(test_gck_...) 심사 전까지 사용하는 방식
// 흐름: loadTossPayments → payment() → requestPayment() → success/fail redirect
// ─────────────────────────────────────────────────────────────────────────────

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY as string;

export interface PaymentPageState {
  orderId: string;
  amount: number;
  orderName: string;
  customerKey?: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
}

type PaymentMethod = 'CARD' | 'TOSS' | 'KAKAOPAY' | 'NAVERPAY';

const METHODS: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { id: 'CARD',      label: '신용/체크카드', icon: '💳', desc: '일반 카드 결제' },
  { id: 'TOSS',      label: '토스페이',      icon: '💙', desc: '토스 앱 간편결제' },
  { id: 'KAKAOPAY',  label: '카카오페이',    icon: '💛', desc: '카카오톡 간편결제' },
  { id: 'NAVERPAY',  label: '네이버페이',    icon: '💚', desc: '네이버 포인트 적립' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentPageState | null;

  const [selected, setSelected]       = useState<PaymentMethod>('CARD');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state?.orderId || !state?.amount) {
    navigate('/cart', { replace: true });
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const tossPayments = await loadTossPayments(CLIENT_KEY);
      const payment = tossPayments.payment({
        customerKey: state.customerKey ?? ANONYMOUS,
      });

      const commonParams = {
        amount: { currency: 'KRW' as const, value: state.amount },
        orderId: state.orderId,
        orderName: state.orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: state.customerEmail,
        customerName: state.customerName,
        customerMobilePhone: state.customerMobilePhone,
      };

      if (selected === 'CARD') {
        await payment.requestPayment({
          method: 'CARD',
          ...commonParams,
          card: { useEscrow: false, useCardPoint: false },
        });
      } else {
        await payment.requestPayment({
          method: 'EASY_PAY',
          ...commonParams,
          easyPay: { easyPayType: selected },
        });
      }
    } catch (e: any) {
      if (e?.code !== 'USER_CANCEL') {
        alert(e?.message ?? '결제 요청에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[560px] mx-auto pt-16 pb-24 px-4">

        {/* 헤더 */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-black transition-colors mb-4 flex items-center gap-1"
          >
            ← 뒤로가기
          </button>
          <h1 className="text-2xl font-bold tracking-tight">결제</h1>
          <p className="text-sm text-gray-500 mt-1 truncate">{state.orderName}</p>
        </div>

        {/* 결제 수단 선택 */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-500 mb-4">결제 수단</h2>
          <div className="grid grid-cols-2 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selected === m.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <span className="text-2xl">{m.icon}</span>
                <span className="text-xs font-bold text-gray-900">{m.label}</span>
                <span className="text-[10px] text-gray-400">{m.desc}</span>
                {selected === m.id && (
                  <div className="w-4 h-4 bg-black rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 금액 요약 */}
        <div className="bg-white rounded-[24px] border border-gray-100 px-6 py-5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">최종 결제 금액</span>
            <span className="text-2xl font-black tracking-tight">
              ₩{state.amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 결제하기 버튼 */}
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`
            w-full py-5 rounded-2xl font-bold text-base transition-all duration-150 flex items-center justify-center gap-2
            ${!isProcessing
              ? 'bg-black text-white hover:bg-gray-900 active:scale-[0.98] shadow-lg shadow-black/10'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }
          `}
        >
          {isProcessing ? (
            <>
              <span className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
              결제 진행 중...
            </>
          ) : (
            <>
              ₩{state.amount.toLocaleString()} 결제하기
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-gray-400 mt-4">
          보안 결제 시스템으로 고객님의 정보는 암호화되어 안전하게 보호됩니다.
        </p>
      </div>
    </div>
  );
}
