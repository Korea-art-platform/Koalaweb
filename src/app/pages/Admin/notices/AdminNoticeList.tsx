import { useState, useEffect, useCallback } from 'react';
import { Bell, Pin, X } from 'lucide-react';
import {
  getAdminNotices, createNotice, updateNotice,
  activateNotice, deactivateNotice, deleteNotice,
  type NoticeResponse,
} from '@/api/adminApi';

interface NoticeForm {
  title: string;
  content: string;
  isPinned: boolean;
}

const DEFAULT_FORM: NoticeForm = { title: '', content: '', isPinned: false };

export default function AdminNoticeList() {
  const [notices, setNotices] = useState<NoticeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<NoticeResponse | null>(null);
  const [form, setForm] = useState<NoticeForm>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getAdminNotices().then(setNotices).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm(DEFAULT_FORM);
    setFormError('');
    setCreateOpen(true);
    setEditTarget(null);
  };

  const openEdit = (n: NoticeResponse) => {
    setForm({ title: n.title, content: n.content, isPinned: n.isPinned });
    setFormError('');
    setEditTarget(n);
    setCreateOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { setFormError('제목은 필수 항목입니다.'); return; }
    if (!form.content.trim()) { setFormError('내용은 필수 항목입니다.'); return; }
    setFormError('');
    setSubmitting(true);
    try {
      if (editTarget) {
        await updateNotice(editTarget.noticeCode, form);
      } else {
        await createNotice(form);
      }
      setCreateOpen(false);
      load();
    } catch {
      setFormError(editTarget ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (n: NoticeResponse) => {
    if (n.isActive) await deactivateNotice(n.noticeCode);
    else await activateNotice(n.noticeCode);
    load();
  };

  const handleDelete = async (n: NoticeResponse) => {
    if (!window.confirm(`"${n.title}" 공지사항을 삭제하시겠습니까?`)) return;
    await deleteNotice(n.noticeCode);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Bell className="w-3.5 h-3.5" />
        <span>공지사항 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">공지사항 목록</h1>
        <button
          onClick={openCreate}
          className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
        >
          + 공지 등록
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          등록된 공지사항이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div key={n.noticeCode} className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {n.isPinned && <Pin className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />}
                  <span className="font-medium text-gray-900 text-sm truncate">{n.title}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-1">{n.content}</p>
                <p className="text-xs text-gray-300">
                  {n.createdByAdminName && `${n.createdByAdminName} · `}
                  {new Date(n.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(n)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium
                    ${n.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {n.isActive ? '공개중' : '비공개'}
                </button>
                <button
                  onClick={() => openEdit(n)}
                  className="text-xs text-gray-500 hover:text-gray-900 font-medium"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(n)}
                  className="text-xs text-red-400 hover:text-red-600 font-medium"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 등록/수정 모달 ── */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">
                {editTarget ? '공지사항 수정' : '공지사항 등록'}
              </h2>
              <button onClick={() => setCreateOpen(false)}>
                <X className="w-5 h-5 text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 제목 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="공지사항 제목"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">내용 *</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={8}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-y"
                  placeholder="공지사항 내용을 입력하세요..."
                />
              </div>

              {/* 상단 고정 */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPinned}
                  onChange={(e) => setForm((f) => ({ ...f, isPinned: e.target.checked }))}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700 flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-orange-400" />
                  상단 고정
                </span>
              </label>
            </div>

            {formError && <p className="text-xs text-red-500 mt-3">{formError}</p>}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setCreateOpen(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
              >
                {submitting ? '저장 중...' : editTarget ? '수정' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
