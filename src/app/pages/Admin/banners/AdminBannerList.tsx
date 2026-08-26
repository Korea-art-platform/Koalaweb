import { useState, useEffect, useCallback, useRef } from 'react';
import { Image as ImageIcon, Upload, X, RefreshCw } from 'lucide-react';
import {
  getAdminBanners, createBanner, updateBanner, activateBanner, deactivateBanner, deleteBanner,
  uploadBannerImage, updateBannerImage,
  type BannerResponse,
} from '@/api/adminApi';

const BANNER_TYPES = ['MAIN', 'MAIN_SUB', 'EXHIBITION', 'LOGIN', 'SUB', 'EVENT', 'PROMOTION', 'ARTIST'];

const BANNER_TYPE_LABELS: Record<string, string> = {
  MAIN: 'MAIN (메인 히어로)',
  MAIN_SUB: 'MAIN_SUB (메인 하단 — 작가의 공방)',
  EXHIBITION: 'EXHIBITION (전시 페이지 — 제목·서문·대표이미지)',
  LOGIN: 'LOGIN (로그인 화면 배경)',
  SUB: 'SUB',
  EVENT: 'EVENT',
  PROMOTION: 'PROMOTION',
  ARTIST: 'ARTIST',
};

interface BannerForm {
  bannerType: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  linkUrl: string;
  sortOrder: string;
}

