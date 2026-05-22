import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { loadTossPayments, ANONYMOUS } from '@tosspayments/tosspayments-sdk';
import { Check, ChevronRight } from 'lucide-react';
import { isAppsInToss } from '@/utils/appsInToss';
import instance from '@/api/instance';

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

type PaymentMethod = 'TOSS' | 'TRANSFER';

// ── 토스페이 공식 로고 ─────────────────────────────────────────────────────────
function TossPayIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#0064FF" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fill="white" fontSize="22" fontWeight="800" fontFamily="'Pretendard','Apple SD Gothic Neo',sans-serif"
        letterSpacing="-1">
        toss
      </text>
    </svg>
  );
}

// ── 계좌이체 아이콘 ────────────────────────────────────────────────────────────
function BankTransferIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="12" fill="#F2F4F6" />
      <path d="M24 10L38 19H10L24 10Z" fill="#4E5968" />
      <rect x="13" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="22" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="31" y="21" width="4" height="12" rx="1" fill="#4E5968" />
      <rect x="10" y="34" width="28" height="3" rx="1.5" fill="#4E5968" />
    </svg>
  );
}

const METHODS: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: 'TOSS',     label: '토스페이', desc: '토스 앱 간편결제' },
  { id: 'TRANSFER', label: '계좌이체', desc: '실시간 계좌이체' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentPageState | null;
  const inToss = isAppsInToss();

  const [selected, setSelected]       = useState<PaymentMethod>('TOSS');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state?.orderId || !state?.amount) {
    navigate('/cart', { replace: true });
    return null;
  }

  // ── 앱인토스 환경: 토스페이 SDK 결제 ─────────────────────────────────────
  const handleTossPayPayment = async () => {
    setIsProcessing(true);
    try {
      // 1. 백엔드에서 결제 토큰 생성
      // TODO: 앱인토스 mTLS 인증서 설정 후 백엔드 API 연결
      const { data } = await instance.post<{ data: { payToken: string } }>(
        '/api/v1/payments/toss/create',
        {
          orderId: state.orderId,
          amount: state.amount,
          orderName: state.orderName,
        }
      );
      const payToken = data.data.payToken;

      // 2. 토스페이 결제창 호출
      const { checkoutPayment } = await import('@apps-in-toss/web-framework');
      const result = await checkoutPayment({ payToken });

      if (result.success) {
        // 3. 백엔드에서 결제 최종 승인
        await instance.post('/api/v1/payments/toss/execute', { payToken, orderId: state.orderId });
        navigate('/payment/success', { state: { orderId: state.orderId } });
      } else {
        if (result.reason !== 'USER_CANCEL') {
          alert(result.reason ?? '결제에 실패했습니다. 다시 시도해 주세요.');
        }
      }
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message;
      alert(msg ?? '결제 요청에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsProcessing(false);
    }
  };

  // ── 일반 웹: 토스페이먼츠 PG 결제 ────────────────────────────────────────
  const handleTossPaymentsPayment = async () => {
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

      if (selected === 'TRANSFER') {
        await payment.requestPayment({
          method: 'TRANSFER',
          ...commonParams,
          transfer: { cashReceiptType: 'PERSONAL', customerIdentityNumber: state.customerMobilePhone ?? '' },
        });
      } else {
        // TOSS: 토스페이 간편결제
        await payment.requestPayment({
          method: 'CARD',
          ...commonParams,
          card: { flowMode: 'DIRECT', easyPay: 'TOSSPAY' },
        });
      }
    } catch (e: unknown) {
      const code = (e as { code?: string })?.code;
      const msg = (e as { message?: string })?.message;
      if (code !== 'USER_CANCEL') {
        alert(msg ?? '결제 요청에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = isAppsInToss() ? handleTossPayPayment : handleTossPaymentsPayment;

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

          {inToss ? (
            /* 앱인토스: 토스페이만 표시 */
            <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-black bg-gray-50">
              <TossPayIcon size={36} />
              <div>
                <p className="text-xs font-bold text-gray-900">토스페이</p>
                <p className="text-[10px] text-gray-400">토스 앱 간편결제</p>
              </div>
              <div className="ml-auto w-4 h-4 bg-black rounded-full flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          ) : (
            /* 일반 웹: 결제 수단 선택 */
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
                  {m.id === 'TOSS' ? <TossPayIcon size={40} /> : <BankTransferIcon size={40} />}
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
          )}
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
