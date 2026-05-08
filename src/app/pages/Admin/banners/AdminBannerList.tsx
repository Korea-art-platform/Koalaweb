import { useState, useEffect, useCallback } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import {
  getAdminBanners, createBanner, activateBanner, deactivateBanner, deleteBanner,
  type BannerResponse,
} from '@/api/adminApi';

const BANNER_TYPES = ['MAIN', 'SUB', 'EVENT', 'PROMOTION', 'ARTIST'];

interface BannerForm {
  bannerType: string;
  title: string;
  imageUrl: string;
  subtitle: string;
  linkUrl: string;
  sortOrder: string;
}

const DEFAULT_FORM: BannerForm = {
  bannerType: 'MAIN',
  title: '',
  imageUrl: '',
  subtitle: '',
  linkUrl: '',
  sortOrder: '0',
};

export default function AdminBannerList() {
  const [banners, setBanners] = useState<BannerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<BannerForm>(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getAdminBanners().then(setBanners).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.title.trim() || !form.imageUrl.trim()) {
      setFormError('제목과 이미지 URL은 필수 항목입니다.');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      await createBanner({
        bannerType: form.bannerType,
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
        subtitle: form.subtitle.trim() || undefined,
        linkUrl: form.linkUrl.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
      });
      setCreateOpen(false);
      setForm(DEFAULT_FORM);
      load();
    } catch {
      setFormError('배너 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (b: BannerResponse) => {
    if (b.isActive) await deactivateBanner(b.bannerCode);
    else await activateBanner(b.bannerCode);
    load();
  };

  const handleDelete = async (b: BannerResponse) => {
    if (!window.confirm('"' + b.title + '" 배너를 삭제하시겠습니까?')) return;
    await deleteBanner(b.bannerCode);
    load();
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>배너 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">배너 목록</h1>
        <button onClick={() => { setCreateOpen(true); setFormError(''); }} className="px-3 py-2 text-xs bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          + 배너 추가
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">등록된 배너가 없습니다.</div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.bannerCode} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              {b.imageUrl ? (
                <img src={b.imageUrl} alt={b.title} className="w-28 h-16 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
              ) : (
                <div className="w-28 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageIcon className="w-5 h-5 text-gray-300" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{b.bannerType}</span>
                  <span className="font-medium text-gray-900 text-sm">{b.title}</span>
                </div>
                {b.subtitle && <p className="text-xs text-gray-400 truncate">{b.subtitle}</p>}
                {b.linkUrl && <p className="text-xs text-gray-300 truncate mt-0.5">{b.linkUrl}</p>}
                <p className="text-xs text-gray-300 mt-1">순서: {b.sortOrder ?? 0}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(b)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${b.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {b.isActive ? '노출중' : '숨김'}
                </button>
                <button onClick={() => handleDelete(b)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-gray-900 mb-4">배너 추가</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">배너 타입 *</label>
                <select value={form.bannerType} onChange={(e) => setForm((f) => ({ ...f, bannerType: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white">
                  {BANNER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="배너 제목" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">이미지 URL *</label>
                <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부제목 (선택)</label>
                <input value={form.subtitle} onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="부제목" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">링크 URL (선택)</label>
                <input value={form.linkUrl} onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="/store 또는 https://..." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">표시 순서</label>
                <input type="number" value={form.sortOrder} onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10" placeholder="0" />
              </div>
            </div>
            {formError && <p className="text-xs text-red-500 mt-3">{formError}</p>}
            <div className="flex gap-2 mt-5">
              <button onClick={() => { setCreateOpen(false); setForm(DEFAULT_FORM); setFormError(''); }} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} disabled={submitting} className="flex-1 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">{submitting ? '생성 중...' : '생성'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