const DEFAULT_FORM: BannerForm = {
  bannerType: 'MAIN',
  title: '',
  subtitle: '',
  badge: '',
  description: '',
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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [useUpload, setUseUpload] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [mediaType, setMediaType] = useState<'IMAGE' | 'VIDEO'>('IMAGE');
  const [useVideoUpload, setUseVideoUpload] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [replaceTarget, setReplaceTarget] = useState<BannerResponse | null>(null);
  const [replaceFile, setReplaceFile] = useState<File | null>(null);
  const [replacePreview, setReplacePreview] = useState('');
  const [replacing, setReplacing] = useState(false);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [editTarget, setEditTarget] = useState<BannerResponse | null>(null);
  const [editForm, setEditForm] = useState({ title: '', subtitle: '', badge: '', description: '', linkUrl: '', sortOrder: '0' });
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');

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

  const handleVideoChange = (file: File | null) => {
    setVideoFile(file);
    setVideoPreview(file ? URL.createObjectURL(file) : '');
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      setFormError('제목은 필수 항목입니다.');
      return;
    }

    if (mediaType === 'IMAGE') {
      if (useUpload && !imageFile) {
        setFormError('이미지 파일을 선택해 주세요.');
        return;
      }
      if (!useUpload && !imageUrl.trim()) {
        setFormError('이미지 URL을 입력해 주세요.');
        return;
      }
    } else {
      if (useVideoUpload && !videoFile) {
        setFormError('영상 파일을 선택해 주세요.');
        return;
      }
      if (!useVideoUpload && !videoUrl.trim()) {
        setFormError('영상 URL을 입력해 주세요.');
        return;
      }
    }

    setFormError('');
    setSubmitting(true);
    try {
      let finalImageUrl = imageUrl.trim();
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadBannerImage(imageFile);
        setUploading(false);
      }

      let finalVideoUrl = '';
      if (mediaType === 'VIDEO') {
        finalVideoUrl = useVideoUpload ? '' : videoUrl.trim();
        if (useVideoUpload && videoFile) {
          setUploading(true);
          finalVideoUrl = await uploadBannerImage(videoFile);
          setUploading(false);
        }
      }

      await createBanner({
        bannerType: form.bannerType,
        title: form.title.trim(),
        imageUrl: finalImageUrl || undefined,
        videoUrl: finalVideoUrl || undefined,
        subtitle: form.subtitle.trim() || undefined,
        badge: form.badge.trim() || undefined,
        description: form.description.trim() || undefined,
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
    setMediaType('IMAGE');
    setVideoFile(null);
    setVideoPreview('');
    setVideoUrl('');
    setUseVideoUpload(true);
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

  const openEdit = (b: BannerResponse) => {
    setEditTarget(b);
    setEditForm({
      title: b.title ?? '',
      subtitle: b.subtitle ?? '',
      badge: b.badge ?? '',
      description: b.description ?? '',
      linkUrl: b.linkUrl ?? '',
      sortOrder: String(b.sortOrder ?? 0),
    });
    setEditError('');
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    if (!editForm.title.trim()) {
      setEditError('제목은 필수 항목입니다.');
      return;
    }
    setEditError('');
    setEditSubmitting(true);
    try {
      await updateBanner(editTarget.bannerCode, {
        title: editForm.title.trim(),
        subtitle: editForm.subtitle.trim() || null,
        badge: editForm.badge.trim() || null,
        description: editForm.description.trim() || null,
        imageUrl: editTarget.imageUrl,
        mobileImageUrl: editTarget.mobileImageUrl ?? null,
        videoUrl: editTarget.videoUrl ?? null,
        linkUrl: editForm.linkUrl.trim() || null,
        linkTarget: editTarget.linkTarget ?? null,
        bgColor: editTarget.bgColor ?? null,
        textColor: editTarget.textColor ?? null,
        sortOrder: Number(editForm.sortOrder) || 0,
        visibleFrom: editTarget.visibleFrom ?? null,
        visibleTo: editTarget.visibleTo ?? null,
      });
      setEditTarget(null);
      load();
    } catch {
      setEditError('배너 수정에 실패했습니다.');
    } finally {
      setEditSubmitting(false);
    }
  };

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
          className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
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
                <button
                  onClick={() => handleToggle(b)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium
                    ${b.isActive ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {b.isActive ? '공개중' : '비공개'}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                >
                  수정
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
                <select
                  value={form.bannerType}
                  onChange={(e) => setForm((f) => ({ ...f, bannerType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
                >
                  {BANNER_TYPES.map((t) => <option key={t} value={t}>{BANNER_TYPE_LABELS[t] ?? t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="배너 제목"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">미디어 유형 *</label>
                <div className="flex gap-2 mb-3">
                  {([
                    { v: 'IMAGE', label: '이미지' },
                    { v: 'VIDEO', label: '영상 (자동재생)' },
                  ] as const).map((o) => (
                    <label
                      key={o.v}
                      className={mediaType === o.v
                        ? 'flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors border-koala-purple bg-koala-purple/5 text-koala-purple font-medium'
                        : 'flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer text-sm transition-colors border-gray-200 text-gray-500 hover:border-gray-300'}
                    >
                      <input
                        type="radio"
                        name="mediaType"
                        checked={mediaType === o.v}
                        onChange={() => setMediaType(o.v)}
                        className="accent-koala-purple"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs text-gray-500">
                    {mediaType === 'IMAGE' ? '이미지 파일 *' : '영상 파일 *'}
                  </label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => (mediaType === 'IMAGE' ? setUseUpload(true) : setUseVideoUpload(true))}
                      className={(mediaType === 'IMAGE' ? useUpload : useVideoUpload)
                        ? 'px-2.5 py-1 rounded-md transition-colors bg-white text-gray-900 shadow-sm font-medium'
                        : 'px-2.5 py-1 rounded-md transition-colors text-gray-400'}
                    >
                      파일 업로드
                    </button>
                    <button
                      onClick={() => (mediaType === 'IMAGE' ? setUseUpload(false) : setUseVideoUpload(false))}
                      className={!(mediaType === 'IMAGE' ? useUpload : useVideoUpload)
                        ? 'px-2.5 py-1 rounded-md transition-colors bg-white text-gray-900 shadow-sm font-medium'
                        : 'px-2.5 py-1 rounded-md transition-colors text-gray-400'}
                    >
                      URL 입력
                    </button>
                  </div>
                </div>

                {mediaType === 'VIDEO' && (
                  <p className="text-[11px] text-gray-400 mb-2.5">
                    영상은 자동 재생되며 브라우저 규칙상 <b>항상 무음</b>입니다.
                    20MB 이하 · 10~15초 · 720p mp4 를 권장합니다.
                  </p>
                )}

                {mediaType === 'IMAGE' ? (
                  useUpload ? (
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
                            className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
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
                  )
                ) : useVideoUpload ? (
                  <div>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      className="hidden"
                      onChange={(e) => handleVideoChange(e.target.files?.[0] ?? null)}
                    />
                    {videoPreview ? (
                      <div className="relative inline-block">
                        <video src={videoPreview} className="h-20 rounded-lg object-cover border" muted autoPlay loop playsInline />
                        <button
                          onClick={() => { handleVideoChange(null); if (videoInputRef.current) videoInputRef.current.value = ''; }}
                          className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => videoInputRef.current?.click()}
                        className="flex items-center gap-2 w-full justify-center py-4 text-xs border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        영상 파일 선택 (MP4, WEBM)
                      </button>
                    )}
                  </div>
                ) : (
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="https://.../hero.mp4"
                  />
                )}
              </div>

              {mediaType === 'VIDEO' && (
                <div className="border-t border-gray-100 pt-4">
                  <label className="block text-xs text-gray-500 mb-1.5">썸네일 이미지 (선택)</label>
                  <p className="text-[11px] text-gray-400 mb-2.5">
                    영상이 뜨기 전과 자동재생이 막혔을 때 대신 보일 이미지입니다. 비워도 됩니다.
                  </p>
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
                        className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 w-full justify-center py-3 text-xs border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      썸네일 이미지 선택
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부제목 (선택)</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="부제목"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">뱃지 (선택)</label>
                <input
                  value={form.badge}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="예: 신제품 드랍!"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부연 설명 (선택)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="메인 화면 제목 아래 설명 문구"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">링크 URL (선택)</label>
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="/store 또는 https://..."
                />
              </div>
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
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
              >
                {uploading ? '업로드 중...' : submitting ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="font-semibold text-gray-900 mb-1">배너 수정</h2>
            <p className="text-xs text-gray-400 mb-4">
              <span className="font-medium text-gray-500">{editTarget.bannerType}</span> · 이미지는 목록에서 썸네일을 클릭해 교체하세요.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">제목 *</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="배너 제목"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부제목 (선택)</label>
                <input
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm((f) => ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="부제목"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">뱃지 (선택)</label>
                <input
                  value={editForm.badge}
                  onChange={(e) => setEditForm((f) => ({ ...f, badge: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="예: 신제품 드랍!"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">부연 설명 (선택)</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
                  placeholder="메인 화면 제목 아래 설명 문구"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">링크 URL (선택)</label>
                <input
                  value={editForm.linkUrl}
                  onChange={(e) => setEditForm((f) => ({ ...f, linkUrl: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="/store 또는 https://..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">표시 순서</label>
                <input
                  type="number"
                  value={editForm.sortOrder}
                  onChange={(e) => setEditForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="0"
                />
              </div>
            </div>

            {editError && <p className="text-xs text-red-500 mt-3">{editError}</p>}

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => { setEditTarget(null); setEditError(''); }}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                disabled={editSubmitting}
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
              >
                {editSubmitting ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

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
                  className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
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
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
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
