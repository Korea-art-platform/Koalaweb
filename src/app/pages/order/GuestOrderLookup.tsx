import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Package, ChevronRight } from 'lucide-react';
import { listGuestOrders, lookupGuestOrder } from '@/api/order';
import { formatWon } from '@/app/lib/price';

/**
 * 비회원 주문 조회.
 *
 * 로그인이 없으니 두 가지를 맞춰야 열린다. 주문번호를 알면 주문번호+휴대폰으로 한 건을,
 * 잃어버렸으면 이메일+휴대폰으로 최근 내역을 찾는다. 서버는 없는 주문과 값이 틀린 경우를
 * 같은 말로 돌려준다 — 다르게 답하면 번호를 넣어 보는 것만으로 어떤 주문이 있는지 알아낼 수 있다.
 */

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: '결제 대기',
  PAID: '결제 완료',
  PREPARING: '준비 중',
  SHIPPED: '배송 중',
  DELIVERED: '배송 완료',
  CANCELLED: '취소',
};

type Mode = 'orderNo' | 'email';

function errorMessage(err: unknown, fallback: string) {
  const status = (err as { response?: { status?: number } })?.response?.status;
  const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  if (status === 429) return '조회를 너무 자주 시도했습니다. 잠시 뒤에 다시 해 주세요.';
  return message ?? fallback;
}

export default function GuestOrderLookup() {
  const [mode, setMode] = useState<Mode>('orderNo');
  const [orderNo, setOrderNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setOrder(null);
    setOrders(null);
  };

  const openDetail = async (no: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await lookupGuestOrder(no, phone.trim());
      const found = res?.data?.data;
      if (!found || typeof found !== 'object' || !found.orderNo) {
        setError('주문을 불러오지 못했습니다.');
        return;
      }
      setOrder(found);
    } catch (err) {
      setError(errorMessage(err, '주문을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setOrder(null);
    setOrders(null);
    setLoading(true);
    try {
      if (mode === 'orderNo') {
        const res = await lookupGuestOrder(orderNo.trim(), phone.trim());
        const found = res?.data?.data;

        // CloudFront 가 API 의 404 를 SPA 페이지(HTTP 200)로 바꿔 돌려준다.
        // 그대로 두면 못 찾았는데도 오류로 잡히지 않아 아무 반응 없이 멈춘다.
        if (!found || typeof found !== 'object' || !found.orderNo) {
          setError('주문번호나 휴대폰번호가 맞지 않습니다.');
          return;
        }
        setOrder(found);
        return;
      }

      const res = await listGuestOrders(email.trim(), phone.trim());
      const found = res?.data?.data;
      setOrders(Array.isArray(found) ? found : []);
    } catch (err) {
      setError(errorMessage(err, mode === 'orderNo'
        ? '주문을 찾지 못했습니다.'
        : '주문 내역을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-koala-purple/20 focus:border-koala-purple';
  const tab = (active: boolean) =>
    `flex-1 rounded-lg py-2.5 text-sm font-bold transition-colors ${
      active ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
    }`;
  const canSubmit = phone.trim() && (mode === 'orderNo' ? orderNo.trim() : email.trim());

  return (
    <div className="mx-auto max-w-lg px-6 pb-16 pt-28 md:pb-24 md:pt-32">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">주문 조회</h1>
      <p className="mt-2 text-sm text-gray-500 break-keep">
        회원가입 없이 주문하셨다면 여기서 찾으실 수 있습니다.
      </p>

      <div className="mt-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        <button type="button" onClick={() => switchMode('orderNo')} className={tab(mode === 'orderNo')}>
          주문번호로 찾기
        </button>
        <button type="button" onClick={() => switchMode('email')} className={tab(mode === 'email')}>
          이메일로 내역 보기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
        {mode === 'orderNo' ? (
          <div>
            <label htmlFor="orderNo" className="mb-1.5 block text-xs font-medium text-gray-500">주문번호</label>
            <input
              id="orderNo" value={orderNo} onChange={(e) => setOrderNo(e.target.value)}
              placeholder="KL-20260902..." className={field} autoComplete="off" required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-gray-500">이메일</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="buyer@example.com" className={field} autoComplete="email" required
            />
          </div>
        )}
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-gray-500">휴대폰번호</label>
          <input
            id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000" className={field} inputMode="tel" autoComplete="tel" required
          />
        </div>

        <button
          type="submit" disabled={loading || !canSubmit}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-koala-purple py-3.5 text-sm
            font-bold text-white transition-colors hover:bg-koala-purple-hover disabled:opacity-40"
        >
          <Search className="h-4 w-4" />
          {loading ? '찾는 중...' : mode === 'orderNo' ? '주문 조회' : '주문 내역 보기'}
        </button>
      </form>

      {mode === 'email' && (
        <p className="mt-3 text-xs text-gray-400 break-keep">
          주문할 때 적으신 이메일과 휴대폰번호가 모두 맞아야 열립니다. 최근 6개월 주문을 보여드립니다.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {orders && orders.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-400">
          최근 6개월 안에 주문이 없습니다.
        </p>
      )}

      {orders && orders.length > 0 && (
        <ul className="mt-8 flex flex-col gap-2">
          {orders.map((row: any) => (
            <li key={row.orderNo}>
              <button
                type="button"
                onClick={() => openDetail(row.orderNo)}
                className="flex w-full items-center gap-3 rounded-2xl border border-gray-200 p-4 text-left transition-colors hover:border-gray-900"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gray-400">{row.orderNo}</span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                      {STATUS_LABEL[row.orderStatus] ?? row.orderStatus}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-gray-900">
                    {row.firstSkuName}
                    {row.itemCount > 1 && <span className="text-gray-400"> 외 {row.itemCount - 1}건</span>}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {row.createdAt ? row.createdAt.slice(0, 10) : ''}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-bold tabular-nums">₩{formatWon(row.totalAmount)}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-300" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {order && (
        <div className="mt-8 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-sm text-gray-500">{order.orderNo}</span>
            <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {STATUS_LABEL[order.orderStatus] ?? order.orderStatus}
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {(order.items ?? []).map((item: any, i: number) => (
              <li key={i} className="flex items-center justify-between gap-4 py-3">
                <span className="min-w-0 truncate text-sm text-gray-900">
                  {item.skuNameSnapshot ?? item.skuName}
                  <span className="ml-2 text-gray-400">× {item.quantity}</span>
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  ₩{formatWon(item.lineTotalAmount ?? item.lineAmount)}
                </span>
              </li>
            ))}
          </ul>

          {order.shipment && (
            <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500">
              <p className="font-medium text-gray-900">{order.shipment.recipientName}</p>
              <p className="break-keep">
                ({order.shipment.zipCode}) {order.shipment.address1} {order.shipment.address2}
              </p>
              {order.shipment.trackingNo && (
                <p className="mt-1">운송장 {order.shipment.courier} {order.shipment.trackingNo}</p>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-900 pt-4">
            <span className="text-sm font-bold">결제 금액</span>
            <span className="text-lg font-bold tabular-nums">₩{formatWon(order.totalAmount)}</span>
          </div>
        </div>
      )}

      <p className="mt-10 text-xs text-gray-400">
        회원이시라면{' '}
        <Link to="/login" className="font-medium text-koala-purple hover:underline">로그인</Link>
        {' '}후 주문 내역에서 보실 수 있습니다.
      </p>
    </div>
  );
}
