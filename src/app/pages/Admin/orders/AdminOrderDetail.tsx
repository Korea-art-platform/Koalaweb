import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAdminOrder, registerTracking, markDelivered } from '@/api/adminApi';
import { ArrowLeft, Truck } from 'lucide-react';

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제대기', PAID: '결제완료', PREPARING: '준비중',
  SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소',
};
const PAYMENT_STATUS_LABEL: Record<string, string> = {
  UNPAID: '미결제', PAID: '결제완료', PARTIAL_REFUNDED: '부분환불', REFUNDED: '환불완료',
};

export default function AdminOrderDetail() {
  const { orderNo } = useParams<{ orderNo: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [carrierCode, setCarrierCode] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = () => {
    if (!orderNo) return;
    setLoading(true);
    getAdminOrder(orderNo).then(setOrder).finally(() => setLoading(false));
  };

  useEffect(() => { reload(); }, [orderNo]);

  const handleRegisterTracking = async () => {
    if (!orderNo || !carrierCode.trim() || !trackingNo.trim()) return;
    setSubmitting(true);
    try {
      await registerTracking(orderNo, carrierCode.trim(), trackingNo.trim());
      setTrackingOpen(false);
      setCarrierCode('');
      setTrackingNo('');
      reload();
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkDelivered = async () => {
    if (!orderNo || !window.confirm('배송 완료로 처리하시겠습니까?')) return;
    await markDelivered(orderNo);
    reload();
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  if (!order) return <div className="p-8 text-sm text-gray-400">주문을 찾을 수 없습니다.</div>;

  const canRegisterTracking = ['PAID', 'PREPARING'].includes(order.orderStatus);
  const canMarkDelivered = order.orderStatus === 'SHIPPED';

  return (
    <div className="p-8 max-w-3xl">
      <button onClick={() => navigate('/admin/orders')} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> 목록으로
      </button>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-1">{order.orderNo}</p>
          <h1 className="text-xl font-bold text-gray-900">주문 상세</h1>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          {canRegisterTracking && (
            <button onClick={() => setTrackingOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
              <Truck className="w-3.5 h-3.5" /> 운송장 등록
            </button>
          )}
          {canMarkDelivered && (
            <button onClick={handleMarkDelivered} className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              배송완료 처리
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Section title="주문 상태">
          <Row label="주문 상태" value={ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus} />
          <Row label="결제 상태" value={PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus} />
          {order.paidAt && <Row label="결제일" value={new Date(order.paidAt).toLocaleString('ko-KR')} />}
          <Row label="주문일" value={new Date(order.createdAt).toLocaleString('ko-KR')} />
        </Section>
        <Section title="주문자 정보">
          <Row label="이름" value={order.ordererName} />
          <Row label="이메일" value={order.ordererEmail} />
          <Row label="연락처" value={order.ordererPhone} />
        </Section>
        {order.shipment && (
          <Section title="배송지">
            <Row label="수령인" value={order.shipment.recipientName} />
            <Row label="연락처" value={order.shipment.recipientPhone} />
            <Row label="주소" value={'(' + order.shipment.zipCode + ') ' + order.shipment.address1 + (order.shipment.address2 ? ' ' + order.shipment.address2 : '')} />
            {order.shipment.deliveryRequest && <Row label="배송 요청사항" value={order.shipment.deliveryRequest} />}
            {order.shipment.carrierCode && <>
              <Row label="택배사" value={order.shipment.carrierCode} />
              <Row label="운송장번호" value={order.shipment.trackingNo} />
            </>}
          </Section>
        )}
        <Section title="주문 상품">
          <div className="space-y-3 pt-1">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-gray-800 font-medium">{item.skuName}</p>
                  {item.artistName && <p className="text-xs text-gray-400">{item.artistName}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900 tabular-nums">{Number(item.lineTotalAmount).toLocaleString()}원</p>
                  <p className="text-xs text-gray-400">x {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>
        <Section title="결제 금액">
          <Row label="상품금액" value={Number(order.productAmount).toLocaleString() + '원'} />
          {Number(order.discountAmount) > 0 && <Row label="할인" value={'-' + Number(order.discountAmount).toLocaleString() + '원'} />}
          <Row label="배송비" value={Number(order.shippingAmount).toLocaleString() + '원'} />
          <div className="flex justify-between py-2 border-t border-gray-100 mt-1">
            <span className="text-sm font-semibold text-gray-900">총 결제금액</span>
            <span className="text-sm font-bold text-gray-900 tabular-nums">{Number(order.totalAmount).toLocaleString()}원</span>
          </div>
        </Section>
      </div>
      {trackingOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-4">운송장 등록</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">택배사</label>
                <input value={carrierCode} onChange={(e) => setCarrierCode(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="예: CJ대한통운" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">운송장 번호</label>
                <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="운송장 번호" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setTrackingOpen(false); setCarrierCode(''); setTrackingNo(''); }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleRegisterTracking} disabled={submitting || !carrierCode.trim() || !trackingNo.trim()} className="flex-1 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">{submitting ? '등록 중...' : '등록'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 text-sm border-b border-gray-50 last:border-0">
      <span className="text-gray-400 flex-shrink-0 mr-4">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  );
}
