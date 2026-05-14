import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { getAdminReturns } from '@/api/adminApi';
import { ChevronRight, RotateCcw } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  REQUESTED: '신청됨',
  APPROVED: '승인됨',
  REJECTED: '거절됨',
  COMPLETED: '완료',
};

const STATUS_COLOR: Record<string, string> = {
  REQUESTED: 'bg-yellow-50 text-yellow-700',
  APPROVED: 'bg-green-50 text-green-700',
  REJECTED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-gray-100 text-gray-600',
};

const TYPE_LABEL: Record<string, string> = {
  RETURN: '반품',
  EXCHANGE: '교환',
};

const REASON_LABEL: Record<string, string> = {
  SIMPLE_CHANGE: '단순 변심',
  DEFECT: '상품 불량/파손',
  WRONG_DELIVERY: '오배송',
  OTHER: '기타',
};

const STATUS_FILTERS = [
  { value: '', label: '전체' },
  { value: 'REQUESTED', label: '신청됨' },
  { value: 'APPROVED', label: '승인됨' },
  { value: 'REJECTED', label: '거절됨' },
  { value: 'COMPLETED', label: '완료' },
];

export default function AdminReturnList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReturns = useCallback((p: number, status: string) => {
    setLoading(true);
    getAdminReturns(p, 20, status || undefined)
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchReturns(page, statusFilter);
  }, [page, statusFilter, fetchReturns]);

  const handleFilterChange = (s: string) => {
    setStatusFilter(s);
    setPage(0);
  };

  const returns: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;
  const totalElements: number = data?.totalElements ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <RotateCcw className="w-3.5 h-3.5" />
        <span>반품/교환 관리</span>
      </div>
      <div className="flex items-end justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">반품 / 교환 목록</h1>
        <span className="text-xs text-gray-400">총 <span className="font-semibold text-gray-700">{totalElements}</span>건</span>
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-black text-white'
                : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : returns.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">반품/교환 요청이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-4 py-3 font-medium">반품번호</th>
                  <th className="text-left px-4 py-3 font-medium">주문번호</th>
                  <th className="text-left px-4 py-3 font-medium">회원 ID</th>
                  <th className="text-left px-4 py-3 font-medium">주문자</th>
                  <th className="text-left px-4 py-3 font-medium">유형</th>
                  <th className="text-left px-4 py-3 font-medium">사유</th>
                  <th className="text-left px-4 py-3 font-medium">상태</th>
                  <th className="text-left px-4 py-3 font-medium">신청일</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {returns.map((r: any) => (
                  <tr key={r.returnNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">
                      {r.returnNo}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400 whitespace-nowrap">
                      {r.orderNo}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 tabular-nums">
                      {r.userId ?? '-'}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                      {r.ordererName ?? '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        r.returnType === 'RETURN' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {TYPE_LABEL[r.returnType] ?? r.returnType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {REASON_LABEL[r.reason] ?? r.reason}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLOR[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABEL[r.status] ?? r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/returns/${r.returnNo}`}
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
