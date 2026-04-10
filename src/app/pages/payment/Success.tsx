import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { confirmPayment } from '@/api/payment';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      navigate('/');
      return;
    }

    const confirm = async () => {
      try {
        await confirmPayment(paymentKey, orderId, Number(amount));
        window.dispatchEvent(new Event('cart-updated'));
        navigate('/checkout/success', {
          state: { orderNo: orderId },
          replace: true,
        });
      } catch (e: any) {
        setError(e.response?.data?.message || '결제 승인에 실패했습니다.');
      }
    };

    confirm();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/cart')}
            className="px-6 py-3 bg-black text-white rounded-xl"
          >
            장바구니로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">결제 승인 처리 중...</p>
      </div>
    </div>
  );
}
