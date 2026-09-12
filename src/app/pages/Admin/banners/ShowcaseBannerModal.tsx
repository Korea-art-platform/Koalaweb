import { useEffect, useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import {
  getAdminArtists, getArtistSkus, uploadBannerImage, createBanner, updateBanner,
  type ArtistSkuItem, type BannerResponse,
} from '@/api/adminApi';
import ShowcaseArt, { STAGE_LIGHT, stageColor } from '@/app/components/Home/ShowcaseArt';
import { pickProductColor, softenColor } from '@/app/lib/productColor';

interface Props {
  // 수정할 배너 — 없으면 새로 등록
  target: BannerResponse | null;
  // 새로 등록할 때만 — 다른 타입을 고르면 일반 배너 폼으로 넘긴다
  typeOptions?: { value: string; label: string }[];
  onSwitchType?: (type: string) => void;
  onClose: () => void;
  onSaved: () => void;
}

type Slot = { file: File | null; preview: string; url: string };

// 위에서부터 하나씩 — 메인(필수), 구성 1~3(선택)
const SLOT_LABELS = [
  '메인 이미지 *',
  '구성 이미지 1 · 오른쪽 위 (선택)',
  '구성 이미지 2 · 오른쪽 아래 (선택)',
  '구성 이미지 3 · 왼쪽 아래 (선택)',
];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: '미공개',
  OUT_OF_STOCK: '품절',
  DISCONTINUED: '판매중지',
};

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white disabled:bg-gray-50 disabled:text-gray-400';

