import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AppWindow } from 'lucide-react';
import {
  getAdminPopups, activatePopup, deactivatePopup, deletePopup,
  type PopupResponse,
} from '@/api/adminApi';

const LANGUAGE_LABEL: Record<string, string> = { ko: '국문', en: '영문' };
const TYPE_LABEL: Record<string, string> = { IMAGE: '이미지', TEMPLATE: '템플릿' };
const PLACEMENT_LABEL: Record<string, string> = { HOME: '홈', ALL: '전체 페이지' };

export default function AdminPopupList() {
  const [popups, setPopups] = useState<PopupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getAdminPopups()
      .then(setPopups)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (p: PopupResponse) => {
    setBusy(p.popupCode);
    try {
      if (p.active) await deactivatePopup(p.popupCode);
      else await activatePopup(p.popupCode);
      setPopups((prev) => prev.map((x) => (x.popupCode === p.popupCode ? { ...x, active: !p.active } : x)));
    } catch {
      window.alert('사용 여부 변경에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  const remove = async (p: PopupResponse) => {
    if (!window.confirm(`"${p.title}" 팝업을 삭제하시겠습니까?`)) return;
    setBusy(p.popupCode);
    try {
      await deletePopup(p.popupCode);
      setPopups((prev) => prev.filter((x) => x.popupCode !== p.popupCode));
    } catch {
      window.alert('삭제에 실패했습니다.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <AppWindow className="w-3.5 h-3.5" />
        <span>팝업 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">팝업 목록</h1>
        <Link
          to="/admin/popups/new"
          className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
        >
          + 팝업 등록
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          <p>팝업 목록을 불러오지 못했습니다.</p>
          <button onClick={load} className="mt-3 text-xs text-gray-600 underline hover:text-gray-900">
            다시 시도
          </button>
        </div>
      ) : popups.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          등록된 팝업이 없습니다.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                <th className="text-left px-5 py-3 font-medium">제목</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">언어</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">방식</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">노출 위치</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">사용 여부</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">수정</th>
                <th className="text-left px-5 py-3 font-medium whitespace-nowrap">삭제</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {popups.map((p) => (
                <tr key={p.popupCode} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{p.title}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{LANGUAGE_LABEL[p.language] ?? p.language}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{TYPE_LABEL[p.displayType] ?? p.displayType}</td>
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{PLACEMENT_LABEL[p.placement] ?? p.placement}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggle(p)}
                      disabled={busy === p.popupCode}
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium transition-colors disabled:opacity-50 whitespace-nowrap ${
                        p.active
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {p.active ? '노출중' : '숨김'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      to={`/admin/popups/${p.popupCode}`}
                      className="text-xs text-gray-500 hover:text-gray-900 font-medium whitespace-nowrap"
                    >
                      수정
                    </Link>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => remove(p)}
                      disabled={busy === p.popupCode}
                      className="text-xs text-red-400 hover:text-red-600 font-medium disabled:opacity-50 whitespace-nowrap"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
