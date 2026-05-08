import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getAdminOrders } from '@/api/adminApi';
import { ChevronRight, ShoppingBag } from 'lucide-react';

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: '결제대기',
  PAID: '결제완료',
  PREPARING: '준비중',
  SHIPPED: '배송중',
  DELIVERED: '배송완료',
  CANCELLED: '취소',
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-violet-50 text-violet-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

export default function AdminOrderList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAdminOrders(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  const orders: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>주문 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">주문 목록</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">주문이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">주문번호</th>
                  <th className="text-left px-5 py-3 font-medium">상품</th>
                  <th className="text-left px-5 py-3 font-medium">금액</th>
                  <th className="text-left px-5 py-3 font-medium">주문상태</th>
                  <th className="text-left px-5 py-3 font-medium">주문일</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o: any) => (
                  <tr key={o.orderNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {o.orderNo}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-900">
                        {o.firstSkuName}
                        {o.itemCount > 1 ? ` 외 ${o.itemCount - 1}건` : ''}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-700 tabular-nums whitespace-nowrap">
                      {Number(o.totalAmount).toLocaleString()}원
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${ORDER_STATUS_COLOR[o.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABEL[o.orderStatus] ?? o.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/orders/${o.orderNo}`}
                        className="text-gray-300 hover:text-gray-700 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            이전
          </button>
          <span className="text-xs text-gray-500 tabular-nums">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