export default function ShowcaseBannerModal({ target, typeOptions, onSwitchType, onClose, onSaved }: Props) {
  const [artists, setArtists] = useState<{ artistCode: string; name: string }[]>([]);
  const [artistCode, setArtistCode] = useState(target?.artistCode ?? '');
  const [skus, setSkus] = useState<ArtistSkuItem[]>([]);
  const [skuCode, setSkuCode] = useState(target?.skuCode ?? '');
  const [title, setTitle] = useState(target?.title ?? '');
  const [description, setDescription] = useState(target?.description ?? '');
  const [slots, setSlots] = useState<Slot[]>(() =>
    [target?.imageUrl, target?.effectImageUrl1, target?.effectImageUrl2, target?.effectImageUrl3]
      .map((url) => ({ file: null, preview: url ?? '', url: url ?? '' })),
  );
  const [bgColor, setBgColor] = useState(stageColor(target?.bgColor).toLowerCase());
  const [sortOrder, setSortOrder] = useState(String(target?.sortOrder ?? 0));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    getAdminArtists(0, 200)
      .then((page) => setArtists(page?.content ?? []))
      .catch(() => setArtists([]));
  }, []);

  // 작가를 고르면 그 작가 작품만
  useEffect(() => {
    if (!artistCode) { setSkus([]); return; }
    let alive = true;
    getArtistSkus(artistCode)
      .then((list) => { if (alive) setSkus(list); })
      .catch(() => { if (alive) setSkus([]); });
    return () => { alive = false; };
  }, [artistCode]);

  const artist = artists.find((a) => a.artistCode === artistCode);
  const sku = skus.find((s) => s.skuCode === skuCode);

  const changeArtist = (code: string) => {
    setArtistCode(code);
    setSkuCode('');
  };

  const pickFile = (i: number, file: File | null) => {
    const preview = file ? URL.createObjectURL(file) : '';
    setSlots((prev) => prev.map((s, idx) => (idx === i ? { file, preview, url: '' } : s)));
    const input = inputRefs.current[i];
    if (input) input.value = '';

    // 메인 이미지면 제품 색을 뽑아 배경색으로
    if (i === 0 && file) {
      const img = new Image();
      img.onload = () => {
        const rgb = pickProductColor(img, img.naturalWidth, img.naturalHeight);
        if (rgb) setBgColor(softenColor(rgb));
      };
      img.src = preview;
    }
  };

  const handleSave = async () => {
    if (!artistCode) { setError('작가를 선택해 주세요.'); return; }
    if (!skuCode) { setError('작품을 선택해 주세요.'); return; }
    if (!slots[0].preview) { setError('메인 이미지를 올려 주세요.'); return; }

    setError('');
    setSaving(true);
    try {
      // 새로 고른 파일만 업로드
      const urls = await Promise.all(
        slots.map((s) => (s.file ? uploadBannerImage(s.file) : Promise.resolve(s.url))),
      );
      // 메인 문구를 비우면 작품명
      const headline = title.trim() || sku?.name || target?.title || '메인 히어로';
      const sub = description.trim();
      const sort = Number(sortOrder) || 0;

      if (target) {
        await updateBanner(target.bannerCode, {
          title: headline,
          subtitle: target.subtitle ?? null,
          badge: target.badge ?? null,
          description: sub || null,
          imageUrl: urls[0],
          mobileImageUrl: target.mobileImageUrl ?? null,
          videoUrl: target.videoUrl ?? null,
          skuCode,
          effectImageUrl1: urls[1] || null,
          effectImageUrl2: urls[2] || null,
          effectImageUrl3: urls[3] || null,
          linkUrl: target.linkUrl ?? null,
          linkTarget: target.linkTarget ?? null,
          bgColor,
          textColor: target.textColor ?? null,
          sortOrder: sort,
          visibleFrom: target.visibleFrom ?? null,
          visibleTo: target.visibleTo ?? null,
        });
      } else {
        await createBanner({
          bannerType: 'MAIN',
          title: headline,
          description: sub || undefined,
          imageUrl: urls[0],
          skuCode,
          effectImageUrl1: urls[1] || undefined,
          effectImageUrl2: urls[2] || undefined,
          effectImageUrl3: urls[3] || undefined,
          bgColor,
          sortOrder: sort,
        });
      }
      onSaved();
    } catch {
      setError('배너 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="font-semibold text-gray-900 mb-1">{target ? '메인 히어로 수정' : '배너 추가'}</h2>
        <p className="text-xs text-gray-400 mb-5">
          이미지는 배경 없는 PNG 로 올려 주세요. 구성 이미지는 비워 두면 그 자리가 비어 있습니다.
        </p>

        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="space-y-3">
            {!target && typeOptions && (
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">배너 타입 *</label>
                <select
                  value="MAIN"
                  onChange={(e) => onSwitchType?.(e.target.value)}
                  className={inputCls}
                >
                  {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">작가 *</label>
                <select value={artistCode} onChange={(e) => changeArtist(e.target.value)} className={inputCls}>
                  <option value="">-- 선택 --</option>
                  {artists.map((a) => <option key={a.artistCode} value={a.artistCode}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">작품 *</label>
                <select
                  value={skuCode}
                  onChange={(e) => setSkuCode(e.target.value)}
                  disabled={!artistCode}
                  className={inputCls}
                >
                  <option value="">{artistCode ? '-- 선택 --' : '작가를 먼저 고르세요'}</option>
                  {skus.map((s) => (
                    <option key={s.skuCode} value={s.skuCode}>
                      {s.name}{STATUS_LABELS[s.status] ? ` (${STATUS_LABELS[s.status]})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1.5">메인 문구</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                className={inputCls}
                placeholder="비워 두면 작품명을 씁니다"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">서브 문구</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
                className={`${inputCls} resize-none`}
                placeholder="메인 문구 아래 두세 줄 설명"
              />
            </div>

            {SLOT_LABELS.map((label, i) => (
              <div key={label}>
                <label className="block text-xs text-gray-500 mb-1.5">{label}</label>
                <input
                  ref={(el) => { inputRefs.current[i] = el; }}
                  type="file"
                  accept="image/png,image/webp"
                  className="hidden"
                  onChange={(e) => pickFile(i, e.target.files?.[0] ?? null)}
                />
                {slots[i].preview ? (
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100">
                      <img src={slots[i].preview} alt="" className="h-full w-full object-contain" />
                      <button
                        onClick={() => pickFile(i, null)}
                        aria-label={`${label} 지우기`}
                        className="absolute -top-1.5 -right-1.5 bg-koala-navy text-white rounded-full p-0.5 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => inputRefs.current[i]?.click()}
                      className="text-xs text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      다른 파일로 바꾸기
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => inputRefs.current[i]?.click()}
                    className="flex items-center gap-2 w-full justify-center py-3 text-xs border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    PNG 파일 선택
                  </button>
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">배경색</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-12 cursor-pointer rounded-lg border border-gray-200 bg-white p-1"
                  />
                  <span className="font-mono text-xs text-gray-500">{bgColor}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">표시 순서</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className={inputCls}
                  placeholder="0"
                />
              </div>
            </div>
            <p className="text-[11px] text-gray-400">
              배경색은 메인 이미지를 올리면 제품 색을 한 톤 눌러 자동으로 정합니다. 바꿔도 됩니다.
            </p>
          </div>

          {/* 미리보기 — 히어로와 같은 배치 */}
          <div className="md:sticky md:top-0 md:self-start">
            <p className="text-xs text-gray-500 mb-1.5">미리보기</p>
            <div className="relative overflow-hidden rounded-xl" style={{ backgroundColor: bgColor }}>
              <div aria-hidden className="absolute inset-0" style={{ background: STAGE_LIGHT }} />
              <div className="relative p-3">
                {slots[0].preview ? (
                  <ShowcaseArt
                    imageUrl={slots[0].preview}
                    effects={[slots[1].preview, slots[2].preview, slots[3].preview]}
                    alt="미리보기"
                    name={sku?.name ?? (target?.skuCode === skuCode ? target?.skuName : undefined)}
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-xs text-white/60">
                    메인 이미지를 올리면 여기에 보입니다
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-center text-sm font-semibold text-gray-900 truncate">{sku?.name ?? '작품명'}</p>
            <p className="mt-0.5 text-center text-xs text-gray-400">{artist?.name ?? '작가명'}</p>
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 text-sm bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50"
          >
            {saving ? '저장 중...' : target ? '저장' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
}
