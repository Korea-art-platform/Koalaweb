import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { confirmPayment } from '@/api/payment';
import { getOrder } from '@/api/order';

// ─────────────────────────────────────────────────────────────────────────────
// Toss 결제 성공 콜백 페이지
//
// Toss 리다이렉트 URL 예시:
//   /payment/success?paymentKey=pay_xxx&orderId=KOA-001&amount=50000
//
// 승인 흐름:
//   프론트(여기) → 우리 백엔드 /api/v1/payments/confirm
//               → 백엔드가 시크릿 키를 들고 Toss API 호출
//
//   시크릿 키는 서버 환경변수(TOSS_SECRET_KEY)에만 존재,
//   클라이언트 번들에는 절대 포함되지 않습니다.
// ─────────────────────────────────────────────────────────────────────────────

type Status = 'pending' | 'success' | 'error';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus]   = useState<Status>('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const calledRef = useRef(false); // Strict Mode 이중 호출 방지

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const paymentKey = searchParams.get('paymentKey');
    const orderId    = searchParams.get('orderId');
    const amount     = searchParams.get('amount');

    // 필수 파라미터 누락 시 홈으로
    if (!paymentKey || !orderId || !amount) {
      navigate('/', { replace: true });
      return;
    }

    const confirm = async () => {
      try {
        // 우리 백엔드로 승인 요청 → 백엔드가 시크릿 키로 Toss API 호출
        await confirmPayment(paymentKey, orderId, Number(amount));

        // 장바구니 갱신 이벤트 (Header 카운트 뱃지 동기화)
        window.dispatchEvent(new Event('cart-updated'));

        // 주문 상세 조회 — 완료 화면에 금액/상품 표시용
        let orderDetail: any = null;
        try {
          const orderRes = await getOrder(orderId);
          orderDetail = orderRes.data.data;
        } catch {
          // 조회 실패해도 완료 화면은 표시 (orderId만으로 fallback)
        }

        setStatus('success');

        navigate('/checkout/success', {
          state: {
            orderNo: orderId,
            orderInfo: orderDetail ? {
              total: orderDetail.totalAmount,
              subtotal: orderDetail.totalAmount,
              shipping: 0,
              items: orderDetail.orderItems ?? orderDetail.items ?? [],
            } : null,
            paymentMethod: '토스페이먼츠',
          },
          replace: true,
        });
      } catch (e: unknown) {
        const apiMsg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
        const errMsg = (e as { message?: string })?.message;
        setErrorMsg(apiMsg ?? errMsg ?? '결제 승인에 실패했습니다. 고객센터로 문의해 주세요.');
        setStatus('error');
      }
    };

    confirm();
  // calledRef 패턴으로 이중 호출 방지 — searchParams/navigate는 ref가 막아주므로 deps 명시
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, navigate]);

  // ── 에러 화면 ──────────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center p-8 max-w-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-bold mb-2">결제 승인 실패</h2>
          <p className="text-sm text-gray-500 mb-8">{errorMsg}</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 bg-black text-white rounded-xl hover:bg-gray-900 transition-colors"
            >
              장바구니로 돌아가기
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 승인 중 로딩 화면 ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin mx-auto mb-5" />
        <p className="font-medium text-gray-800">결제 승인 처리 중</p>
        <p className="text-sm text-gray-400 mt-1">잠시만 기다려 주세요...</p>
      </div>
    </div>
  );
}
