import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router';
import { getAdminSkus, createSku, addSkuMedia, publishSku, discontinueSku, deleteSku, adjustStock, getAdminArtists } from '@/api/adminApi';
import { getCategories, type CategoryGroups } from '@/api/category';
import { downscaleImage } from '@/utils/downscaleImage';
import { slugify, slugifyInput } from '@/utils/slugify';
import { Package, ImagePlus, X, FileSpreadsheet } from 'lucide-react';
import AdminCsvImportModal from './AdminCsvImportModal';

const SKU_STATUS_COLOR: Record<string, string> = {
  DRAFT:        'bg-gray-100 text-gray-500',
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

const LIMITED = 'LIMITED';

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10';

interface BadgeItem { text: string; type: string; }

interface CreateForm {
  artistCode: string;
  name: string;
  slug: string;
  description: string;

  mainCategory: string;

  genre: string;
  listPrice: string;
  salePrice: string;
  editionSize: string;
  editionNumber: string;
  badges: BadgeItem[];
  widthCm: string;
  heightCm: string;
  depthCm: string;
  weightKg: string;
}

const EMPTY_FORM: CreateForm = {
  artistCode: '', name: '', slug: '', description: '',
  mainCategory: '', genre: '',
  listPrice: '', salePrice: '',
  editionSize: '', editionNumber: '',
  badges: [],
  widthCm: '', heightCm: '', depthCm: '', weightKg: '',
};

const BADGE_COLORS: Record<string, string> = {
  green:   'bg-green-50 text-green-700 border-green-200',
  amber:   'bg-amber-50 text-amber-600 border-amber-200',
  blue:    'bg-blue-50 text-blue-600 border-blue-200',
  default: 'bg-gray-50 text-gray-600 border-gray-200',
};

const PREDEFINED_BADGES: BadgeItem[] = [
  { text: '진품 보증',    type: 'blue'  },
  { text: '전세계 배송',  type: 'green' },
  { text: '아티스트 사인', type: 'amber' },
  { text: '케어 포함',    type: 'green' },
];

export default function AdminProductList() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stockModal, setStockModal] = useState<{ skuCode: string; current: number } | null>(null);
  const [targetQty, setTargetQty] = useState('');
  const [memo, setMemo] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<CreateForm>(EMPTY_FORM);
  const [artists, setArtists] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreview, setPrimaryPreview] = useState<string>('');
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryGroups>({ main: [], sub: [] });

  const load = useCallback(() => {
    setLoading(true);
    getAdminSkus(page).then(setData).finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = async () => {
    setForm(EMPTY_FORM);
    setFormError('');
    setPrimaryFile(null);
    setPrimaryPreview('');
    setCreateOpen(true);
    try {
      const res = await getAdminArtists(0, 200);
      setArtists(res.content ?? []);
    } catch {
      setArtists([]);
    }
    try {
      const groups = await getCategories();
      setCategories(groups);

      setF({ mainCategory: groups.main[0]?.code ?? '' });
    } catch {
      setCategories({ main: [], sub: [] });
    }
  };

  const handlePrimaryFileChange = (file: File | null) => {
    setPrimaryFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPrimaryPreview(url);
    } else {
      setPrimaryPreview('');
    }
  };

  const setF = (patch: Partial<CreateForm>) => setForm((f) => ({ ...f, ...patch }));

  const isLimited = form.mainCategory === LIMITED;

  const handleSlugAutoFill = (name: string) => setF({ slug: slugify(name) });

  const handleCreate = async () => {
    if (!form.artistCode) { setFormError('아티스트를 선택해 주세요.'); return; }
    if (!form.name.trim()) { setFormError('상품명을 입력해 주세요.'); return; }
    if (!form.slug.trim()) { setFormError('슬러그를 입력해 주세요.'); return; }
    if (!form.mainCategory) { setFormError('대분류를 선택해 주세요.'); return; }

    if (!form.genre) { setFormError('소분류를 선택해 주세요. (메인 페이지가 소분류 단위로 나뉩니다)'); return; }
    if (!form.listPrice || isNaN(Number(form.listPrice))) { setFormError('정가를 올바르게 입력해 주세요.'); return; }
    if (Number(form.listPrice) < 0) { setFormError('정가는 0원 이상이어야 합니다.'); return; }

    if (!form.description.trim()) { setFormError('작품 설명을 입력해 주세요. (상세 페이지에 노출됩니다)'); return; }
    for (const [key, label] of [['widthCm', '가로'], ['heightCm', '세로'], ['weightKg', '무게']] as const) {
      const v = form[key];
      if (!v) { setFormError(`규격 - ${label}을(를) 입력해 주세요.`); return; }
      if (isNaN(Number(v)) || Number(v) <= 0) { setFormError(`규격 - ${label}은(는) 0보다 큰 숫자로 입력해 주세요.`); return; }
    }
    if (form.depthCm && (isNaN(Number(form.depthCm)) || Number(form.depthCm) < 0)) {
      setFormError('규격 - 깊이는 0 이상의 숫자로 입력해 주세요.'); return;
    }
    if (form.salePrice) {
      if (isNaN(Number(form.salePrice))) { setFormError('판매가를 올바르게 입력해 주세요.'); return; }
      if (Number(form.salePrice) < 0) { setFormError('판매가는 0원 이상이어야 합니다.'); return; }
      if (Number(form.salePrice) > Number(form.listPrice)) {
        setFormError('판매가는 정가보다 클 수 없습니다. (판매가 ≤ 정가)\n예) 정가 100,000원 → 판매가 80,000원');
        return;
      }
    }
    setFormError('');
    setSubmitting(true);

    let createdSkuCode: string | null = null;

    try {
      const created: any = await createSku({
        artistCode: form.artistCode,
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || undefined,
        mainCategory: form.mainCategory,
        genre: form.genre,
        listPrice: Number(form.listPrice),
        salePrice: form.salePrice ? Number(form.salePrice) : undefined,

        editionSize: isLimited && form.editionSize ? Number(form.editionSize) : undefined,
        editionNumber: isLimited && form.editionNumber ? Number(form.editionNumber) : undefined,
        badges: form.badges.length > 0 ? JSON.stringify(form.badges) : undefined,
        widthCm: form.widthCm ? Number(form.widthCm) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        depthCm: form.depthCm ? Number(form.depthCm) : undefined,
        weightKg: form.weightKg ? Number(form.weightKg) : undefined,
      });
      createdSkuCode = created?.skuCode ?? null;
    } catch (err: any) {
      const serverMsg = err?.response?.data?.message;
      setFormError(serverMsg || '상품 등록에 실패했습니다. 슬러그가 중복되었을 수 있습니다.');
      setSubmitting(false);
      return;
    }

    setCreateOpen(false);
    load();
    setSubmitting(false);

    if (primaryFile && createdSkuCode) {
      try {
        await addSkuMedia(createdSkuCode, await downscaleImage(primaryFile), {
          mediaType: 'IMAGE',
          mediaRole: 'MAIN',
          isPrimary: true,
        });
        load();
      } catch {
        alert(`상품은 등록됐습니다.\n대표 이미지 업로드에 실패했습니다.\n편집 페이지 > 이미지 탭에서 다시 업로드해 주세요.`);
      }
    }
  };

  const handlePublish = async (skuCode: string) => { await publishSku(skuCode); load(); };
  const handleDiscontinue = async (skuCode: string) => {
    if (!window.confirm('판매 중단하시겠습니까?')) return;
    await discontinueSku(skuCode); load();
  };
  const handleDelete = async (skuCode: string) => {
    if (!window.confirm('삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;
    await deleteSku(skuCode); load();
  };
  const handleStockAdjust = async () => {
    if (!stockModal) return;
    const targetNum = parseInt(targetQty, 10);
    const delta = targetNum - stockModal.current;
    if (isNaN(targetNum) || targetNum < 0) return;
    if (delta === 0) return;
    setAdjusting(true);
    try {
      await adjustStock(stockModal.skuCode, delta, memo || undefined);
      setStockModal(null); setTargetQty(''); setMemo(''); load();
    } finally { setAdjusting(false); }
  };

  const skus: any[] = data?.content ?? [];
  const totalPages: number = data?.totalPages ?? 0;

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Package className="w-3.5 h-3.5" />
        <span>상품 관리</span>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">상품 (SKU) 목록</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCsvOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            CSV 일괄 등록
          </button>
          <button
            onClick={openCreate}
            className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
          >
            + 상품 추가
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : skus.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">등록된 상품이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-5 py-3 font-medium">상품명</th>
                  <th className="text-left px-5 py-3 font-medium">아티스트</th>
                  <th className="text-left px-5 py-3 font-medium">판매가</th>
                  <th className="text-left px-5 py-3 font-medium">재고</th>
                  <th className="text-left px-5 py-3 font-medium">상태</th>
                  <th className="text-left px-5 py-3 font-medium">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {skus.map((sku: any) => (
                  <tr key={sku.skuCode} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{sku.name}</div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5">{sku.skuCode}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm">{sku.artistName}</td>
                    <td className="px-5 py-4 text-gray-700 tabular-nums whitespace-nowrap">
                      {Number(sku.effectivePrice).toLocaleString()}원
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => { setStockModal({ skuCode: sku.skuCode, current: sku.stockQuantity }); setTargetQty(String(sku.stockQuantity ?? 0)); }}
                        className="font-medium text-gray-700 hover:text-black tabular-nums underline decoration-dashed underline-offset-2"
                        title="클릭하여 재고 조정"
                      >
                        {sku.stockQuantity}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${SKU_STATUS_COLOR[sku.status] ?? 'bg-gray-100 text-gray-500'}`}>
                        {SKU_STATUS_LABEL[sku.status] ?? sku.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-3">
                        <button
                          onClick={() => navigate(`/admin/products/${sku.skuCode}`)}
                          className="text-xs text-blue-500 hover:text-blue-700 font-medium"
                        >
                          편집
                        </button>
                        {(sku.status === 'DRAFT' || sku.status === 'OUT_OF_STOCK') && (
                          <button onClick={() => handlePublish(sku.skuCode)} className="text-xs text-green-600 hover:text-green-800 font-medium">게시</button>
                        )}
                        {sku.status === 'ACTIVE' && (
                          <button onClick={() => handleDiscontinue(sku.skuCode)} className="text-xs text-orange-500 hover:text-orange-700 font-medium">중단</button>
                        )}
                        {sku.status === 'DISCONTINUED' && (
                          <button onClick={() => handlePublish(sku.skuCode)} className="text-xs text-blue-500 hover:text-blue-700 font-medium">재게시</button>
                        )}
                        <button onClick={() => handleDelete(sku.skuCode)} className="text-xs text-red-400 hover:text-red-600 font-medium">삭제</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">이전</button>
          <span className="text-xs text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">다음</button>
        </div>
      )}

      {csvOpen && (
        <AdminCsvImportModal
          onClose={() => setCsvOpen(false)}
          onImported={load}
        />
      )}

      {stockModal && (() => {
        const targetNum = parseInt(targetQty, 10);
        const delta = isNaN(targetNum) ? null : targetNum - stockModal.current;
        const isValid = delta !== null && delta !== 0 && targetNum >= 0;
        return (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
              <h2 className="font-semibold text-gray-900 mb-1">재고 수정</h2>
              <p className="text-2xl font-bold text-gray-900 mb-4 tabular-nums">
                {stockModal.current}<span className="text-sm font-normal text-gray-400 ml-1">개</span>
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
                  {delta !== null && delta !== 0 && targetNum >= 0 && (
                    <p className={`text-xs mt-1.5 font-medium ${delta > 0 ? 'text-blue-500' : 'text-red-500'}`}>
                      {stockModal.current}개 → {targetNum}개 ({delta > 0 ? `+${delta}` : delta})
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">메모 (선택)</label>
                  <input value={memo} onChange={(e) => setMemo(e.target.value)}
                    className={inputCls} placeholder="조정 사유 입력" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button onClick={() => { setStockModal(null); setTargetQty(''); setMemo(''); }}
                  className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
                <button onClick={handleStockAdjust} disabled={adjusting || !isValid}
                  className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">
                  {adjusting ? '처리 중...' : '적용'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {createOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl my-8">
            <h2 className="font-semibold text-gray-900 mb-5">상품 추가</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">아티스트 *</label>
                <select value={form.artistCode} onChange={(e) => setF({ artistCode: e.target.value })} className={inputCls}>
                  <option value="">-- 아티스트 선택 --</option>
                  {artists.map((a: any) => (
                    <option key={a.artistCode} value={a.artistCode}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">상품명 *</label>
                  <input value={form.name}
                    onChange={(e) => { setF({ name: e.target.value }); handleSlugAutoFill(e.target.value); }}
                    className={inputCls} placeholder="작품 제목" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">슬러그 *</label>
                  <input value={form.slug} onChange={(e) => setF({ slug: slugifyInput(e.target.value) })}
                    className={inputCls} placeholder="artwork-title" />
                  <p className="text-[11px] text-gray-400 mt-1.5">
                    상품명에서 자동으로 채워집니다. 상품마다 달라야 합니다.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    대분류 * <span className="text-gray-300">판매 형태</span>
                  </label>
                  <select value={form.mainCategory} onChange={(e) => setF({ mainCategory: e.target.value })} className={inputCls}>
                    <option value="">-- 선택 --</option>
                    {categories.main.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    소분류 * <span className="text-gray-300">장르 — 메인 노출 기준</span>
                  </label>
                  <select value={form.genre} onChange={(e) => setF({ genre: e.target.value })} className={inputCls}>
                    <option value="">-- 선택 --</option>
                    {categories.sub.map((c) => <option key={c.id} value={c.code}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    정가 (원) * <span className="text-gray-300">정상/원가</span>
                  </label>
                  <input type="number" value={form.listPrice} onChange={(e) => setF({ listPrice: e.target.value })}
                    className={inputCls} placeholder="1500000" min="0" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    할인가 (원) <span className="text-gray-300">정가보다 낮아야 함</span>
                  </label>
                  <input type="number" value={form.salePrice} onChange={(e) => setF({ salePrice: e.target.value })}
                    className={inputCls} placeholder="1200000" min="0" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">대표 이미지 (선택)</label>
                <input
                  ref={primaryInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handlePrimaryFileChange(e.target.files?.[0] ?? null)}
                />
                {primaryPreview ? (
                  <div className="relative inline-block">
                    <img src={primaryPreview} alt="preview" className="w-24 h-24 object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => { handlePrimaryFileChange(null); if (primaryInputRef.current) primaryInputRef.current.value = ''; }}
                      className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => primaryInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 text-xs border border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-600 transition-colors"
                  >
                    <ImagePlus className="w-4 h-4" /> 이미지 선택
                  </button>
                )}
              </div>

              {isLimited && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">
                    에디션 <span className="text-gray-400">(선택 — 정해지지 않았으면 비워두세요)</span>
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">에디션 총 수량</label>
                      <input type="number" value={form.editionSize} onChange={(e) => setF({ editionSize: e.target.value })}
                        className={inputCls} placeholder="50" min="1" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5">이 작품 에디션 번호</label>
                      <input type="number" value={form.editionNumber} onChange={(e) => setF({ editionNumber: e.target.value })}
                        className={inputCls} placeholder="7" min="1" />
                    </div>
                  </div>
                </div>
              )}

              <BadgeEditor badges={form.badges} onChange={(badges) => setF({ badges })} />
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  작품 크기 / 무게 <span className="text-red-500">*</span>
                  <span className="text-gray-400 ml-1">(깊이는 평면 작품이면 비워두세요)</span>
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {(['widthCm', 'heightCm', 'depthCm', 'weightKg'] as const).map((key) => {
                    const label = { widthCm: '가로(cm)', heightCm: '세로(cm)', depthCm: '깊이(cm)', weightKg: '무게(kg)' }[key];
                    const optional = key === 'depthCm';
                    return (
                      <div key={key}>
                        <label className="block text-xs text-gray-400 mb-1">
                          {label}{!optional && <span className="text-red-500 ml-0.5">*</span>}
                        </label>
                        <input type="number" value={form[key]} onChange={(e) => setF({ [key]: e.target.value })}
                          className={inputCls + ' py-1.5'} placeholder="0" min="0" step="0.1" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">
                  작품 설명 <span className="text-red-500">*</span>
                </label>
                <textarea value={form.description} onChange={(e) => setF({ description: e.target.value })}
                  rows={3} className={`${inputCls} resize-none`} placeholder="작품에 대한 설명 (상세 페이지·상품 카드에 노출됩니다)" />
              </div>
            </div>

            {formError && <p className="text-xs text-red-500 mt-3 whitespace-pre-line">{formError}</p>}

            <div className="flex gap-2 mt-5">
              <button onClick={() => setCreateOpen(false)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">취소</button>
              <button onClick={handleCreate} disabled={submitting}
                className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50">
                {submitting ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        </div>
      )}
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
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); }}}
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
