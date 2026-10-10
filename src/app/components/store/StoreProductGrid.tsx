import ProductCard from '@/app/components/products/ProductCard';
import { useIsDesktop, useIsWide } from '@/app/hooks/useMediaQuery';
import type { Sku } from '@/api/types';
import { useTranslation } from 'react-i18next';

/** 불러오는 동안 칸 높이 — 사진 비율을 모르니 몇 가지로 엇갈려 둔다 */
const SKELETON_HEIGHTS = ['h-64', 'h-80', 'h-56', 'h-72', 'h-60', 'h-80', 'h-64', 'h-56'];

interface StoreProductGridProps {
  loading: boolean;
  skus: Sku[];
  total: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  onReset: () => void;
  wishlistedCodes: Set<string>;
  wishlistLoading: Set<string>;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

// 사진을 제 비율대로 엇갈려 쌓는다. PC 4줄 · 태블릿 3줄 · 모바일 2줄. 끝에 "더 보기"
export default function StoreProductGrid({
  loading, skus, total, hasMore, loadingMore, onLoadMore,
  onReset, wishlistedCodes, wishlistLoading, onWishlistClick,
}: StoreProductGridProps) {
  const { t } = useTranslation();
  const isDesktop = useIsDesktop();
  const isWide = useIsWide();
  const columns = isDesktop ? 4 : isWide ? 3 : 2;

  if (loading) {
    return (
      <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10">
        <Columns columns={columns} items={SKELETON_HEIGHTS} render={(h, i) => (
          <div key={i} className="animate-pulse">
            <div className={`${h} bg-gray-100`} />
            <div className="mt-3 h-4 w-1/2 rounded-none bg-gray-100" />
            <div className="mt-2 h-3 w-3/4 rounded-none bg-gray-100" />
          </div>
        )} />
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10">
        <div className="border border-dashed border-gray-200 bg-[#F7F5FA] px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-gray-900">{t('store.grid.emptyTitle')}</h2>
          <p className="mt-2 text-sm text-gray-500 break-keep">{t('store.grid.emptyBody')}</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:border-gray-300"
          >
            {t('store.grid.clearAll')}
          </button>
        </div>
      </section>
    );
  }

  const card = (sku: Sku) => (
    <ProductCard
      key={sku.skuCode}
      sku={sku}
      variant="gallery"
      viewMode="grid"
      isWishlisted={wishlistedCodes.has(sku.skuCode)}
      isWishlistLoading={wishlistLoading.has(sku.skuCode)}
      onWishlistClick={onWishlistClick}
    />
  );

  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10 md:pt-10">
      <Columns columns={columns} items={skus} render={card} />

      <div className="mt-14 flex flex-col items-center gap-3">
        <div className="relative h-0.5 w-44 bg-gray-200" aria-hidden>
          <div className="absolute inset-y-0 left-0 bg-koala-purple" style={{ width: `${total ? (skus.length / total) * 100 : 0}%` }} />
        </div>
        <p className="text-[13px] tabular-nums text-gray-400">{t('store.grid.progress', { total, shown: skus.length })}</p>
        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="mt-1 rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition-colors
              hover:border-gray-300 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-koala-purple"
          >
            {loadingMore ? t('store.grid.loading') : t('store.grid.more')}
          </button>
        )}
      </div>
    </section>
  );
}

// 줄마다 차례로 나눠 담는다 — CSS columns 는 위에서 아래로 채워 추천 순서가 뒤틀린다.
// "더 보기"로 늘어나도 이미 있던 작품 자리는 그대로다.
function Columns<T>({ columns, items, render }: { columns: number; items: T[]; render: (item: T, index: number) => React.ReactNode }) {
  const cols: { item: T; index: number }[][] = Array.from({ length: columns }, () => []);
  items.forEach((item, index) => cols[index % columns].push({ item, index }));
  return (
    <div className="flex items-start gap-3 md:gap-6">
      {cols.map((col, c) => (
        <div key={c} className="flex min-w-0 flex-1 flex-col gap-8 md:gap-12">
          {col.map(({ item, index }) => render(item, index))}
        </div>
      ))}
    </div>
  );
}
