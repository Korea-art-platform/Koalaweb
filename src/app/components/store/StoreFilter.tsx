import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/app/hooks/useCategories';
import { useOriginalCategoryCode } from '@/app/hooks/useOriginalCategory';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Artist } from '@/api/types';
import type { SkuOrder } from '@/api/sku';
import { ALL, ORDERS, PRICE_BANDS } from './storeOptions';

interface StoreFilterProps {
  artists: Artist[];
  selectedArtist: string;
  onSelectArtist: (code: string) => void;
  /** 대분류 코드들. 맨 앞은 'All' 이다 */
  mainCategories: string[];
  mainCounts: Record<string, number>;
  selectedMain: string;
  onSelectMain: (code: string) => void;
  /** 소분류 코드들. 맨 앞은 'All' 이다 */
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (code: string) => void;
  priceBand: string;
  onSelectPrice: (key: string) => void;
  order: SkuOrder;
  onSelectOrder: (order: SkuOrder) => void;
  /** 모바일 — 거르기 창 열기와 그 안에 걸린 조건 수 */
  onOpenSheet: () => void;
  sheetCount: number;
}

// 작가 얼굴 줄 + 헤더 아래 붙는 거르기 줄(에디션 탭 · 분류 · 가격대 · 정렬)
export default function StoreFilter(props: StoreFilterProps) {
  const {
    artists, selectedArtist, onSelectArtist,
    mainCategories, mainCounts, selectedMain, onSelectMain,
    categories, selectedCategory, onSelectCategory,
    priceBand, onSelectPrice, order, onSelectOrder, onOpenSheet, sheetCount,
  } = props;
  const { t } = useTranslation();
  const { subLabel, mainLabel } = useCategories();
  const originalCode = useOriginalCategoryCode();
  const isDesktop = useIsDesktop();
  const allLabel = t('store.categories.All') as string;

  return (
    <>
      {/* 작가로 고르기 — 좁은 화면은 옆으로 민다 */}
      {artists.length > 0 && (
        <div
          role="group"
          aria-label="작가로 고르기"
          className="mx-auto flex max-w-[1320px] snap-x gap-4 overflow-x-auto scroll-px-5 px-5 pb-6 no-scrollbar md:gap-6 md:px-10 md:pb-8"
        >
          <ArtistButton label={allLabel} active={selectedArtist === ALL} onClick={() => onSelectArtist(ALL)} />
          {artists.map((a) => (
            <ArtistButton
              key={a.artistCode}
              label={a.name}
              image={a.profileImageUrl}
              active={selectedArtist === a.artistCode}
              onClick={() => onSelectArtist(selectedArtist === a.artistCode ? ALL : a.artistCode)}
            />
          ))}
        </div>
      )}

      {/* 내리면 헤더 아래에 붙어 따라온다 */}
      <div className="sticky top-20 z-30 border-y border-gray-200 bg-[#FBFAFC]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-5 py-2.5 md:px-10 lg:gap-5 lg:py-3.5">
          {/* 에디션 탭 — 원작만 금색 글씨 */}
          <div role="tablist" aria-label="에디션" className="flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-full bg-gray-100 p-1 no-scrollbar lg:flex-none">
            {mainCategories.map((code) => {
              const active = selectedMain === code;
              const gold = code === originalCode;
              return (
                <button
                  key={code}
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectMain(code)}
                  className={`relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs transition-colors duration-200 md:px-4 md:text-[13px]
                    focus-visible:outline-2 focus-visible:outline-koala-purple
                    ${active ? (gold ? 'font-bold text-[#876A32]' : 'font-bold text-koala-purple') : 'font-medium text-gray-500 hover:text-gray-900'}`}
                >
                  {active && (
                    <motion.span
                      layoutId="store-edition-tab"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(62,34,89,0.12)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">
                    {code === ALL ? allLabel : mainLabel(code)}
                    {isDesktop && mainCounts[code] != null && (
                      <span className="ml-1 font-normal tabular-nums text-gray-400">{mainCounts[code]}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {isDesktop ? (
            <>
              <div role="group" aria-label="분류" className="flex min-w-0 flex-1 flex-wrap gap-2">
                {categories.map((code) => {
                  const active = selectedCategory === code;
                  return (
                    <button
                      key={code}
                      onClick={() => onSelectCategory(code)}
                      aria-pressed={active}
                      className={`rounded-full border bg-white px-3.5 py-1.5 text-[13px] transition-colors
                        focus-visible:outline-2 focus-visible:outline-koala-purple
                        ${active ? 'border-koala-purple font-semibold text-koala-purple' : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900'}`}
                    >
                      {code === ALL ? allLabel : subLabel(code)}
                    </button>
                  );
                })}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <SelectBox
                  label="가격대"
                  value={priceBand}
                  onChange={onSelectPrice}
                  options={[{ key: ALL, label: '가격대 전체' }, ...PRICE_BANDS]}
                />
                <SelectBox
                  label="정렬"
                  value={order}
                  onChange={(v) => onSelectOrder(v as SkuOrder)}
                  options={ORDERS}
                />
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenSheet}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900
                focus-visible:outline-2 focus-visible:outline-koala-purple"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              거르기
              {sheetCount > 0 && (
                <span className="rounded-full bg-koala-purple px-1.5 text-[10px] tabular-nums text-white">{sheetCount}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function ArtistButton({ label, image, active, onClick }: { label: string; image?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex w-[60px] shrink-0 snap-start flex-col items-center gap-1.5 text-center md:w-[68px] focus-visible:outline-none"
    >
      {/* 고른 테는 원 안쪽에 그린다 — 바깥으로 그리면 옆으로 미는 줄이 위아래를 잘라 먹는다 */}
      <span
        className={`relative block aspect-square w-full rounded-full border-2 transition-colors duration-300
          group-focus-visible:border-koala-purple/60
          ${active ? 'border-koala-purple' : 'border-transparent'}`}
      >
        {/* 안쪽 원을 띄워 두어야 사진 크기가 원 크기를 밀어내지 않는다 */}
        <span className="absolute inset-[3px] overflow-hidden rounded-full border border-gray-200 bg-gray-100">
          {image ? (
            <ImageWithFallback
              thumb
              src={image}
              alt=""
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <img src="/logo-symbol.svg" alt="" className="h-1/2 w-1/2 opacity-60" />
            </span>
          )}
        </span>
      </span>
      <span className={`text-xs break-keep md:text-[13px] ${active ? 'font-bold text-koala-purple' : 'text-gray-500'}`}>{label}</span>
    </button>
  );
}

function SelectBox({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { key: string; label: string }[];
}) {
  return (
    <label className="relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-[10px] border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-[13px] text-gray-900
          focus-visible:outline-2 focus-visible:outline-koala-purple"
      >
        {options.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
      </select>
      <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">▼</span>
    </label>
  );
}
