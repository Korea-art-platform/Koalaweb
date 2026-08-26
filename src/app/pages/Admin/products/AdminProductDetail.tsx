import { useState, useEffect, useCallback, useRef, KeyboardEvent } from 'react';
import { romanize } from '@/utils/romanize';
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
import { getCategories, type CategoryGroups } from '@/api/category';
import { downscaleImage } from '@/utils/downscaleImage';

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

const LIMITED = 'LIMITED';

const NAME_ROWS = [
  ['model', 'modelEn', '모델', '닥쿤이', 'dakkuni'],
  ['subModelName', 'subModelNameEn', '세부모델명', '호돌이', 'hodori'],
  ['color', 'colorEn', '색상', '검정', 'black'],
] as const;

const MEDIA_ACCEPT = 'image/*,video/mp4,video/quicktime,video/webm';

interface BadgeItem { text: string; type: string; }

const BADGE_COLORS: Record<string, string> = {
  green:   'bg-green-50 text-green-700 border-green-200',
  amber:   'bg-amber-50 text-amber-600 border-amber-200',
  blue:    'bg-blue-50 text-blue-600 border-blue-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
};

const PREDEFINED_BADGES: BadgeItem[] = [
  { text: '진품 보증',     type: 'blue'  },
  { text: '전세계 배송',   type: 'green' },
  { text: '아티스트 사인', type: 'amber' },
  { text: '케어 포함',     type: 'green' },
];

