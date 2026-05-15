/**
 * [DEPRECATED] 이 페이지는 더 이상 결제 흐름에서 사용되지 않습니다.
 * 실제 결제 흐름: Checkout.tsx → Toss SDK → /payment/success | /payment/fail
 * /checkout/confirm 으로 직접 접근하는 경우 /checkout 으로 리다이렉트합니다.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/checkout', { replace: true });
  }, [navigate]);

  return null;
}
