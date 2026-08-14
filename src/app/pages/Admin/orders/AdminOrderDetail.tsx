import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAdminOrder, registerTracking, markDelivered, adminCancelOrder, getCarriers, type Carrier } from '@/api/adminApi';
import { ArrowLeft, Truck, XCircle } from 'lucide-react';

function carrierName(code: string, carriers: Carrier[]) {
  return carriers.find((c) => c.code === code)?.name ?? code;
}

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: '결제대기', PAID: '결제완료', PREPARING: '준비중',
  SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소',
};
const PAYMENT_STATUS_LABEL: Record<string, string> = {
  READY: '결제전', PAID: '결제완료', CANCELLED: '취소/환불',
  FAILED: '실패', PARTIAL_REFUNDED: '부분환불', REFUNDED: '환불완료',

  CAPTURED: '결제완료', IN_PROGRESS: '승인 처리 중',
  IN_DOUBT: '승인 여부 미확정', CANCEL_IN_PROGRESS: '환불 처리 중',
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
  const [carriers, setCarriers] = useState<Carrier[]>([]);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelAmount, setCancelAmount] = useState('');
  const [isPartial, setIsPartial] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  const reload = useCallback(() => {
    if (!orderNo) return;
    setLoading(true);
    getAdminOrder(orderNo).then(setOrder).finally(() => setLoading(false));
  }, [orderNo]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => { getCarriers().then(setCarriers).catch(() => setCarriers([])); }, []);

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

  const handleCancelOrder = async () => {
    if (!orderNo || !cancelReason.trim()) { setCancelError('취소 사유를 입력해주세요.'); return; }
    if (isPartial && (!cancelAmount || Number(cancelAmount) <= 0)) {
      setCancelError('환불 금액을 올바르게 입력해주세요.');
      return;
    }
    setCancelling(true);
    setCancelError('');
    try {
      await adminCancelOrder(
        orderNo,
        cancelReason.trim(),
        isPartial ? Number(cancelAmount) : undefined
      );
      setCancelOpen(false);
      setCancelReason('');
      setCancelAmount('');
      setIsPartial(false);
      reload();
    } catch (e: any) {
      setCancelError(e?.response?.data?.message ?? '취소 처리에 실패했습니다.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  if (!order) return <div className="p-8 text-sm text-gray-400">주문을 찾을 수 없습니다.</div>;

  const isCancelled = order.orderStatus === 'CANCELLED';
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
        <div className="flex gap-2 flex-wrap justify-end flex-shrink-0">
          {canRegisterTracking && (
            <button onClick={() => setTrackingOpen(true)} className="flex items-center gap-1.5 px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors">
              <Truck className="w-3.5 h-3.5" /> 운송장 등록
            </button>
          )}
          {canMarkDelivered && (
            <button onClick={handleMarkDelivered} className="px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              배송완료 처리
            </button>
          )}
          {!isCancelled && (
            <button
              onClick={() => { setCancelOpen(true); setCancelError(''); }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" /> 주문 취소
            </button>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <Section title="주문 상태">
          <Row label="주문 상태" value={ORDER_STATUS_LABEL[order.orderStatus] ?? order.orderStatus} />
          <Row label="결제 상태" value={PAYMENT_STATUS_LABEL[order.paymentStatus] ?? order.paymentStatus} />
          {order.paidAt && <Row label="결제일" value={new Date(order.paidAt).toLocaleString('ko-KR')} />}
          {order.cancelledAt && <Row label="취소일" value={new Date(order.cancelledAt).toLocaleString('ko-KR')} />}
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
            {order.shipment.carrierCode && (
              <>
                <Row label="택배사" value={carrierName(order.shipment.carrierCode, carriers)} />
                <Row label="운송장번호" value={order.shipment.trackingNo} />
              </>
            )}
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
                <select value={carrierCode} onChange={(e) => setCarrierCode(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10">
                  <option value="">선택하세요</option>
                  {carriers.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-400 mt-1.5">목록에서 고르면 배송완료가 자동으로 처리됩니다.</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">운송장 번호</label>
                <input value={trackingNo} onChange={(e) => setTrackingNo(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="운송장 번호" />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setTrackingOpen(false); setCarrierCode(''); setTrackingNo(''); }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleRegisterTracking} disabled={submitting || !carrierCode.trim() || !trackingNo.trim()} className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">{submitting ? '등록 중...' : '등록'}</button>
            </div>
          </div>
        </div>
      )}

      {cancelOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-1">주문 취소</h2>
            <p className="text-xs text-gray-400 mb-4">
              배송 상태에 관계없이 강제 취소됩니다. 결제 완료 건은 자동 환불이 시도됩니다.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">취소 사유 <span className="text-red-500">*</span></label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  placeholder="취소 사유를 입력하세요"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPartial}
                    onChange={(e) => { setIsPartial(e.target.checked); setCancelAmount(''); }}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">부분 환불</span>
                  <span className="text-xs text-gray-400">(체크 안 하면 전액 환불)</span>
                </label>
              </div>

              {isPartial && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    환불 금액 <span className="text-xs text-gray-400">(최대 {Number(order.totalAmount).toLocaleString()}원)</span>
                  </label>
                  <input
                    type="number"
                    value={cancelAmount}
                    onChange={(e) => setCancelAmount(e.target.value)}
                    min={1}
                    max={order.totalAmount}
                    placeholder="환불할 금액 입력"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  />
                </div>
              )}

              {cancelError && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{cancelError}</p>
              )}
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setCancelOpen(false); setCancelReason(''); setCancelAmount(''); setIsPartial(false); setCancelError(''); }}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 py-2.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {cancelling ? '처리 중...' : '취소 확정'}
              </button>
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
