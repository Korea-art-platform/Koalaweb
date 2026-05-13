import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, Trash2, Plus, Pencil, X, Check } from 'lucide-react';
// Upload은 SectionCard에서 사용
import {
  getAdminArtist,
  updateArtist,
  getArtistMedia,
  addArtistMedia,
  deleteArtistMedia,
  addArtistCareer,
  updateArtistCareer,
  deleteArtistCareer,
  type ArtistDetailResponse,
  type ArtistMediaResponse,
  type ArtistCareerResponse,
} from '@/api/adminApi';

type Tab = 'info' | 'media' | 'career';

// 상세페이지 섹션별 미디어 역할 정의
const PAGE_SECTIONS = [
  {
    role: 'PROFILE',
    icon: '👤',
    title: '프로필 사진',
    desc: '작가 소개 섹션 메인 이미지',
    accept: 'image/*',
    single: true,   // 1장만 (교체형)
  },
  {
    role: 'INTERVIEW_VIDEO',
    icon: '🎬',
    title: '인터뷰 영상',
    desc: 'INTERVIEW 섹션에 표시되는 영상 파일',
    accept: 'video/*',
    single: true,
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

const CAREER_CATEGORIES = ['학력', '개인전', '그룹전'] as const;

// ────────────────────────────────────────────────────────────
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
      {/* 헤더 */}
      <button
        onClick={() => navigate('/admin/artists')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 목록으로
      </button>
      <h1 className="text-xl font-bold text-gray-900 mb-1">{artist.name}</h1>
      <p className="text-xs text-gray-400 font-mono mb-6">{artist.artistCode}</p>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['info', 'media', 'career'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-black text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {{ info: '기본정보', media: '미디어', career: '약력' }[t]}
          </button>
        ))}
      </div>

      {tab === 'info' && <InfoTab artist={artist} onSaved={load} />}
      {tab === 'media' && <MediaTab artistCode={artist.artistCode} mediaList={artist.mediaList} onChanged={load} />}
      {tab === 'career' && <CareerTab artistCode={artist.artistCode} careerList={artist.careerList} onChanged={load} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 기본정보 탭
// ────────────────────────────────────────────────────────────
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
        className="px-5 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
      >
        {success ? <><Check className="w-4 h-4" /> 저장됨</> : saving ? '저장 중...' : '저장'}
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 미디어 탭 — 상세페이지 섹션별 카드
// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
// 섹션별 카드
// ────────────────────────────────────────────────────────────
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

  const mediaType = section.role === 'INTERVIEW_VIDEO' ? 'VIDEO' : 'IMAGE';

  const upload = async (files: FileList | null, replacingId?: number) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await addArtistMedia(artistCode, file, {
          mediaType,
          mediaRole: section.role,
          sortOrder: items.length,
        });
      }
      // 교체인 경우 기존 항목 삭제
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

  // 단일 슬롯 (PROFILE / INTERVIEW_VIDEO / INTERVIEW_IMAGE)
  const current = items[0];

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
        <span className="text-lg">{section.icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-800">{section.title}</p>
          <p className="text-xs text-gray-400">{section.desc}</p>
        </div>
      </div>

      {/* 바디 */}
      <div className="px-5 py-4">
        {section.single ? (
          /* ── 단일 슬롯 ── */
          <div className="flex items-center gap-4">
            {/* 미리보기 */}
            <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              {current ? (
                current.mediaType === 'VIDEO' ? (
                  <video src={current.fileUrl} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={current.fileUrl} alt="" className="w-full h-full object-cover" />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  없음
                </div>
              )}
            </div>

            {/* 액션 */}
            <div className="flex flex-col gap-2">
              <input ref={fileInputRef} type="file" accept={section.accept} className="hidden"
                onChange={(e) => upload(e.target.files)} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
          /* ── 다중 슬롯 (STUDIO / HANDS) ── */
          <div>
            {items.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {items.map((m, idx) => (
                  <div key={m.id} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={m.fileUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    {/* 순번 */}
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {idx + 1}
                    </span>
                    {/* hover 액션 */}
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

            {/* 추가 버튼 */}
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

      {/* 교체용 히든 인풋 */}
      <input ref={replaceRef} type="file" accept={section.accept} className="hidden"
        onChange={(e) => replaceId !== null && upload(e.target.files, replaceId)} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 약력 탭
// ────────────────────────────────────────────────────────────
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
  const [addForm, setAddForm] = useState({ category: '학력', year: new Date().getFullYear(), content: '' });
  const [addError, setAddError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ category: '학력', year: 2024, content: '' });

  const [deleting, setDeleting] = useState<number | null>(null);

  const grouped = CAREER_CATEGORIES.map((cat) => ({
    cat,
    items: careerList.filter((c) => c.category === cat).sort((a, b) => b.year - a.year || a.sortOrder - b.sortOrder),
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
      setAddForm({ category: '학력', year: new Date().getFullYear(), content: '' });
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
      {/* 추가 버튼 */}
      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs bg-black text-white rounded-lg hover:bg-gray-800 mb-6"
        >
          <Plus className="w-3.5 h-3.5" /> 약력 추가
        </button>
      )}

      {/* 추가 폼 */}
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
              <label className="block text-xs text-gray-500 mb-1">연도</label>
              <input
                type="number"
                value={addForm.year}
                min={1900} max={2100}
                onChange={(e) => setAddForm((f) => ({ ...f, year: Number(e.target.value) }))}
                className={`${inputCls} py-1.5 w-24`}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-xs text-gray-500 mb-1">내용</label>
            <input
              value={addForm.content}
              onChange={(e) => setAddForm((f) => ({ ...f, content: e.target.value }))}
              className={inputCls}
              placeholder="홍익대학교 서양화과 졸업"
            />
          </div>
          {addError && <p className="text-xs text-red-500 mb-2">{addError}</p>}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="px-4 py-1.5 text-xs bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
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

      {/* 카테고리별 목록 */}
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
                  /* 인라인 편집 */
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
                      value={editForm.year}
                      min={1900} max={2100}
                      onChange={(e) => setEditForm((f) => ({ ...f, year: Number(e.target.value) }))}
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
                  /* 읽기 모드 */
                  <div key={c.id} className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-gray-100 hover:border-gray-200 group">
                    <span className="text-xs font-mono text-gray-400 w-10 shrink-0">{c.year}</span>
                    <span className="flex-1 text-sm text-gray-700">{c.content}</span>
                    <button
                      onClick={() => { setEditId(c.id); setEditForm({ category: c.category, year: c.year, content: c.content }); }}
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

// ────────────────────────────────────────────────────────────
// 공통 헬퍼
// ────────────────────────────────────────────────────────────
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
