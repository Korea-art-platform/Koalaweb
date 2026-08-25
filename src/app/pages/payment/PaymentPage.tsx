import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Check, ChevronRight } from 'lucide-react';
import { startPayment, isUserCancel, PAY_METHODS, type PayMethod } from '@/app/lib/pg';
import { payMethodIcon } from '@/app/components/common/PayMethodIcons';

export interface PaymentPageState {
  orderId: string;
  amount: number;
  orderName: string;
  customerKey?: string;
  customerEmail?: string;
  customerName?: string;
  customerMobilePhone?: string;
}

const METHODS = PAY_METHODS;

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as PaymentPageState | null;

  const [selected, setSelected]         = useState<PayMethod>(METHODS[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!state?.orderId || !state?.amount) {
    navigate('/cart', { replace: true });
    return null;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await startPayment({
        method: selected,
        orderNo: state.orderId,
        amount: state.amount,
        orderName: state.orderName,
        customerKey: state.customerKey,
        customerName: state.customerName,
        customerEmail: state.customerEmail,
        customerMobilePhone: state.customerMobilePhone,
        onError: (message) => {
          setIsProcessing(false);
          alert(message);
        },
      });
    } catch (e: unknown) {
      if (!isUserCancel(e)) {
        alert((e as { message?: string })?.message ?? '결제 요청에 실패했습니다. 다시 시도해 주세요.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const iconFor = (id: PayMethod, size: number) => payMethodIcon(id, size);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[560px] mx-auto pt-16 pb-24 px-4">
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
        <div className="bg-white rounded-[24px] border border-gray-100 p-6 mb-4">
          <h2 className="text-sm font-bold text-gray-500 mb-4">결제 수단</h2>
          <div className="grid grid-cols-3 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  selected === m.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                {iconFor(m.id, 40)}
                <span className="text-xs font-bold text-gray-900 text-center leading-tight">{m.label}</span>
                {selected === m.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-koala-navy rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 text-center">
            {METHODS.find((m) => m.id === selected)?.desc}
          </p>
        </div>
        <div className="bg-white rounded-[24px] border border-gray-100 px-6 py-5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">최종 결제 금액</span>
            <span className="text-2xl font-black tracking-tight">
              ₩{state.amount.toLocaleString()}
            </span>
          </div>
        </div>
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className={`
            w-full py-5 rounded-2xl font-bold text-base transition-all duration-150 flex items-center justify-center gap-2
            ${!isProcessing
              ? 'bg-koala-navy text-white hover:bg-koala-navy-hover active:scale-[0.98] shadow-lg shadow-black/10'
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
