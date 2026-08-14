import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { getAdminOrders } from '@/api/adminApi';
import { ChevronRight, ShoppingBag, Search, X } from 'lucide-react';

const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: '결제대기',
  PAID: '결제완료',
  PREPARING: '준비중',
  SHIPPED: '배송중',
  DELIVERED: '배송완료',
  CANCELLED: '취소',
};

const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-violet-50 text-violet-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

type SearchType = 'userId' | 'name' | 'phone';

export default function AdminOrderList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchType, setSearchType] = useState<SearchType>('name');
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState<{ userId?: number; name?: string; phone?: string }>({});

  const fetchOrders = useCallback((p: number, search: typeof appliedSearch) => {
    setLoading(true);
    getAdminOrders(p, 20, Object.keys(search).length ? search : undefined)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchOrders(page, appliedSearch);
  }, [page, appliedSearch, fetchOrders]);

  const handleSearch = () => {
    const val = searchInput.trim();
    if (!val) { handleReset(); return; }
    const search: typeof appliedSearch =
      searchType === 'userId' ? { userId: Number(val) }
      : searchType === 'name'   ? { name: val }
      : { phone: val };
    setPage(0);
    setAppliedSearch(search);
  };

  const handleReset = () => {
    setSearchInput('');
    setAppliedSearch({});
    setPage(0);
  };

  const isSearched = Object.keys(appliedSearch).length > 0;
  const orders: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;
  const totalElements: number = data?.totalElements ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <ShoppingBag className="w-3.5 h-3.5" />
        <span>주문 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">주문 목록</h1>
      <div className="flex gap-2 mb-4">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/10"
        >
          <option value="name">주문자명</option>
          <option value="phone">전화번호</option>
          <option value="userId">회원 ID</option>
        </select>
        <div className="flex flex-1 max-w-sm gap-1.5">
          <input
            type={searchType === 'userId' ? 'number' : 'text'}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={
              searchType === 'userId' ? '회원 ID 입력'
              : searchType === 'name'   ? '주문자 이름 검색'
              : '전화번호 검색 (010-...)'
            }
            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          {isSearched && (
            <button
              onClick={handleReset}
              className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {isSearched && (
          <span className="self-center text-xs text-gray-400">
            검색 결과 <span className="font-semibold text-gray-700">{totalElements}</span>건
          </span>
        )}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">
            {isSearched ? '검색 결과가 없습니다.' : '주문이 없습니다.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-4 py-3 font-medium">회원 ID</th>
                  <th className="text-left px-4 py-3 font-medium">주문번호</th>
                  <th className="text-left px-4 py-3 font-medium">주문자</th>
                  <th className="text-left px-4 py-3 font-medium">전화번호</th>
                  <th className="text-left px-4 py-3 font-medium">상품</th>
                  <th className="text-left px-4 py-3 font-medium">금액</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="text-left px-4 py-3 font-medium">주문일</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o: any) => (
                  <tr key={o.orderNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                      {o.userId ?? '-'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {o.orderNo}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {o.ordererName ?? '-'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap tabular-nums">
                      {o.ordererPhone ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-700">
                        {o.firstSkuName}
                        {o.itemCount > 1 ? ` 외 ${o.itemCount - 1}건` : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 tabular-nums whitespace-nowrap">
                      {Number(o.totalAmount).toLocaleString()}원
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${ORDER_STATUS_COLOR[o.orderStatus] ?? 'bg-gray-100 text-gray-600'}`}>
                        {ORDER_STATUS_LABEL[o.orderStatus] ?? o.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(o.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-right">
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
