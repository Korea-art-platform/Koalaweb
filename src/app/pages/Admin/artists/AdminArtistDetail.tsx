import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, Trash2, Plus, Pencil, X, Check, ImagePlus } from 'lucide-react';

import {
  getAdminArtist,
  updateArtist,
  createSku,
  addSkuMedia,
  getArtistMedia,
  addArtistMedia,
  addArtistMediaUrl,
  deleteArtistMedia,
  addArtistCareer,
  updateArtistCareer,
  deleteArtistCareer,
  getArtistSkus,
  setArtistFeaturedSku,
  clearArtistFeaturedSku,
  type ArtistDetailResponse,
  type ArtistMediaResponse,
  type ArtistCareerResponse,
  type ArtistSkuItem,
  type FeaturedSkuInfo,
} from '@/api/adminApi';
import { useCategories } from '@/app/hooks/useCategories';
import { downscaleImage } from '@/utils/downscaleImage';

type Tab = 'info' | 'media' | 'career' | 'featured';

const PAGE_SECTIONS = [
  {
    role: 'PROFILE',
    icon: '👤',
    title: '프로필 사진',
    desc: '작가 소개 섹션 메인 이미지',
    accept: 'image/*',
    single: true,
  },
  {
    role: 'INTERVIEW_VIDEO',
    icon: '🎬',
    title: '인터뷰 영상 (YouTube)',
    desc: 'YouTube URL을 입력하면 INTERVIEW 섹션에 임베드됩니다',
    accept: 'video/*',
    single: true,
    urlOnly: true,
  },
  {
    role: 'INTERVIEW_IMAGE',
    icon: '🖼',
    title: '인터뷰 썸네일',
    desc: '인터뷰 영상 없을 때 대신 표시되는 이미지',
    accept: 'image/*',
    single: true,
  },
  {
    role: 'STUDIO',
    icon: '🏠',
    title: '작업실 사진',
    desc: 'Studio 섹션 그리드에 표시 (여러 장 가능)',
    accept: 'image/*',
    single: false,
  },
  {
    role: 'HANDS',
    icon: '🤲',
    title: '작가의 손',
    desc: '작가의 손 섹션에 표시 (여러 장 가능)',
    accept: 'image/*',
    single: false,
  },
] as const;

const CAREER_CATEGORIES = ['학력', '개인전', '그룹전', '수상', '소장', '방송', '그 외'] as const;

export default function AdminArtistDetail() {
  const { artistCode } = useParams<{ artistCode: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('info');
  const [artist, setArtist] = useState<ArtistDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!artistCode) return;
    setLoading(true);
    try {
      const data = await getAdminArtist(artistCode);
      setArtist(data);
    } finally {
      setLoading(false);
    }
  }, [artistCode]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  if (!artist) return <div className="p-8 text-sm text-red-400">아티스트를 찾을 수 없습니다.</div>;

  return (
    <div className="p-8 max-w-4xl">
      <button
        onClick={() => navigate('/admin/artists')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 목록으로
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-1">{artist.name}</h1>
      <p className="text-xs text-gray-400 font-mono mb-6">{artist.artistCode}</p>
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['info', 'media', 'career', 'featured'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {{ info: '기본정보', media: '미디어', career: '약력', featured: '대표 작품' }[t]}
          </button>
        ))}
      </div>

      {tab === 'info'     && <InfoTab artist={artist} onSaved={load} />}
      {tab === 'media'    && <MediaTab artistCode={artist.artistCode} mediaList={artist.mediaList} onChanged={load} />}
      {tab === 'career'   && <CareerTab artistCode={artist.artistCode} careerList={artist.careerList} onChanged={load} />}
      {tab === 'featured' && <FeaturedTab artistCode={artist.artistCode} current={artist.featuredSku} onChanged={load} />}
    </div>
  );
}

