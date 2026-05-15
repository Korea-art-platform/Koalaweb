import { useState, useEffect, useCallback, useRef } from 'react';
import { Image as ImageIcon, Upload, X, RefreshCw } from 'lucide-react';
import {
  getAdminBanners, createBanner, activateBanner, deactivateBanner, deleteBanner,
  uploadBannerImage, updateBannerImage,
  type BannerResponse,
} from '@/api/adminApi';

const BANNER_TYPES = ['MAIN', 'MAIN_SUB', 'SUB', 'EVENT', 'PROMOTION', 'ARTIST'];

const BANNER_TYPE_LABELS: Record<string, string> = {
  MAIN: 'MAIN (메인 히어로)',
  MAIN_SUB: 'MAIN_SUB (메인 서브)',
  SUB: 'SUB',
  EVENT: 'EVENT',
  PROMOTION: 'PROMOTION',
  ARTIST: 'ARTIST',
};

interface BannerForm {
  bannerType: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  sortOrder: string;
}

const DEFAULT_FORM: BannerForm = {
  bannerType: 'MAIN',
  title: '',
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

  // 이미지 업로드 상태
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');       // 직접 URL 입력용
  const [useUpload, setUseUpload] = useState(true);   // true=파일업로드, false=URL입력
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 교체 모달
  const [replaceTarget, setReplaceTarget] = useState<BannerResponse | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState('');
  const [replacing, setReplacing] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(() => {
    setLoading(true);
    getAdminBanners().then(setBanners).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview('');
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      setFormError('제목은 필수 항목입니다.');
      return;
    }
    // 이미지 체크
    if (useUpload && !imageFile) {
      setFormError('이미지 파일을 선택해 주세요.');
      return;
    }
    if (!useUpload && !imageUrl.trim()) {
      setFormError('이미지 URL을 입력해 주세요.');
      return;
    }

    setFormError('');
    setSubmitting(true);
    try {
      // 파일 업로드 모드: 먼저 이미지 업로드 후 URL 취득
      let finalImageUrl = imageUrl.trim();
      if (useUpload && imageFile) {
        setUploading(true);
        finalImageUrl = await uploadBannerImage(imageFile);
        setUploading(false);
      }

      await createBanner({
        bannerType: form.bannerType,
        title: form.title.trim(),
        imageUrl: finalImageUrl,
        subtitle: form.subtitle.trim() || undefined,
        linkUrl: form.linkUrl.trim() || undefined,
        sortOrder: Number(form.sortOrder) || 0,
      });

      setCreateOpen(false);
      resetCreateForm();
      load();
    } catch {
      setUploading(false);
      setFormError('배너 생성에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetCreateForm = () => {
    setForm(DEFAULT_FORM);
    setImageFile(null);
    setImagePreview('');
    setImageUrl('');
    setUseUpload(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
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

  // 이미지 교체
  const handleReplaceFileChange = (file: File | null) => {
    setReplaceFile(file);
    setReplacePreview(file ? URL.createObjectURL(file) : '');
  };

  const handleReplaceImage = async () => {
    if (!replaceTarget || !replaceFile) return;
    setReplacing(true);
    try {
      await updateBannerImage(replaceTarget.bannerCode, replaceFile);
      setReplaceTarget(null);
      setReplaceFile(null);
      setReplacePreview('');
      load();
    } catch {
      alert('이미지 교체에 실패했습니다.');
    } finally {
      setReplacing(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <ImageIcon className="w-3.5 h-3.5" />
        <span>배너 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">배너 목록</h1>
        <button
          onClick={() => { setCreateOpen(true); setFormError(''); resetCreateForm(); }}
          className="px-3 py-2 text-xs bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 배너 추가
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 py-20 text-center text-sm text-gray-400">
          등록된 배너가 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {banners.map((b) => (
            <div key={b.bannerCode} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              {/* 이미지 — 클릭 시 교체 */}
              <button
                onClick={() => { setReplaceTarget(b); setReplaceFile(null); setReplacePreview(''); }}
                className="relative w-28 h-16 flex-shrink-0 group"
                title="이미지 교체"
              >
                {b.imageUrl ? (
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover rounded-lg bg-gray-100" />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <RefreshCw className="w-4 h-4 text-white" />
                </div>
              </button>

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
                {/* 공개/비공개 토글 */}
                <button
                  onClick={() => handleToggle(b)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium
                    ${b.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {b.isActive ? '공개중' : '비공개'}
                </button>
                <button onClick={() => handleDelete(b)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 배너 추가 모달 ── */}
      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-gray-900 mb-4">배너 추가</h2>
            <div className="space-y-3">
              {/* 배너 타입 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">배너 타입 *</label>
                <select
                  value={form.bannerType}
                  onChange={(e) => setForm((f) => ({ ...f, bannerType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
                >
                  {BANNER_TYPES.map((t) => <option key={t} value={t}>{BANNER_TYPE_LABELS[t] ?? t}</option>)}
                </select>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="배너 제목"
                />
              </div>

              {/* 이미지 — 업로드 / URL 선택 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-500">이미지 *</label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => setUseUpload(true)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${useUpload ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-400'}`}
                    >
                      파일 업로드
                    </button>
                    <button
                      onClick={() => setUseUpload(false)}
                      className={`px-2.5 py-1 rounded-md transition-colors ${!useUpload ? 'bg-white text-gray-900 shadow-sm font-medium' : 'text-gray-400'}`}
                    >
                      URL 입력
                    </button>
                  </div>
                </div>

                {useUpload ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                    />
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <img src={imagePreview} alt="preview" className="h-20 rounded-lg object-cover border" />
                        <button
                          onClick={() => { handleFileChange(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 w-full justify-center py-4 text-xs border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        이미지 파일 선택 (JPG, PNG, WEBP)
                      </button>
                    )}
                  </div>
                ) : (
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="https://..."
                  />
                )}
              </div>

              {/* 부제목 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부제목 (선택)</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="부제목"
                />
              </div>

              {/* 링크 URL */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">링크 URL (선택)</label>
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="/store 또는 https://..."
                />
              </div>

              {/* 표시 순서 */}
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">표시 순서</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="0"
                />
              </div>
            </div>

            {formError && <p className="text-xs text-red-500 mt-3">{formError}</p>}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setCreateOpen(false); resetCreateForm(); setFormError(''); }}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting || uploading}
                className="flex-1 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {uploading ? '업로드 중...' : submitting ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 이미지 교체 모달 ── */}
      {replaceTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h2 className="font-semibold text-gray-900 mb-1">이미지 교체</h2>
            <p className="text-xs text-gray-400 mb-4">"{replaceTarget.title}" 배너의 이미지를 교체합니다.</p>

            <input
              ref={replaceInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleReplaceFileChange(e.target.files?.[0] ?? null)}
            />

            {replacePreview ? (
              <div className="relative inline-block mb-4">
                <img src={replacePreview} alt="preview" className="h-24 rounded-lg object-cover border" />
                <button
                  onClick={() => { handleReplaceFileChange(null); if (replaceInputRef.current) replaceInputRef.current.value = ''; }}
                  className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 hover:bg-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => replaceInputRef.current?.click()}
                className="flex items-center gap-2 w-full justify-center py-4 mb-4 text-xs border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
              >
                <Upload className="w-4 h-4" />
                새 이미지 파일 선택
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setReplaceTarget(null); setReplaceFile(null); setReplacePreview(''); }}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleReplaceImage}
                disabled={!replaceFile || replacing}
                className="flex-1 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                {replacing ? '교체 중...' : '교체'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
