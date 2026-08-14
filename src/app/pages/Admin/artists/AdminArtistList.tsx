import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Users } from 'lucide-react';
import { getAdminArtists, createArtist, deleteArtist, activateArtist, deactivateArtist } from '@/api/adminApi';

interface ArtistForm {
  name: string;
  slug: string;
  description: string;
  profileImageUrl: string;
}

export default function AdminArtistList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<ArtistForm>({ name: '', slug: '', description: '', profileImageUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getAdminArtists(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setFormError('이름과 슬러그는 필수 항목입니다.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await createArtist({
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        profileImageUrl: form.profileImageUrl.trim() || undefined,
      });
      setCreateOpen(false);
      setForm({ name: '', slug: '', description: '', profileImageUrl: '' });
      load();
    } catch {
      setFormError('생성에 실패했습니다. 슬러그가 중복되었을 수 있습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (a: any) => {
    if (a.isActive) {
      await deactivateArtist(a.artistCode);
    } else {
      await activateArtist(a.artistCode);
    }
    load();
  };

  const handleDelete = async (artistCode: string, name: string) => {
    if (!window.confirm(
      `"${name}" 아티스트를 삭제하시겠습니까?\n\n⚠️ 이 작가의 모든 작품(상품)도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.`
    )) return;
    await deleteArtist(artistCode);
    load();
  };

  const handleSlugAutoFill = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm((f) => ({ ...f, slug }));
  };

  const artists: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Users className="w-3.5 h-3.5" />
        <span>아티스트 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">아티스트 목록</h1>
        <button onClick={() => { setCreateOpen(true); setFormError(''); }} className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors">
          + 아티스트 추가
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : artists.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">등록된 아티스트가 없습니다.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                <th className="text-left px-5 py-3 font-medium">이름</th>
                <th className="text-left px-5 py-3 font-medium">코드</th>
                <th className="text-left px-5 py-3 font-medium">슬러그</th>
                <th className="text-left px-5 py-3 font-medium">활성</th>
                <th className="text-left px-5 py-3 font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {artists.map((a: any) => (
                <tr key={a.artistCode} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-gray-900">{a.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-gray-400">{a.artistCode}</td>
                  <td className="px-5 py-4 text-xs text-gray-500">{a.slug}</td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleActive(a)}
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer
                        ${a.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                      {a.isActive ? '공개중' : '비공개'}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/admin/artists/${a.artistCode}`)}
                        className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                      >
                        편집
                      </button>
                      <button onClick={() => handleDelete(a.artistCode, a.name)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-4">아티스트 추가</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">이름 *</label>
                <input
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); handleSlugAutoFill(e.target.value); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="홍길동"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">슬러그 * <span className="text-gray-400">(영문, 숫자, 하이픈)</span></label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="hong-gildong"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">소개 (선택)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="작가 소개"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">프로필 이미지 URL (선택)</label>
                <input
                  value={form.profileImageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, profileImageUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="https://..."
                />
              </div>
            </div>
            {formError && <p className="text-xs text-red-500 mt-3">{formError}</p>}
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setCreateOpen(false); setForm({ name: '', slug: '', description: '', profileImageUrl: '' }); setFormError(''); }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} disabled={submitting} className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">{submitting ? '생성 중...' : '생성'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
