import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { MessageCircle, ChevronRight } from 'lucide-react';
import {
  getAdminInquiries,
  type AdminInquiryResponse,
} from '@/api/adminApi';

const STATUS_LABELS: Record<string, string> = {
  PENDING:  '미답변',
  ANSWERED: '답변완료',
  CLOSED:   '종결',
};

const STATUS_STYLES: Record<string, string> = {
  PENDING:  'bg-yellow-50 text-yellow-700',
  ANSWERED: 'bg-green-50 text-green-700',
  CLOSED:   'bg-gray-100 text-gray-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  ORDER:    '주문',
  PRODUCT:  '상품',
  PAYMENT:  '결제',
  DELIVERY: '배송',
  RETURN:   '반품/교환',
  OTHER:    '기타',
};

const STATUS_FILTERS = [
  { value: '',         label: '전체' },
  { value: 'PENDING',  label: '미답변' },
  { value: 'ANSWERED', label: '답변완료' },
  { value: 'CLOSED',   label: '종결' },
];

export default function AdminInquiryList() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState<AdminInquiryResponse[]>([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const load = useCallback(() => {
    setLoading(true);
    getAdminInquiries(page, 20, statusFilter || undefined)
      .then((res) => {
        setInquiries(res.content);
        setTotalPages(res.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (val: string) => {
    setStatusFilter(val);
    setPage(0);
  };

  return (
    <div className="p-8">
      {/* 헤더 */}
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <MessageCircle className="w-3.5 h-3.5" />
        <span>1:1 문의 관리</span>
      </div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900">1:1 문의 목록</h1>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-5">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleFilterChange(f.value)}
            className={`px-3 py-1.5 text-xs rounded-full transition-colors font-medium
              ${statusFilter === f.value
                ? 'bg-koala-navy text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          문의가 없습니다.
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="px-4 py-3 text-left font-medium">분류</th>
                  <th className="px-4 py-3 text-left font-medium">제목</th>
                  <th className="px-4 py-3 text-left font-medium">작성자</th>
                  <th className="px-4 py-3 text-left font-medium">상태</th>
                  <th className="px-4 py-3 text-left font-medium">등록일</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {inquiries.map((q) => (
                  <tr
                    key={q.inquiryCode}
                    onClick={() => navigate(`/admin/inquiries/${q.inquiryCode}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {CATEGORY_LABELS[q.category] ?? q.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[280px]">
                      <span className="font-medium text-gray-900 truncate block">
                        {q.isSecret && <span className="text-gray-400 mr-1">🔒</span>}
                        {q.title}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">
                      <div>{q.userName}</div>
                      <div className="text-gray-400">{q.userEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_STYLES[q.status] ?? ''}`}>
                        {STATUS_LABELS[q.status] ?? q.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(q.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1 mt-5">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 text-xs rounded-lg transition-colors
                    ${page === i ? 'bg-koala-navy text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
