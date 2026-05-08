import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, suspendUser, activateUser } from '@/api/adminApi';
import { UserCog } from 'lucide-react';

const USER_STATUS_COLOR: Record<string, string> = {
  ACTIVE: 'bg-green-50 text-green-700',
  SUSPENDED: 'bg-red-50 text-red-600',
  WITHDRAWN: 'bg-gray-100 text-gray-400',
};
const USER_STATUS_LABEL: Record<string, string> = {
  ACTIVE: '정상', SUSPENDED: '정지', WITHDRAWN: '탈퇴',
};

const PROVIDER_LABEL: Record<string, string> = {
  KAKAO: '카카오', NAVER: '네이버', LOCAL: '이메일',
};

export default function AdminUserList() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getAdminUsers(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleSuspend = async (userId: number, name: string) => {
    if (!window.confirm('"' + name + '" 회원을 정지하시겠습니까?')) return;
    await suspendUser(userId);
    load();
  };

  const handleActivate = async (userId: number, name: string) => {
    if (!window.confirm('"' + name + '" 회원을 활성화하시겠습니까?')) return;
    await activateUser(userId);
    load();
  };

  const users: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <UserCog className="w-3.5 h-3.5" />
        <span>회원 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">회원 목록</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">회원이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">이름</th>
                  <th className="text-left px-5 py-3 font-medium">이메일</th>
                  <th className="text-left px-5 py-3 font-medium">가입 경로</th>
                  <th className="text-left px-5 py-3 font-medium">상태</th>
                  <th className="text-left px-5 py-3 font-medium">가입일</th>
                  <th className="text-left px-5 py-3 font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-900">{u.name ?? '-'}</td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs text-gray-500">
                        {PROVIDER_LABEL[u.oauthProvider] ?? u.oauthProvider ?? '이메일'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${USER_STATUS_COLOR[u.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {USER_STATUS_LABEL[u.status] ?? u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </td>
                    <td className="px-5 py-4">
                      {u.status === 'ACTIVE' && (
                        <button onClick={() => handleSuspend(u.id, u.name ?? u.email)} className="text-xs text-red-400 hover:text-red-600 font-medium">정지</button>
                      )}
                      {u.status === 'SUSPENDED' && (
                        <button onClick={() => handleActivate(u.id, u.name ?? u.email)} className="text-xs text-green-600 hover:text-green-800 font-medium">활성화</button>
                      )}
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
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}
    </div>
  );
}
