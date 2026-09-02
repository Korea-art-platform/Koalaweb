import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Package } from 'lucide-react';
import { lookupGuestOrder } from '@/api/order';
import { formatWon } from '@/app/lib/price';

/**
 * 비회원 주문 조회.
 *
 * 로그인이 없으니 주문번호와 주문할 때 적은 휴대폰번호로 본인을 가린다.
 * 서버는 없는 주문과 번호가 틀린 경우를 같은 말로 돌려준다 — 다르게 답하면
 * 번호를 넣어 보는 것만으로 어떤 주문이 있는지 알아낼 수 있다.
 */
export default function GuestOrderLookup() {
  const [orderNo, setOrderNo] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setOrder(null);
    setLoading(true);
    try {
      const res = await lookupGuestOrder(orderNo.trim(), phone.trim());
      const found = res?.data?.data;

      // CloudFront 가 API 의 404 를 SPA 페이지(HTTP 200)로 바꿔 돌려준다.
      // 그대로 두면 못 찾았는데도 오류로 잡히지 않아 아무 반응 없이 멈춘다.
      if (!found || typeof found !== 'object' || !found.orderNo) {
        setError('주문번호나 휴대폰번호가 맞지 않습니다.');
        return;
      }
      setOrder(found);
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      // 너무 자주 시도하면 서버가 막는다. 왜 막혔는지 알려 주지 않으면
      // 고장으로 오해하고 계속 누른다.
      setError(status === 429
        ? '조회를 너무 자주 시도했습니다. 잠시 뒤에 다시 해 주세요.'
        : message ?? '주문을 찾지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const field = 'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-koala-purple/20 focus:border-koala-purple';

  return (
    <div className="mx-auto max-w-lg px-6 py-16 md:py-24">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">주문 조회</h1>
      <p className="mt-2 text-sm text-gray-500 break-keep">
        회원가입 없이 주문하셨다면 주문번호와 주문하실 때 적으신 휴대폰번호로 찾으실 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3">
        <div>
          <label htmlFor="orderNo" className="mb-1.5 block text-xs font-medium text-gray-500">주문번호</label>
          <input
            id="orderNo" value={orderNo} onChange={(e) => setOrderNo(e.target.value)}
            placeholder="KL-20260902..." className={field} autoComplete="off" required
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-gray-500">휴대폰번호</label>
          <input
            id="phone" value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000" className={field} inputMode="tel" autoComplete="tel" required
          />
        </div>

        <button
          type="submit" disabled={loading || !orderNo.trim() || !phone.trim()}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-koala-purple py-3.5 text-sm
            font-bold text-white transition-colors hover:bg-koala-purple-hover disabled:opacity-40"
        >
          <Search className="h-4 w-4" />
          {loading ? '찾는 중...' : '주문 조회'}
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      {order && (
        <div className="mt-8 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="font-mono text-sm text-gray-500">{order.orderNo}</span>
            <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
              {order.orderStatus}
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
