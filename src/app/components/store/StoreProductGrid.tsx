import { Fragment } from 'react';
import ProductCard from '@/app/components/products/ProductCard';
import StoreArtistSpotlight from './StoreArtistSpotlight';
import type { Artist, Sku } from '@/api/types';

/** 작가 조명을 끼울 자리 — 여덟 점 뒤. 작품이 그보다 적으면 맨 끝 */
const SPOT_AFTER = 8;

interface StoreProductGridProps {
  loading: boolean;
  skus: Sku[];
  total: number;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
  /** 첫 칸을 크게 걸지 — 추천순이고 첫 작품이 원작일 때만 */
  featureFirst: boolean;
  artists: Artist[];
  onPickArtist: (code: string) => void;
  onReset: () => void;
  wishlistedCodes: Set<string>;
  wishlistLoading: Set<string>;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

// PC 4열 · 모바일 2열. 첫 원작은 크게, 여덟 점 뒤에 작가 조명, 끝에 "더 보기"
export default function StoreProductGrid({
  loading, skus, total, hasMore, loadingMore, onLoadMore, featureFirst,
  artists, onPickArtist, onReset, wishlistedCodes, wishlistLoading, onWishlistClick,
}: StoreProductGridProps) {
  if (loading) {
    return (
      <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10">
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-gray-100" />
              <div className="mt-3 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10">
        <div className="border border-dashed border-gray-200 bg-[#F7F5FA] px-6 py-16 text-center">
          <h2 className="text-lg font-bold text-gray-900">이 조건에 맞는 작품이 없습니다</h2>
          <p className="mt-2 text-sm text-gray-500 break-keep">가격대나 분류를 넓히면 더 많은 작품을 볼 수 있습니다.</p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:border-gray-300"
          >
            조건 모두 풀기
          </button>
        </div>
      </section>
    );
  }

  const spotAt = Math.min(SPOT_AFTER, skus.length);
  const spotlight = artists.length > 0 && (
    <StoreArtistSpotlight artists={artists} skus={skus} onPickArtist={onPickArtist} />
  );

  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-8 pb-24 md:px-10 md:pt-10">
      <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-5 md:gap-y-10 lg:grid-cols-4">
        {skus.map((sku, i) => {
          const feature = featureFirst && i === 0;
          return (
            <Fragment key={sku.skuCode}>
              <div className={feature ? 'col-span-2 lg:row-span-2' : ''}>
                <ProductCard
                  sku={sku}
                  variant="gallery"
                  viewMode="grid"
                  feature={feature}
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={onWishlistClick}
                />
              </div>
              {i + 1 === spotAt && spotlight}
            </Fragment>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-center gap-3">
        <div className="relative h-0.5 w-44 bg-gray-200" aria-hidden>
          <div className="absolute inset-y-0 left-0 bg-koala-purple" style={{ width: `${total ? (skus.length / total) * 100 : 0}%` }} />
        </div>
        <p className="text-[13px] tabular-nums text-gray-400">{total}점 중 {skus.length}점을 봤습니다</p>
        {hasMore && (
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="mt-1 rounded-xl border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-900 transition-colors
              hover:border-gray-300 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-koala-purple"
          >
            {loadingMore ? '불러오는 중' : '작품 더 보기'}
          </button>
        )}
      </div>
    </section>
  );
}
