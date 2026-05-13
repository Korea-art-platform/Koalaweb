import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Check, ImagePlus, Trash2, Star } from 'lucide-react';
import {
  updateSku,
  publishSku,
  discontinueSku,
  deleteSku,
  adjustStock,
  getSkuMedia,
  addSkuMedia,
  deleteSkuMedia,
  type SkuMediaItem,
} from '@/api/adminApi';
import adminInstance from '@/api/adminInstance';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10';

const SKU_STATUS_COLOR: Record<string, string> = {
  DRAFT:        'bg-gray-100 text-gray-600',
  ACTIVE:       'bg-green-50 text-green-700',
  OUT_OF_STOCK: 'bg-yellow-50 text-yellow-700',
  DISCONTINUED: 'bg-red-50 text-red-600',
};
const SKU_STATUS_LABEL: Record<string, string> = {
  DRAFT:        '임시저장',
  ACTIVE:       '판매중',
  OUT_OF_STOCK: '품절',
  DISCONTINUED: '판매중단',
};

type Tab = 'info' | 'images' | 'stock';

export default function AdminProductDetail() {
  const { skuCode } = useParams<{ skuCode: string }>();
  const navigate = useNavigate();
  const [sku, setSku] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('info');

  const load = useCallback(async () => {
    if (!skuCode) return;
    setLoading(true);
    try {
      const res = await adminInstance.get(`/api/v1/skus/${skuCode}`);
      setSku(res.data.data);
    } finally {
      setLoading(false);
    }
  }, [skuCode]);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="p-8 text-sm text-gray-400">불러오는 중...</div>;
  if (!sku) return <div className="p-8 text-sm text-red-400">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> 목록으로
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-0.5">{sku.name}</h1>
          <p className="text-xs text-gray-400 font-mono">{sku.skuCode}</p>
        </div>
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${SKU_STATUS_COLOR[sku.status] ?? 'bg-gray-100 text-gray-500'}`}>
          {SKU_STATUS_LABEL[sku.status] ?? sku.status}
        </span>
      </div>

      {/* 탭 */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(['info', 'images', 'stock'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-black text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {{ info: '기본 정보', images: '이미지', stock: '재고·상태' }[t]}
          </button>
        ))}
      </div>

      {tab === 'info' && <InfoTab sku={sku} onSaved={load} />}
      {tab === 'images' && <ImagesTab skuCode={sku.skuCode} onChanged={load} />}
      {tab === 'stock' && <StockStatusTab sku={sku} onChanged={load} navigate={navigate} />}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 기본 정보 탭
// ────────────────────────────────────────────────────────────
function InfoTab({ sku, onSaved }: { sku: any; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: sku.name ?? '',
    slug: sku.slug ?? '',
    description: sku.description ?? '',
    listPrice: String(sku.listPrice ?? ''),
    salePrice: sku.salePrice ? String(sku.salePrice) : '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const setF = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) { setError('이름과 슬러그는 필수입니다.'); return; }
    if (!form.listPrice || isNaN(Number(form.listPrice))) { setError('정가를 올바르게 입력해 주세요.'); return; }
    setError('');
    setSaving(true);
    try {
      await updateSku(sku.skuCode, {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        listPrice: Number(form.listPrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,
        primaryImageUrl: sku.primaryImageUrl,
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
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">상품명 *</label>
            <input value={form.name} onChange={(e) => setF({ name: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">슬러그 *</label>
            <input value={form.slug} onChange={(e) => setF({ slug: e.target.value })} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">정가 (원) *</label>
            <input type="number" value={form.listPrice} onChange={(e) => setF({ listPrice: e.target.value })}
              className={inputCls} min="0" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">판매가 (원)</label>
            <input type="number" value={form.salePrice} onChange={(e) => setF({ salePrice: e.target.value })}
              className={inputCls} min="0" placeholder="할인가 없으면 비워두기" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">작품 설명</label>
          <textarea value={form.description} onChange={(e) => setF({ description: e.target.value })}
            rows={5} className={`${inputCls} resize-none`} />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
          {success ? <><Check className="w-4 h-4" /> 저장됨</> : saving ? '저장 중...' : '저장'}
        </button>
      </div>

      {/* 읽기전용 메타 */}
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
        <div>아티스트: <span className="text-gray-700">{sku.artistName}</span></div>
        <div>장르: <span className="text-gray-700">{sku.genre ?? '—'}</span></div>
        <div>타입: <span className="text-gray-700">{sku.skuType ?? '—'}</span></div>
        {sku.isLimitedEdition && <div>에디션: <span className="text-gray-700">{sku.editionNumber} / {sku.editionSize}</span></div>}
        {(sku.widthCm || sku.heightCm) && (
          <div>크기: <span className="text-gray-700">{sku.widthCm}×{sku.heightCm}{sku.depthCm ? `×${sku.depthCm}` : ''} cm</span></div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 이미지 탭 — 실제 상세 페이지 레이아웃 그대로 WYSIWYG 편집
// ────────────────────────────────────────────────────────────
function ImagesTab({ skuCode, onChanged }: { skuCode: string; onChanged: () => void }) {
  const [mediaList, setMediaList] = useState<SkuMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<{ id: number; role: string } | null>(null);

  const mainInputRef   = useRef<HTMLInputElement>(null);
  const detailInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try { setMediaList(await getSkuMedia(skuCode)); }
    finally { setLoading(false); }
  }, [skuCode]);

  useEffect(() => { reload(); }, [reload]);

  const mainImage    = mediaList.find((m) => m.mediaRole === 'MAIN') ?? null;
  const detailImages = mediaList.filter((m) => m.mediaRole === 'DETAIL');

  const handleUpload = async (file: File, role: string, replaceId?: number) => {
    setUploading(role);
    try {
      await addSkuMedia(skuCode, file, {
        mediaType: 'IMAGE',
        mediaRole: role,
        isPrimary: role === 'MAIN',
        sortOrder: role === 'MAIN' ? 0 : detailImages.length,
      });
      if (replaceId !== undefined) await deleteSkuMedia(skuCode, replaceId);
      await reload();
      onChanged();
    } catch {
      alert('업로드에 실패했습니다.');
    } finally {
      setUploading(null);
      setReplaceTarget(null);
      if (mainInputRef.current)    mainInputRef.current.value    = '';
      if (detailInputRef.current)  detailInputRef.current.value  = '';
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('이미지를 삭제하시겠습니까?')) return;
    setDeleting(id);
    try { await deleteSkuMedia(skuCode, id); await reload(); onChanged(); }
    finally { setDeleting(null); }
  };

  const triggerReplace = (id: number, role: string) => {
    setReplaceTarget({ id, role });
    setTimeout(() => replaceInputRef.current?.click(), 0);
  };

  if (loading) return <p className="text-sm text-gray-400 py-4">불러오는 중...</p>;

  return (
    <div className="space-y-10">
      <p className="text-xs text-gray-400">
        실제 상품 상세 페이지와 동일한 레이아웃입니다.&nbsp;
        <span className="font-medium text-gray-500">빈 칸을 클릭</span>해 이미지를 추가하고,
        이미 있는 이미지에 마우스를 올리면 교체·삭제 버튼이 나타납니다.
      </p>

      {/* ── 대표 이미지 (MAIN) ── */}
      <div>
        <SectionLabel badge="★ 대표" desc="상품 목록·썸네일 및 상세 페이지 첫 이미지" />
        <VisualSlot
          image={mainImage}
          aspectClass="w-full aspect-square"
          emptyLabel="대표 이미지 클릭하여 업로드"
          uploading={uploading === 'MAIN'}
          deleting={deleting === (mainImage?.id ?? -1)}
          onClickEmpty={() => mainInputRef.current?.click()}
          onReplace={() => mainImage && triggerReplace(mainImage.id, 'MAIN')}
          onDelete={() => mainImage && handleDelete(mainImage.id)}
        />
      </div>

      {/* ── 상세 이미지 (DETAIL) — ArtImages.tsx 와 동일한 그리드 ── */}
      <div>
        <SectionLabel badge="상세" desc="상품 상세 페이지 '작품 - 상세' 섹션에 순서대로 표시됩니다" />

        {detailImages.length === 0 && (
          // 아직 아무것도 없으면 첫 슬롯을 넓게 미리보기
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <VisualSlot
              image={null}
              aspectClass="col-span-2 md:col-span-3 aspect-[2/1]"
              emptyLabel="상세 이미지 1 — 클릭하여 업로드"
              uploading={uploading === 'DETAIL'}
              deleting={false}
              onClickEmpty={() => detailInputRef.current?.click()}
            />
          </div>
        )}

        {detailImages.length === 1 && (
          <>
            <VisualSlot
              image={detailImages[0]}
              aspectClass="w-full aspect-square"
              emptyLabel="상세 이미지 1"
              uploading={uploading === 'DETAIL'}
              deleting={deleting === detailImages[0].id}
              onReplace={() => triggerReplace(detailImages[0].id, 'DETAIL')}
              onDelete={() => handleDelete(detailImages[0].id)}
              index={1}
            />
            {/* 두 번째 이미지 추가 슬롯 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              <VisualSlot
                image={null}
                aspectClass="aspect-square"
                emptyLabel="이미지 2 추가"
                uploading={uploading === 'DETAIL'}
                deleting={false}
                onClickEmpty={() => detailInputRef.current?.click()}
              />
            </div>
          </>
        )}

        {detailImages.length >= 2 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {detailImages.map((img, idx) => (
              <VisualSlot
                key={img.id}
                image={img}
                aspectClass={idx === 0 ? 'col-span-2 md:col-span-3 aspect-[2/1]' : 'aspect-square'}
                emptyLabel={`상세 이미지 ${idx + 1}`}
                uploading={uploading === 'DETAIL'}
                deleting={deleting === img.id}
                onReplace={() => triggerReplace(img.id, 'DETAIL')}
                onDelete={() => handleDelete(img.id)}
                index={idx + 1}
              />
            ))}
            {/* 다음 이미지 추가 슬롯 */}
            <VisualSlot
              image={null}
              aspectClass="aspect-square"
              emptyLabel={`이미지 ${detailImages.length + 1} 추가`}
              uploading={uploading === 'DETAIL'}
              deleting={false}
              onClickEmpty={() => detailInputRef.current?.click()}
            />
          </div>
        )}
      </div>

      {/* 히든 파일 인풋들 */}
      <input ref={mainInputRef}    type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'MAIN')} />
      <input ref={detailInputRef}  type="file" accept="image/*" className="hidden"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'DETAIL')} />
      <input ref={replaceInputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0] && replaceTarget)
            handleUpload(e.target.files[0], replaceTarget.role, replaceTarget.id);
        }} />
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 섹션 레이블
// ────────────────────────────────────────────────────────────
function SectionLabel({ badge, desc }: { badge: string; desc: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-semibold bg-gray-900 text-white px-2 py-0.5 rounded">
        {badge}
      </span>
      <p className="text-xs text-gray-400">{desc}</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 클릭 가능한 이미지 슬롯
// ────────────────────────────────────────────────────────────
function VisualSlot({
  image,
  aspectClass,
  emptyLabel,
  uploading,
  deleting,
  onClickEmpty,
  onReplace,
  onDelete,
  index,
}: {
  image: SkuMediaItem | null;
  aspectClass: string;
  emptyLabel: string;
  uploading: boolean;
  deleting: boolean;
  onClickEmpty?: () => void;
  onReplace?: () => void;
  onDelete?: () => void;
  index?: number;
}) {
  // ── 빈 슬롯 ──
  if (!image) {
    return (
      <div
        onClick={!uploading ? onClickEmpty : undefined}
        className={`${aspectClass} flex flex-col items-center justify-center gap-2
          border-2 border-dashed border-gray-200 rounded-xl cursor-pointer
          hover:border-gray-400 hover:bg-gray-50 transition-colors group`}
      >
        {uploading ? (
          <span className="text-xs text-gray-400 animate-pulse">업로드 중...</span>
        ) : (
          <>
            <ImagePlus className="w-7 h-7 text-gray-300 group-hover:text-gray-400" />
            <span className="text-xs text-gray-300 group-hover:text-gray-500 text-center px-2">{emptyLabel}</span>
          </>
        )}
      </div>
    );
  }

  // ── 이미지가 있는 슬롯 ──
  return (
    <div className={`${aspectClass} relative group overflow-hidden rounded-xl border border-gray-200`}>
      <img src={image.fileUrl} alt={image.altText ?? emptyLabel} className="w-full h-full object-cover" />

      {/* 순번 배지 */}
      {index !== undefined && (
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
          {index}
        </span>
      )}

      {/* hover 오버레이 */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />

      {/* 액션 버튼 */}
      <div className="absolute inset-x-0 bottom-0 flex gap-1.5 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {onReplace && (
          <button
            onClick={(e) => { e.stopPropagation(); onReplace(); }}
            disabled={uploading || deleting}
            className="flex-1 py-1.5 text-xs bg-white/90 backdrop-blur text-gray-700 rounded-lg font-medium hover:bg-white disabled:opacity-50"
          >
            교체
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            disabled={deleting}
            className="py-1.5 px-2.5 bg-red-500/90 backdrop-blur text-white rounded-lg hover:bg-red-600 disabled:opacity-40"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// 재고·상태 탭
// ────────────────────────────────────────────────────────────
function StockStatusTab({
  sku,
  onChanged,
  navigate,
}: {
  sku: any;
  onChanged: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const [delta, setDelta] = useState('');
  const [memo, setMemo] = useState('');
  const [stockBusy, setStockBusy] = useState(false);
  const [stockError, setStockError] = useState('');
  const [statusBusy, setStatusBusy] = useState(false);

  const handleAdjust = async () => {
    if (!delta || isNaN(Number(delta))) { setStockError('올바른 수량을 입력해 주세요.'); return; }
    setStockError('');
    setStockBusy(true);
    try {
      await adjustStock(sku.skuCode, Number(delta), memo || undefined);
      setDelta(''); setMemo(''); onChanged();
    } catch { setStockError('재고 조정에 실패했습니다.'); }
    finally { setStockBusy(false); }
  };

  const statusAction = async (fn: () => Promise<void>) => {
    setStatusBusy(true);
    try { await fn(); onChanged(); } finally { setStatusBusy(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 재고 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">재고 관리</h2>
        <p className="text-2xl font-bold text-gray-900 mb-4 tabular-nums">
          {sku.stockQuantity ?? 0}<span className="text-sm font-normal text-gray-400 ml-1">개</span>
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              조정 수량 <span className="text-gray-400">(양수: 입고, 음수: 차감)</span>
            </label>
            <input type="number" value={delta} onChange={(e) => setDelta(e.target.value)}
              className={inputCls} placeholder="예: 10 또는 -3" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">메모 (선택)</label>
            <input value={memo} onChange={(e) => setMemo(e.target.value)}
              className={inputCls} placeholder="입고 사유 등" />
          </div>
          {stockError && <p className="text-xs text-red-500">{stockError}</p>}
          <button onClick={handleAdjust} disabled={stockBusy || !delta}
            className="w-full py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50">
            {stockBusy ? '처리 중...' : '재고 조정'}
          </button>
        </div>
      </div>

      {/* 상태 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">판매 상태</h2>
        <div className="space-y-2">
          {(sku.status === 'DRAFT' || sku.status === 'OUT_OF_STOCK' || sku.status === 'DISCONTINUED') && (
            <button
              onClick={() => statusAction(() => publishSku(sku.skuCode))}
              disabled={statusBusy}
              className="w-full py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {sku.status === 'DISCONTINUED' ? '재게시' : '게시 (판매 시작)'}
            </button>
          )}
          {sku.status === 'ACTIVE' && (
            <button
              onClick={() => statusAction(() => discontinueSku(sku.skuCode))}
              disabled={statusBusy}
              className="w-full py-2 text-sm text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              판매 중단
            </button>
          )}
          <button
            onClick={async () => {
              if (!window.confirm('상품을 삭제하시겠습니까? 되돌릴 수 없습니다.')) return;
              await deleteSku(sku.skuCode);
              navigate('/admin/products');
            }}
            className="w-full py-2 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
          >
            상품 삭제
          </button>
        </div>
      </div>
    </div>
  );
}
