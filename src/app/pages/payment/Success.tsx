import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { confirmPayment } from '@/api/payment';
import { getOrder } from '@/api/order';

type Status = 'pending' | 'success' | 'error';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus]   = useState<Status>('pending');
  const [errorMsg, setErrorMsg] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const paymentKey = searchParams.get('paymentKey');
    const orderId    = searchParams.get('orderId');
    const amount     = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      navigate('/', { replace: true });
      return;
    }

    const confirm = async () => {
      try {
        await confirmPayment(paymentKey, orderId, Number(amount));

        window.dispatchEvent(new Event('cart-updated'));

        let orderDetail: any = null;
        try {
          const orderRes = await getOrder(orderId);
          orderDetail = orderRes.data.data;
        } catch {
        }

        setStatus('success');

        navigate('/checkout/success', {
          state: {
            orderNo: orderId,
            orderInfo: orderDetail ? {
              total: orderDetail.totalAmount,
              subtotal: orderDetail.productAmount ?? orderDetail.subtotal ?? orderDetail.totalAmount,
              shipping: orderDetail.shippingAmount ?? orderDetail.shippingFee ?? 0,
              items: orderDetail.orderItems ?? orderDetail.items ?? [],
            } : null,
            shippingAddress: orderDetail?.shipment ? {
              recipient: orderDetail.shipment.recipientName,
              phone: orderDetail.shipment.recipientPhone,
              address: `[${orderDetail.shipment.zipCode}] ${orderDetail.shipment.address1}`,
              address2: orderDetail.shipment.address2,
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
  }, [searchParams, navigate]);

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
              className="w-full py-3 bg-koala-navy text-white rounded-xl hover:bg-koala-navy-hover transition-colors"
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
