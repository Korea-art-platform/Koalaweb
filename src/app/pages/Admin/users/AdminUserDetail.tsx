import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { getAdminUser, getAdminUserOrders, suspendUser, activateUser } from '@/api/adminApi';
import { UserCog, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  SUSPENDED: 'bg-red-50 text-red-600',
  WITHDRAWN: 'bg-gray-100 text-gray-400',
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '정상', SUSPENDED: '정지', WITHDRAWN: '탈퇴',
};
const PROVIDER_LABEL: Record<string, string> = {
  KAKAO: '카카오', NAVER: '네이버', LOCAL: '이메일',
};
const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: '결제대기', PAID: '결제완료', PREPARING: '준비중',
  SHIPPED: '배송중', DELIVERED: '배송완료', CANCELLED: '취소',
};
const ORDER_STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  PREPARING: 'bg-violet-50 text-violet-700',
  SHIPPED: 'bg-indigo-50 text-indigo-700',
  DELIVERED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-600',
};

export default function AdminUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const id = Number(userId);

  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);
    try {
      setUser(await getAdminUser(id));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadOrders = useCallback(async () => {
    setOrderLoading(true);
    try {
      setOrders(await getAdminUserOrders(id, page));
    } finally {
      setOrderLoading(false);
    }
  }, [id, page]);

  useEffect(() => { loadUser(); }, [loadUser]);
  useEffect(() => { loadOrders(); }, [loadOrders]);

  const handleSuspend = async () => {
    if (!window.confirm(`"${user?.name ?? user?.email}" 회원을 정지하시겠습니까?`)) return;
    await suspendUser(id);
    loadUser();
  };

  const handleActivate = async () => {
    if (!window.confirm(`"${user?.name ?? user?.email}" 회원을 활성화하시겠습니까?`)) return;
    await activateUser(id);
    loadUser();
  };

  const orderList: any[] = orders?.content ?? [];
  const totalPages: number = orders?.totalPages ?? 0;

  if (loading) {
    return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  }
  if (!user) {
    return <div className="p-8 text-sm text-red-400">회원을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <UserCog className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/admin/users')} className="hover:text-gray-600">회원 관리</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-600">{user.name ?? user.email}</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">회원 상세</h1>
        <div className="flex gap-2">
          {user.status === 'ACTIVE' && (
            <button
              onClick={handleSuspend}
              className="px-3 py-1.5 text-xs border border-red-200 text-red-500 rounded-lg hover:bg-red-50 font-medium"
            >
              계정 정지
            </button>
          )}
          {user.status === 'SUSPENDED' && (
            <button
              onClick={handleActivate}
              className="px-3 py-1.5 text-xs border border-green-200 text-green-600 rounded-lg hover:bg-green-50 font-medium"
            >
              활성화
            </button>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">기본 정보</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">이름</span>
            <span className="font-medium text-gray-800">{user.name ?? '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">상태</span>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[user.status] ?? 'bg-gray-100 text-gray-500'}`}>
              {STATUS_LABEL[user.status] ?? user.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">이메일</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">가입 경로</span>
            <span className="text-gray-800">{PROVIDER_LABEL[user.oauthProvider] ?? '이메일'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">전화번호</span>
            <span className="text-gray-800">{user.phone ?? '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">가입일</span>
            <span className="text-gray-800">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <ShoppingBag className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">구매 이력</h2>
          {orders && (
            <span className="ml-auto text-xs text-gray-400">총 {orders.totalElements ?? 0}건</span>
          )}
        </div>

        {orderLoading ? (
          <div className="py-12 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : orderList.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">구매 내역이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">주문번호</th>
                  <th className="text-left px-5 py-3 font-medium">상품</th>
                  <th className="text-left px-5 py-3 font-medium">금액</th>
                  <th className="text-left px-5 py-3 font-medium">상태</th>
                  <th className="text-left px-5 py-3 font-medium">주문일</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orderList.map((o: any) => (
                  <tr key={o.orderNo} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">{o.orderNo}</td>
                    <td className="px-5 py-4 text-gray-800 max-w-[200px] truncate">{o.orderName ?? '-'}</td>
                    <td className="px-5 py-4 tabular-nums font-medium text-gray-800">
                      {o.totalAmount != null ? `${o.totalAmount.toLocaleString()}원` : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${ORDER_STATUS_COLOR[o.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/orders/${o.orderNo}`}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                      >
                        상세
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 px-6 py-4 border-t border-gray-100">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              이전
            </button>
            <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