function InfoTab({ sku, onSaved }: { sku: any; onSaved: () => void }) {
  const parsedBadges: BadgeItem[] = (() => {
    try { return sku.badges ? JSON.parse(sku.badges) : []; }
    catch { return []; }
  })();

  const cmToMm = (v: any) => (v || v === 0 ? String(Number(v) * 10) : '');

  const [form, setForm] = useState({
    // 상품명과 슬러그는 모델·세부모델명·색상에서 서버가 만든다. 화면에 두지 않는다.
    model: sku.model ?? '',
    modelEn: sku.modelEn ?? '',
    subModelName: sku.subModelName ?? '',
    subModelNameEn: sku.subModelNameEn ?? '',
    color: sku.color ?? '',
    colorEn: sku.colorEn ?? '',
    description: sku.description ?? '',
    mainCategory: sku.mainCategory ?? '',
    genre: sku.genre ?? '',
    material: sku.material ?? '',
    materialDescription: sku.materialDescription ?? '',
    packagingTitle: sku.packagingTitle ?? '',
    packagingDescription: sku.packagingDescription ?? '',
    listPrice: String(sku.listPrice ?? ''),
    salePrice: sku.salePrice ? String(sku.salePrice) : '',
    editionSize: sku.editionSize ? String(sku.editionSize) : '',
    editionNumber: sku.editionNumber ? String(sku.editionNumber) : '',
    widthCm: cmToMm(sku.widthCm),
    heightCm: cmToMm(sku.heightCm),
    depthCm: cmToMm(sku.depthCm),
    weightG: sku.weightG ? String(sku.weightG)
      : sku.weightKg ? String(Math.round(Number(sku.weightKg) * 1000)) : '',
    badges: parsedBadges as BadgeItem[],
  });
  // 이미 저장된 영문명은 사람이 정한 값이다. 한국어를 고쳐도 덮어쓰지 않는다.
  const [enTouched, setEnTouched] = useState<Record<string, boolean>>(() => ({
    modelEn: Boolean(sku.modelEn),
    subModelNameEn: Boolean(sku.subModelNameEn),
    colorEn: Boolean(sku.colorEn),
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const setF = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const [categories, setCategories] = useState<CategoryGroups>({ main: [], sub: [] });
  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories({ main: [], sub: [] }));
  }, []);

  const isLimited = form.mainCategory === LIMITED;

  const handleSave = async () => {
    for (const [key, label] of [
      ['model', '모델'], ['modelEn', '모델(영문)'],
      ['subModelName', '세부모델명'], ['subModelNameEn', '세부모델명(영문)'],
      ['color', '색상'], ['colorEn', '색상(영문)'],
    ] as const) {
      if (!form[key].trim()) { setError(`${label}을(를) 입력해 주세요.`); return; }
    }
    if (!form.mainCategory) { setError('대분류를 선택해 주세요.'); return; }
    if (!form.genre) { setError('소분류를 선택해 주세요.'); return; }
    if (!form.listPrice || isNaN(Number(form.listPrice))) { setError('정가를 올바르게 입력해 주세요.'); return; }
    if (!form.salePrice || isNaN(Number(form.salePrice))) {
      setError('할인가를 입력해 주세요. 할인이 없으면 정가와 같은 값을 넣으시면 됩니다.'); return;
    }
    if (Number(form.salePrice) > Number(form.listPrice)) {
      setError('할인가는 정가보다 클 수 없습니다.'); return;
    }
    if (!sku.primaryImageUrl) {
      setError('대표 이미지가 없습니다. 아래 이미지 탭에서 먼저 등록해 주세요.'); return;
    }
    if (!form.description.trim()) { setError('작품 설명을 입력해 주세요.'); return; }
    for (const [key, label] of [
      ['widthCm', '가로'], ['heightCm', '높이'], ['depthCm', '세로'], ['weightG', '무게'],
    ] as const) {
      const v = form[key];
      if (!v || isNaN(Number(v)) || Number(v) <= 0) {
        setError(`규격 - ${label}을(를) 0보다 큰 숫자로 입력해 주세요.`); return;
      }
    }
    setError('');
    setSaving(true);
    try {
      await updateSku(sku.skuCode, {
        model: form.model.trim(),
        modelEn: form.modelEn.trim(),
        subModelName: form.subModelName.trim(),
        subModelNameEn: form.subModelNameEn.trim(),
        color: form.color.trim(),
        colorEn: form.colorEn.trim(),
        description: form.description.trim(),
        mainCategory: form.mainCategory,
        genre: form.genre,
        material: form.material.trim() || undefined,
        materialDescription: form.materialDescription.trim() || undefined,
        packagingTitle: form.packagingTitle.trim() || undefined,
        packagingDescription: form.packagingDescription.trim() || undefined,
        listPrice: Number(form.listPrice),
        salePrice: Number(form.salePrice),
        primaryImageUrl: sku.primaryImageUrl,
        editionSize: isLimited && form.editionSize ? Number(form.editionSize) : undefined,
        editionNumber: isLimited && form.editionNumber ? Number(form.editionNumber) : undefined,
        widthCm: Number(form.widthCm) / 10,
        heightCm: Number(form.heightCm) / 10,
        depthCm: Number(form.depthCm) / 10,
        weightG: Number(form.weightG),
        badges: form.badges.length > 0 ? JSON.stringify(form.badges) : undefined,
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

  const selectCls = `${inputCls} bg-white`;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">상품명</label>
            <input value={[form.model, form.subModelName, form.color].filter(Boolean).join(' ')}
              readOnly disabled
              className={`${inputCls} bg-gray-50 text-gray-500`} />
            <p className="text-[11px] text-gray-400 mt-1.5">모델·세부모델명·색상으로 자동으로 만들어집니다.</p>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">주소(슬러그)</label>
            <input value={sku.slug ?? ''} readOnly disabled className={`${inputCls} bg-gray-50 text-gray-500 font-mono`} />
            <p className="text-[11px] text-gray-400 mt-1.5">바꾸면 기존 링크가 깨져 수정할 수 없습니다.</p>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="mb-3 grid grid-cols-[5.5rem_1fr_1fr] items-center gap-3">
            <span />
            <span className="text-xs font-semibold text-gray-500">한국어</span>
            <span className="text-xs font-semibold text-gray-500">영문</span>
          </div>

          {NAME_ROWS.map(([ko, en, label, phKo, phEn]) => (
            <div key={ko} className="mb-2.5 grid grid-cols-[5.5rem_1fr_1fr] items-center gap-3">
              <label className="text-xs text-gray-500">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                value={(form as any)[ko]}
                onChange={(e) => {
                  const v = e.target.value;
                  setF(enTouched[en] ? ({ [ko]: v } as any) : ({ [ko]: v, [en]: romanize(v) } as any));
                }}
                className={inputCls} placeholder={`예: ${phKo}`} />
              <input
                value={(form as any)[en]}
                onChange={(e) => {
                  setEnTouched((t) => ({ ...t, [en]: true }));
                  setF({ [en]: e.target.value } as any);
                }}
                className={inputCls} placeholder={`예: ${phEn}`} />
            </div>
          ))}

          <p className="mt-3 text-[11px] leading-relaxed text-gray-400">
            상품명은 이 세 값으로 자동으로 만들어집니다. 영문은 주소를 만드는 데 쓰입니다.
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">작품 크기 / 무게 <span className="text-gray-400">(크기 단위 mm)</span></p>
          <div className="grid grid-cols-4 gap-2">
            {(['widthCm', 'depthCm', 'heightCm', 'weightG'] as const).map((key) => {
              const label = { widthCm: '가로(mm)', depthCm: '세로(mm)', heightCm: '높이(mm)', weightG: '무게(g)' }[key];
              return (
                <div key={key}>
                  <label className="block text-xs text-gray-400 mb-1">{label}</label>
                  <input type="number" value={(form as any)[key]} onChange={(e) => setF({ [key]: e.target.value } as any)}
                    className={inputCls + ' py-1.5'} placeholder="0" min="0" step="0.1" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              대분류 * <span className="text-gray-300">판매 형태</span>
            </label>
            <select value={form.mainCategory} onChange={(e) => setF({ mainCategory: e.target.value })} className={selectCls}>
              <option value="">-- 선택 --</option>
              {categories.main.map((c) => (
                <option key={c.id} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">
              소분류 * <span className="text-gray-300">장르 — 메인 노출 기준</span>
            </label>
            <select value={form.genre} onChange={(e) => setF({ genre: e.target.value })} className={selectCls}>
              <option value="">-- 선택 --</option>
              {categories.sub.map((c) => (
                <option key={c.id} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">재질 / 소재</label>
          <input
            value={form.material}
            onChange={(e) => setF({ material: e.target.value })}
            className={inputCls}
            placeholder="예: 레진, 아크릴 / 캔버스에 유화 / 브론즈"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">재질 상세 설명</label>
          <textarea
            value={form.materialDescription}
            onChange={(e) => setF({ materialDescription: e.target.value })}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="재질/소재 섹션에 표시될 상세 설명을 입력하세요"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">포장 섹션 제목</label>
            <input
              value={form.packagingTitle}
              onChange={(e) => setF({ packagingTitle: e.target.value })}
              className={inputCls}
              placeholder="예: 안전하게 포장하여 배송됩니다"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">포장 섹션 설명</label>
            <input
              value={form.packagingDescription}
              onChange={(e) => setF({ packagingDescription: e.target.value })}
              className={inputCls}
              placeholder="예: 특수 에어캡으로 안전 포장"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">정가 (원) *</label>
            <input type="number" value={form.listPrice} onChange={(e) => setF({ listPrice: e.target.value })}
              className={inputCls} min="0" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">할인가 (원) *</label>
            <input type="number" value={form.salePrice} onChange={(e) => setF({ salePrice: e.target.value })}
              className={inputCls} min="0" placeholder="할인가 없으면 비워두기" />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">작품 설명</label>
          <textarea value={form.description} onChange={(e) => setF({ description: e.target.value })}
            rows={5} className={`${inputCls} resize-none`} />
        </div>

        {isLimited && (
          <div className="border border-gray-100 rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-500">
              에디션 <span className="font-normal text-gray-400">(선택 — 정해지지 않았으면 비워두세요)</span>
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">에디션 번호</label>
                <input type="number" value={form.editionNumber}
                  onChange={(e) => setF({ editionNumber: e.target.value })}
                  className={inputCls} placeholder="예: 125" min="1" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">에디션 총 수량</label>
                <input type="number" value={form.editionSize}
                  onChange={(e) => setF({ editionSize: e.target.value })}
                  className={inputCls} placeholder="예: 500" min="1" />
              </div>
            </div>
          </div>
        )}

        <div className="border border-gray-100 rounded-lg p-4">
          <BadgeEditor
            badges={form.badges}
            onChange={(badges) => setF({ badges })}
          />
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">
          {success ? <><Check className="w-4 h-4" /> 저장됨</> : saving ? '저장 중...' : '저장'}
        </button>
      </div>
      <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 text-xs text-gray-500 space-y-1">
        <div>아티스트: <span className="text-gray-700">{sku.artistName}</span></div>
        {sku.isLimitedEdition && <div>에디션: <span className="text-gray-700">{sku.editionNumber} / {sku.editionSize}</span></div>}
        {(sku.widthCm || sku.heightCm) && (
          <div>크기: <span className="text-gray-700">{sku.widthCm}×{sku.heightCm}{sku.depthCm ? `×${sku.depthCm}` : ''} cm</span></div>
        )}
      </div>
    </div>
  );
}

function ImagesTab({ skuCode, onChanged }: { skuCode: string; onChanged: () => void }) {
  const [mediaList, setMediaList] = useState<SkuMediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [replaceTarget, setReplaceTarget] = useState<{ id: number; role: string } | null>(null);

  const mainInputRef      = useRef<HTMLInputElement>(null);
  const detailInputRef    = useRef<HTMLInputElement>(null);
  const materialInputRef  = useRef<HTMLInputElement>(null);
  const packagingInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef   = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getSkuMedia(skuCode)
      .then((list) => { if (alive) setMediaList(list); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [skuCode]);

  const mainImage       = mediaList.find((m) => m.mediaRole === 'MAIN') ?? null;
  const detailImages    = mediaList.filter((m) => m.mediaRole === 'DETAIL');
  const materialImages  = mediaList.filter((m) => m.mediaRole === 'MATERIAL');
  const packagingImages = mediaList.filter((m) => m.mediaRole === 'PACKAGING');

  const clearInputs = () => {
    for (const ref of [mainInputRef, detailInputRef, materialInputRef, packagingInputRef, replaceInputRef]) {
      if (ref.current) ref.current.value = '';
    }
  };

  const handleUpload = async (files: FileList | File[], role: string, replaceId?: number) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(role);

    const baseOrder: Record<string, number> = {
      MAIN:      0,
      DETAIL:    detailImages.length,
      MATERIAL:  materialImages.length,
      PACKAGING: packagingImages.length,
    };

    try {
      for (let i = 0; i < list.length; i++) {
        const file = await downscaleImage(list[i]);
        const created = await addSkuMedia(skuCode, file, {
          mediaType: file.type.startsWith('video/') ? 'VIDEO' : 'IMAGE',
          mediaRole: role,
          isPrimary: role === 'MAIN',
          sortOrder: (baseOrder[role] ?? 0) + i,
        });
        setMediaList((prev) => [...prev, created]);
      }

      if (replaceId !== undefined) {
        await deleteSkuMedia(skuCode, replaceId);
        setMediaList((prev) => prev.filter((m) => m.id !== replaceId));
      }
      onChanged();
    } catch (e) {
      const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
      alert(msg ?? '업로드에 실패했습니다.');

      try { setMediaList(await getSkuMedia(skuCode)); } catch {  }
    } finally {
      setUploading(null);
      setReplaceTarget(null);
      clearInputs();
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('삭제하시겠습니까?')) return;
    setDeleting(id);
    try {
      await deleteSkuMedia(skuCode, id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      onChanged();
    } catch {
      alert('삭제에 실패했습니다.');
    } finally {
      setDeleting(null);
    }
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
      <div>
        <SectionLabel badge="상세" desc="상품 상세 페이지 '작품 - 상세' 섹션에 순서대로 표시됩니다" />
        <div className="grid grid-cols-2 gap-2">
          <VisualSlot
            image={detailImages[0] ?? null}
            aspectClass="aspect-[3/4]"
            emptyLabel="상세 이미지 1 — 클릭하여 업로드"
            uploading={uploading === 'DETAIL'}
            deleting={deleting === (detailImages[0]?.id ?? -1)}
            onClickEmpty={!detailImages[0] ? () => detailInputRef.current?.click() : undefined}
            onReplace={detailImages[0] ? () => triggerReplace(detailImages[0].id, 'DETAIL') : undefined}
            onDelete={detailImages[0] ? () => handleDelete(detailImages[0].id) : undefined}
            index={detailImages[0] ? 1 : undefined}
          />
          <div className="flex flex-col gap-2">
            <VisualSlot
              image={detailImages[1] ?? null}
              aspectClass="flex-1 min-h-0"
              emptyLabel={detailImages[0] ? '이미지 2 추가' : '이미지 1 먼저 추가'}
              uploading={uploading === 'DETAIL'}
              deleting={deleting === (detailImages[1]?.id ?? -1)}
              onClickEmpty={detailImages[0] && !detailImages[1] ? () => detailInputRef.current?.click() : undefined}
              onReplace={detailImages[1] ? () => triggerReplace(detailImages[1].id, 'DETAIL') : undefined}
              onDelete={detailImages[1] ? () => handleDelete(detailImages[1].id) : undefined}
              index={detailImages[1] ? 2 : undefined}
            />
            <VisualSlot
              image={detailImages[2] ?? null}
              aspectClass="flex-1 min-h-0"
              emptyLabel={detailImages[1] ? '이미지 3 추가' : '이미지 2 먼저 추가'}
              uploading={uploading === 'DETAIL'}
              deleting={deleting === (detailImages[2]?.id ?? -1)}
              onClickEmpty={detailImages[1] && !detailImages[2] ? () => detailInputRef.current?.click() : undefined}
              onReplace={detailImages[2] ? () => triggerReplace(detailImages[2].id, 'DETAIL') : undefined}
              onDelete={detailImages[2] ? () => handleDelete(detailImages[2].id) : undefined}
              index={detailImages[2] ? 3 : undefined}
            />
          </div>
        </div>

        {detailImages.slice(3).map((img, idx) => (
          <VisualSlot
            key={img.id}
            image={img}
            aspectClass="w-full aspect-square mt-2"
            emptyLabel={`상세 이미지 ${idx + 4}`}
            uploading={uploading === 'DETAIL'}
            deleting={deleting === img.id}
            onReplace={() => triggerReplace(img.id, 'DETAIL')}
            onDelete={() => handleDelete(img.id)}
            index={idx + 4}
          />
        ))}

        {detailImages.length >= 3 && (
          <VisualSlot
            image={null}
            aspectClass="w-full aspect-square mt-2"
            emptyLabel={`이미지 ${detailImages.length + 1} 추가`}
            uploading={uploading === 'DETAIL'}
            deleting={false}
            onClickEmpty={() => detailInputRef.current?.click()}
          />
        )}
      </div>
      <div>
        <SectionLabel badge="재질" desc="재질/소재 섹션에 표시되는 사진 (기본정보 탭의 재질 상세 설명과 함께 노출)" />
        <GridImageSlots
          images={materialImages}
          role="MATERIAL"
          uploading={uploading}
          deleting={deleting}
          onClickEmpty={() => materialInputRef.current?.click()}
          onReplace={(id) => triggerReplace(id, 'MATERIAL')}
          onDelete={handleDelete}
        />
      </div>
      <div>
        <SectionLabel badge="포장" desc="포장 섹션에 표시되는 사진 (기본정보 탭의 포장 섹션 제목과 함께 노출)" />
        <GridImageSlots
          images={packagingImages}
          role="PACKAGING"
          uploading={uploading}
          deleting={deleting}
          onClickEmpty={() => packagingInputRef.current?.click()}
          onReplace={(id) => triggerReplace(id, 'PACKAGING')}
          onDelete={handleDelete}
        />
      </div>
      <input ref={mainInputRef}      type="file" accept={MEDIA_ACCEPT} className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files, 'MAIN')} />
      <input ref={detailInputRef}    type="file" accept={MEDIA_ACCEPT} multiple className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files, 'DETAIL')} />
      <input ref={materialInputRef}  type="file" accept={MEDIA_ACCEPT} multiple className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files, 'MATERIAL')} />
      <input ref={packagingInputRef} type="file" accept={MEDIA_ACCEPT} multiple className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files, 'PACKAGING')} />
      <input ref={replaceInputRef}   type="file" accept={MEDIA_ACCEPT} className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0] && replaceTarget)
            handleUpload([e.target.files[0]], replaceTarget.role, replaceTarget.id);
        }} />
    </div>
  );
}

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

  const isVideo = image.mediaType === 'VIDEO';

  return (
    <div className={`${aspectClass} relative group overflow-hidden rounded-xl border border-gray-200`}>
      {isVideo ? (
        <video
          src={image.fileUrl}
          className="w-full h-full object-cover bg-black"
          muted
          playsInline
          preload="metadata"
          controls
        />
      ) : (
        <img src={image.fileUrl} alt={image.altText ?? emptyLabel} className="w-full h-full object-cover" />
      )}

      {isVideo && (
        <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          영상
        </span>
      )}

      {index !== undefined && (
        <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
          {index}
        </span>
      )}

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors pointer-events-none" />
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

function GridImageSlots({
  images,
  role,
  uploading,
  deleting,
  onClickEmpty,
  onReplace,
  onDelete,
}: {
  images: SkuMediaItem[];
  role: string;
  uploading: string | null;
  deleting: number | null;
  onClickEmpty: () => void;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {images.map((img, idx) => (
        <VisualSlot
          key={img.id}
          image={img}
          aspectClass="aspect-square"
          emptyLabel={`${role} 이미지 ${idx + 1}`}
          uploading={uploading === role}
          deleting={deleting === img.id}
          onReplace={() => onReplace(img.id)}
          onDelete={() => onDelete(img.id)}
          index={idx + 1}
        />
      ))}

      <VisualSlot
        image={null}
        aspectClass="aspect-square"
        emptyLabel={`이미지 ${images.length + 1} 추가`}
        uploading={uploading === role}
        deleting={false}
        onClickEmpty={onClickEmpty}
      />
    </div>
  );
}

function StockStatusTab({
  sku,
  onChanged,
  navigate,
}: {
  sku: any;
  onChanged: () => void;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const current = sku.stockQuantity ?? 0;
  const [targetQty, setTargetQty] = useState(String(current));
  const [memo, setMemo] = useState('');
  const [stockBusy, setStockBusy] = useState(false);
  const [stockError, setStockError] = useState('');
  const [statusBusy, setStatusBusy] = useState(false);

  const targetNum = parseInt(targetQty, 10);
  const delta = isNaN(targetNum) ? null : targetNum - current;

  const handleAdjust = async () => {
    if (delta === null || isNaN(targetNum) || targetNum < 0) {
      setStockError('올바른 수량을 입력해 주세요. (0 이상)');
      return;
    }
    if (delta === 0) { setStockError('현재 재고와 동일합니다.'); return; }
    setStockError('');
    setStockBusy(true);
    try {
      await adjustStock(sku.skuCode, delta, memo || undefined);
      setMemo('');
      onChanged();
    } catch { setStockError('재고 조정에 실패했습니다.'); }
    finally { setStockBusy(false); }
  };

  const latestCurrent = sku.stockQuantity ?? 0;

  const statusAction = async (fn: () => Promise<void>) => {
    setStatusBusy(true);
    try { await fn(); onChanged(); } finally { setStatusBusy(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-1">재고 관리</h2>
        <p className="text-2xl font-bold text-gray-900 mb-4 tabular-nums">
          {latestCurrent}<span className="text-sm font-normal text-gray-400 ml-1">개</span>
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">변경할 재고 수량</label>
            <input
              type="number"
              value={targetQty}
              min={0}
              onChange={(e) => setTargetQty(e.target.value)}
              className={inputCls}
              placeholder="변경 후 재고 수량 입력"
            />

            {delta !== null && delta !== 0 && !isNaN(targetNum) && targetNum >= 0 && (
              <p className={`text-xs mt-1.5 font-medium ${delta > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                {latestCurrent}개 → {targetNum}개 ({delta > 0 ? `+${delta}` : delta})
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">메모 (선택)</label>
            <input value={memo} onChange={(e) => setMemo(e.target.value)}
              className={inputCls} placeholder="조정 사유 등" />
          </div>
          {stockError && <p className="text-xs text-red-500">{stockError}</p>}
          <button
            onClick={handleAdjust}
            disabled={stockBusy || delta === 0 || delta === null || isNaN(targetNum) || targetNum < 0}
            className="w-full py-2 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
          >
            {stockBusy ? '처리 중...' : '재고 수정'}
          </button>
        </div>
      </div>
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

function BadgeEditor({
  badges,
  onChange,
}: {
  badges: BadgeItem[];
  onChange: (badges: BadgeItem[]) => void;
}) {
  const [customText, setCustomText] = useState('');

  const togglePredefined = (badge: BadgeItem) => {
    const exists = badges.some((b) => b.text === badge.text && b.type === badge.type);
    if (exists) {
      onChange(badges.filter((b) => !(b.text === badge.text && b.type === badge.type)));
    } else {
      onChange([...badges, badge]);
    }
  };

  const addCustom = () => {
    const text = customText.trim();
    if (!text) return;
    if (badges.some((b) => b.text === text)) return;
    onChange([...badges, { text, type: 'default' }]);
    setCustomText('');
  };

  const remove = (idx: number) => onChange(badges.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500">뱃지</p>
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_BADGES.map((badge) => {
          const active = badges.some((b) => b.text === badge.text && b.type === badge.type);
          return (
            <button
              key={badge.text}
              type="button"
              onClick={() => togglePredefined(badge)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                active
                  ? BADGE_COLORS[badge.type] + ' ring-2 ring-offset-1 ring-current'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
              }`}
            >
              {active ? '✓ ' : ''}{badge.text}
            </button>
          );
        })}
      </div>
      <div className="flex gap-2">
        <input
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') { e.preventDefault(); addCustom(); }
          }}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-black/10"
          placeholder="직접 입력 후 Enter (회색 뱃지)"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          추가
        </button>
      </div>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${BADGE_COLORS[badge.type] ?? BADGE_COLORS.default}`}
            >
              {badge.text}
              <button
                type="button"
                onClick={() => remove(idx)}
                className="ml-0.5 hover:opacity-60 font-bold leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