function InfoTab({
  artist,
  onSaved,
}: {
  artist: ArtistDetailResponse;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: artist.name,
    slug: artist.slug,
    description: artist.description ?? '',
    artistNote: artist.artistNote ?? '',
    profileImageUrl: artist.profileImageUrl ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('이름과 슬러그는 필수 항목입니다.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      await updateArtist(artist.artistCode, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        artistNote: form.artistNote.trim() || undefined,
        profileImageUrl: form.profileImageUrl.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSaved();
    } catch {
      setError('저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 max-w-lg">
      <Field label="이름 *">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputCls}
        />
      </Field>
      <Field label="슬러그 *">
        <input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className={inputCls}
          placeholder="hong-gildong"
        />
      </Field>
      <Field label="프로필 이미지 URL">
        <input
          value={form.profileImageUrl}
          onChange={(e) => setForm((f) => ({ ...f, profileImageUrl: e.target.value }))}
          className={inputCls}
          placeholder="https://..."
        />
        {form.profileImageUrl && (
          <img src={form.profileImageUrl} alt="preview" className="mt-2 w-20 h-20 rounded-full object-cover border" />
        )}
      </Field>
      <Field label="작가 소개">
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder="작가 소개 (간략)"
        />
      </Field>
      <Field label="작가 노트">
        <textarea
          value={form.artistNote}
          onChange={(e) => setForm((f) => ({ ...f, artistNote: e.target.value }))}
          rows={6}
          className={`${inputCls} resize-none`}
          placeholder="작가가 직접 쓴 노트, 창작 철학 등"
        />
      </Field>

      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-5 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50 flex items-center gap-2"
      >
        {success ? <><Check className="w-4 h-4" /> 저장됨</> : saving ? '저장 중...' : '저장'}
      </button>
    </div>
  );
}

function MediaTab({
  artistCode,
  mediaList,
  onChanged,
}: {
  artistCode: string;
  mediaList: ArtistMediaResponse[];
  onChanged: () => void;
}) {
  return (
    <div className="space-y-4">
      {PAGE_SECTIONS.map((section) => {
        const items = mediaList.filter((m) => m.mediaRole === section.role);
        return (
          <SectionCard
            key={section.role}
            artistCode={artistCode}
            section={section}
            items={items}
            onChanged={onChanged}
          />
        );
      })}
    </div>
  );
}

function SectionCard({
  artistCode,
  section,
  items,
  onChanged,
}: {
  artistCode: string;
  section: typeof PAGE_SECTIONS[number];
  items: ArtistMediaResponse[];
  onChanged: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceRef = useRef<HTMLInputElement>(null);
  const [replaceId, setReplaceId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState('');

  const [urlInput, setUrlInput] = useState('');
  const [urlSaving, setUrlSaving] = useState(false);

  const mediaType = section.role === 'INTERVIEW_VIDEO' ? 'VIDEO' : 'IMAGE';

  const toEmbedUrl = (url: string): string | null => {
    try {
      const u = new URL(url.trim());

      if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${u.searchParams.get('v')}`;
      }

      if (u.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed${u.pathname}`;
      }

      if (u.hostname.includes('youtube.com') && u.pathname.startsWith('/embed/')) {
        return url.trim();
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSaveUrl = async () => {
    const embedUrl = toEmbedUrl(urlInput);
    if (!embedUrl) {
      setError('올바른 YouTube URL을 입력해 주세요.\n(예: https://www.youtube.com/watch?v=VIDEO_ID)');
      return;
    }
    setError('');
    setUrlSaving(true);
    try {
      await addArtistMediaUrl(artistCode, {
        fileUrl: embedUrl,
        mediaType: 'VIDEO',
        mediaRole: 'INTERVIEW_VIDEO',
      });
      setUrlInput('');
      onChanged();
    } catch {
      setError('저장에 실패했습니다.');
    } finally {
      setUrlSaving(false);
    }
  };

  const upload = async (files: FileList | null, replacingId?: number) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      for (const original of Array.from(files)) {
        const file = await downscaleImage(original);
        await addArtistMedia(artistCode, file, {
          mediaType,
          mediaRole: section.role,
          sortOrder: items.length,
        });
      }
      if (replacingId !== undefined) {
        await deleteArtistMedia(artistCode, replacingId);
      }
      onChanged();
    } catch {
      setError('업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      setReplaceId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (replaceRef.current) replaceRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    setDeleting(id);
    try { await deleteArtistMedia(artistCode, id); onChanged(); }
    finally { setDeleting(null); }
  };

  const triggerReplace = (id: number) => {
    setReplaceId(id);
    setTimeout(() => replaceRef.current?.click(), 0);
  };

  const current = items[0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <span className="text-lg">{section.icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{section.title}</p>
          <p className="text-xs text-gray-400">{section.desc}</p>
        </div>
      </div>
      <div className="px-5 py-4">
        {'urlOnly' in section && section.urlOnly ? (
          <div className="space-y-3">

            {current ? (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">현재 등록된 영상</p>
                  <p className="text-xs text-gray-700 truncate font-mono">{current.fileUrl}</p>
                </div>
                <div className="w-28 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-200">
                  <iframe
                    src={current.fileUrl}
                    className="w-full h-full pointer-events-none"
                    title="preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <button
                  onClick={() => handleDelete(current.id)}
                  disabled={deleting === current.id}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400">아직 등록된 영상이 없습니다.</p>
            )}

            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveUrl()}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <button
                onClick={handleSaveUrl}
                disabled={urlSaving || !urlInput.trim()}
                className="px-4 py-2 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50 whitespace-nowrap"
              >
                {urlSaving ? '저장 중...' : current ? '교체' : '등록'}
              </button>
            </div>
            {error && <p className="text-xs text-red-500 whitespace-pre-line">{error}</p>}
          </div>
        ) : section.single ? (
          <div className="flex items-center gap-4">
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              {current ? (
                <img src={current.fileUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  없음
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <input ref={fileInputRef} type="file" accept={section.accept} className="hidden"
                onChange={(e) => upload(e.target.files)} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {current ? '교체' : '업로드'}
              </button>
              {current && (
                <button
                  onClick={() => handleDelete(current.id)}
                  disabled={deleting === current.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" /> 삭제
                </button>
              )}
              {uploading && <p className="text-xs text-gray-400">업로드 중...</p>}
            </div>
          </div>
        ) : (
          <div>
            {items.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {items.map((m, idx) => (
                  <div key={m.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={m.fileUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {idx + 1}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => triggerReplace(m.id)}
                        disabled={uploading}
                        className="flex-1 py-1 text-[10px] bg-white/90 text-gray-700 rounded font-medium border border-gray-200 hover:bg-white"
                      >수정</button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        disabled={deleting === m.id}
                        className="px-2 py-1 bg-red-500/90 text-white rounded hover:bg-red-600 disabled:opacity-40"
                      ><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input ref={fileInputRef} type="file" accept={section.accept} multiple className="hidden"
              onChange={(e) => upload(e.target.files)} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 w-full justify-center py-2.5 text-xs border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              {uploading ? '업로드 중...' : `사진 ${items.length + 1} 추가`}
            </button>
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      </div>
      <input ref={replaceRef} type="file" accept={section.accept} className="hidden"
        onChange={(e) => replaceId !== null && upload(e.target.files, replaceId)} />
    </div>
  );
}

function CareerTab({
  artistCode,
  careerList,
  onChanged,
}: {
  artistCode: string;
  careerList: ArtistCareerResponse[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [addForm, setAddForm] = useState<{ category: string; year: number | null; content: string }>({ category: '학력', year: new Date().getFullYear(), content: '' });
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ category: string; year: number | null; content: string }>({ category: '학력', year: null, content: '' });

  const [deleting, setDeleting] = useState<number | null>(null);

  const grouped = CAREER_CATEGORIES.map((cat) => ({
    cat,
    items: careerList.filter((c) => c.category === cat).sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.sortOrder - b.sortOrder),
  }));

  const handleAdd = async () => {
    if (!addForm.content.trim()) { setAddError('내용을 입력해 주세요.'); return; }
    setAddError('');
    setSubmitting(true);
    try {
      await addArtistCareer(artistCode, {
        category: addForm.category,
        year: addForm.year,
        content: addForm.content.trim(),
      });
      setAdding(false);
      setAddForm({ category: '학력', year: new Date().getFullYear(), content: '' } as { category: string; year: number | null; content: string });
      onChanged();
    } catch {
      setAddError('추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSave = async (careerId: number) => {
    if (!editForm.content.trim()) return;
    setSubmitting(true);
    try {
      await updateArtistCareer(artistCode, careerId, {
        category: editForm.category,
        year: editForm.year,
        content: editForm.content.trim(),
      });
      setEditId(null);
      onChanged();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (careerId: number) => {
    if (!window.confirm('이 약력을 삭제하시겠습니까?')) return;
    setDeleting(careerId);
    try {
      await deleteArtistCareer(artistCode, careerId);
      onChanged();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>

      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover mb-6"
        >
          <Plus className="w-3.5 h-3.5" /> 약력 추가
        </button>
      )}

      {adding && (
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
          <p className="text-xs font-semibold text-gray-600 mb-3">새 약력</p>
          <div className="flex flex-wrap gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">카테고리</label>
              <select
                value={addForm.category}
                onChange={(e) => setAddForm((f) => ({ ...f, category: e.target.value }))}
                className={`${inputCls} py-1.5`}
              >
                {CAREER_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">연도 <span className="text-gray-400">(미공개면 빈칸)</span></label>
              <input
                type="number"
                value={addForm.year ?? ''}
                min={1900} max={2100}
                placeholder="미공개"
                onChange={(e) => setAddForm((f) => ({ ...f, year: e.target.value === '' ? null : Number(e.target.value) }))}
                className={`${inputCls} py-1.5 w-28`}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs text-gray-500">내용</label>
              <span className={`text-[10px] ${addForm.content.length > 900 ? 'text-red-400' : 'text-gray-400'}`}>
                {addForm.content.length}/1000
              </span>
            </div>
            <textarea
              value={addForm.content}
              onChange={(e) => setAddForm((f) => ({ ...f, content: e.target.value }))}
              className={`${inputCls} resize-none`}
              rows={2}
              maxLength={1000}
              placeholder="홍익대학교 서양화과 졸업"
            />
          </div>
          {addError && <p className="text-xs text-red-500 mb-2">{addError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="px-4 py-1.5 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
            >
              {submitting ? '추가 중...' : '추가'}
            </button>
            <button
              onClick={() => { setAdding(false); setAddError(''); }}
              className="px-4 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {grouped.map(({ cat, items }) => (
        <div key={cat} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {cat} <span className="font-normal text-gray-400">({items.length})</span>
          </h3>
          {items.length === 0 ? (
            <p className="text-xs text-gray-300 italic">없음</p>
          ) : (
            <div className="space-y-2">
              {items.map((c) =>
                editId === c.id ? (
                  <div key={c.id} className="flex flex-wrap gap-2 items-center bg-yellow-50 rounded-lg px-3 py-2 border border-yellow-200">
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                      className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none"
                    >
                      {CAREER_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <input
                      type="number"
                      value={editForm.year ?? ''}
                      min={1900} max={2100}
                      placeholder="미공개"
                      onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value === '' ? null : Number(e.target.value) }))}
                      className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none w-20"
                    />
                    <input
                      value={editForm.content}
                      onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                      className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none min-w-[200px]"
                    />
                    <button
                      onClick={() => handleEditSave(c.id)}
                      disabled={submitting}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div key={c.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-gray-100 hover:border-gray-200 group">
                    <span className="text-xs font-mono text-gray-400 w-10 shrink-0">{c.year ?? '–'}</span>
                    <span className="flex-1 text-sm text-gray-700">{c.content}</span>
                    <button
                      onClick={() => { setEditId(c.id); setEditForm({ category: c.category, year: c.year ?? null, content: c.content }); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 transition-opacity"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deleting === c.id}
                      className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500 transition-opacity disabled:opacity-30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FeaturedTab({
  artistCode,
  current,
  onChanged,
}: {
  artistCode: string;
  current?: FeaturedSkuInfo;
  onChanged: () => void;
}) {
  const [skus, setSkus] = useState<ArtistSkuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '', listPrice: '', salePrice: '', description: '',
    mainCategory: '', genre: '',
  });
  const { main: mainCategories, sub: subCategories } = useCategories();
  const [addImage, setAddImage] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [addError, setAddError] = useState('');
  const [addBusy, setAddBusy] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const reloadSkus = useCallback(() => {
    setLoading(true);
    getArtistSkus(artistCode).then(setSkus).finally(() => setLoading(false));
  }, [artistCode]);

  useEffect(() => { reloadSkus(); }, [reloadSkus]);

  const handleSet = async (skuCode: string) => {
    setBusy(true);
    try { await setArtistFeaturedSku(artistCode, skuCode); onChanged(); }
    catch { alert('설정에 실패했습니다.'); }
    finally { setBusy(false); }
  };

  const handleClear = async () => {
    if (!window.confirm('대표 작품을 해제하시겠습니까?')) return;
    setBusy(true);
    try { await clearArtistFeaturedSku(artistCode); onChanged(); }
    catch { alert('해제에 실패했습니다.'); }
    finally { setBusy(false); }
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddImage(file);
    setAddPreview(URL.createObjectURL(file));
  };

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 200)
    + '-' + Date.now();

  const handleAddSku = async () => {
    if (!addForm.name.trim()) { setAddError('작품명을 입력해 주세요.'); return; }
    if (!addForm.listPrice || isNaN(Number(addForm.listPrice))) { setAddError('정가를 입력해 주세요.'); return; }
    if (!addForm.mainCategory) { setAddError('대분류를 선택해 주세요.'); return; }
    if (!addForm.genre) { setAddError('소분류를 선택해 주세요.'); return; }
    if (addForm.salePrice && Number(addForm.salePrice) > Number(addForm.listPrice)) {
      setAddError('할인가는 정가보다 클 수 없습니다.'); return;
    }
    setAddError('');
    setAddBusy(true);
    try {
      const created: any = await createSku({
        artistCode,
        name: addForm.name.trim(),
        slug: toSlug(addForm.name),
        listPrice: Number(addForm.listPrice),
        salePrice: addForm.salePrice ? Number(addForm.salePrice) : undefined,
        description: addForm.description.trim() || undefined,
        mainCategory: addForm.mainCategory,
        genre: addForm.genre,
        currency: 'KRW',
      });

      if (addImage && created?.skuCode) {
        try {
          await addSkuMedia(created.skuCode, addImage, {
            mediaType: 'IMAGE',
            mediaRole: 'MAIN',
            isPrimary: true,
            sortOrder: 0,
          });
        } catch {  }
      }

      if (created?.skuCode) {
        await setArtistFeaturedSku(artistCode, created.skuCode);
      }

      setAddOpen(false);
      setAddForm({ name: '', listPrice: '', salePrice: '', description: '', mainCategory: '', genre: '' });
      setAddImage(null);
      setAddPreview(null);
      reloadSkus();
      onChanged();
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message;
      setAddError(msg ?? '작품 등록에 실패했습니다.');
    } finally {
      setAddBusy(false);
    }
  };

  const fmt = (n: number) => n.toLocaleString('ko-KR');

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">현재 대표 작품</p>
        {current ? (
          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {current.imageUrl
                ? <img src={current.imageUrl} alt={current.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">없음</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">{current.name}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{current.skuCode}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                {current.salePrice ? (
                  <>
                    <span className="text-sm font-bold text-red-500">₩{fmt(current.salePrice)}</span>
                    <span className="text-xs text-gray-400 line-through">₩{fmt(current.listPrice)}</span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-gray-900">₩{fmt(current.listPrice)}</span>
                )}
              </div>
            </div>
            <button
              onClick={handleClear}
              disabled={busy}
              className="px-3 py-1.5 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40 whitespace-nowrap"
            >
              해제
            </button>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-sm text-gray-400">
            설정된 대표 작품이 없습니다.
          </div>
        )}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">새 작품 직접 등록</p>
          <button
            onClick={() => { setAddOpen((v) => !v); setAddError(''); }}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            {addOpen ? '닫기' : '작품 추가'}
          </button>
        </div>

        {addOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">대표 이미지</label>
              <div className="flex items-center gap-3">
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-white border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors flex-shrink-0"
                >
                  {addPreview
                    ? <img src={addPreview} alt="preview" className="w-full h-full object-cover" />
                    : <ImagePlus className="w-6 h-6 text-gray-300" />
                  }
                </div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  클릭하여 이미지 업로드<br />
                  <span className="text-gray-300">(JPG, PNG, WEBP)</span>
                </div>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">작품명 *</label>
              <input
                value={addForm.name}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className={inputCls}
                placeholder="예: 말머리 No.1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">대분류 *</label>
                <select
                  value={addForm.mainCategory}
                  onChange={(e) => setAddForm((f) => ({ ...f, mainCategory: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">-- 선택 --</option>
                  {mainCategories.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">소분류 *</label>
                <select
                  value={addForm.genre}
                  onChange={(e) => setAddForm((f) => ({ ...f, genre: e.target.value }))}
                  className={inputCls}
                >
                  <option value="">-- 선택 --</option>
                  {subCategories.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">정가 (원) *</label>
                <input
                  type="number"
                  value={addForm.listPrice}
                  onChange={(e) => setAddForm((f) => ({ ...f, listPrice: e.target.value }))}
                  className={inputCls}
                  placeholder="50000"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">할인가 (원)</label>
                <input
                  type="number"
                  value={addForm.salePrice}
                  onChange={(e) => setAddForm((f) => ({ ...f, salePrice: e.target.value }))}
                  className={inputCls}
                  placeholder="비워두면 정가 적용"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">작품 설명</label>
              <textarea
                value={addForm.description}
                onChange={(e) => setAddForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="작품에 대한 간략한 설명"
              />
            </div>

            {addError && <p className="text-xs text-red-500 whitespace-pre-line">{addError}</p>}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAddSku}
                disabled={addBusy}
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
              >
                {addBusy ? '등록 중...' : '작품 등록 + 대표 설정'}
              </button>
              <button
                onClick={() => { setAddOpen(false); setAddForm({ name: '', listPrice: '', salePrice: '', description: '' }); setAddImage(null); setAddPreview(null); setAddError(''); }}
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          기존 작품에서 선택 <span className="font-normal text-gray-400">({skus.length})</span>
        </p>
        {loading ? (
          <p className="text-sm text-gray-400">불러오는 중...</p>
        ) : skus.length === 0 ? (
          <p className="text-sm text-gray-400">등록된 작품이 없습니다. 위에서 새 작품을 추가해 주세요.</p>
        ) : (
          <div className="space-y-2">
            {skus.map((sku) => {
              const isCurrent = current?.skuCode === sku.skuCode;
              return (
                <div
                  key={sku.skuCode}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-colors
                    ${isCurrent ? 'border-black bg-gray-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {sku.imageUrl
                      ? <img src={sku.imageUrl} alt={sku.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">없음</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{sku.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {sku.salePrice ? (
                        <>
                          <span className="text-xs font-bold text-red-500">₩{fmt(sku.salePrice)}</span>
                          <span className="text-xs text-gray-400 line-through">₩{fmt(sku.listPrice)}</span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-gray-700">₩{fmt(sku.listPrice)}</span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-1
                        ${sku.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {sku.status === 'ACTIVE' ? '판매중' : sku.status}
                      </span>
                    </div>
                  </div>
                  {isCurrent ? (
                    <span className="text-[10px] font-semibold bg-koala-navy text-white px-2 py-1 rounded-full">대표</span>
                  ) : (
                    <button
                      onClick={() => handleSet(sku.skuCode)}
                      disabled={busy}
                      className="px-3 py-1.5 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-40 whitespace-nowrap"
                    >
                      설정
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
