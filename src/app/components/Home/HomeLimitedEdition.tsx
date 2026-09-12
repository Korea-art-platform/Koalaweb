import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import ProductCard from '@/app/components/products/ProductCard';
import SectionHeader from './SectionHeader';
import WorkRow, { WorkCell } from './WorkRow';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
  /** 한정판 대분류 코드. 이 값이면 "한정판", 아니면 "오픈에디션"으로 표시한다. */
  limitedCode: string;
}

// 한정판 · 오픈에디션 — 둥근 카드로 나열. 누르면 상세 팝업
export default function HomeLimitedEdition({ skus, loading, limitedCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (!loading && skus.length === 0) return null;

  return (
    <section className="border-b border-gray-100 bg-[#F7F5FA]">
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
        <SectionHeader
          eyebrow="002 — Editions"
          title="한정판 · 오픈에디션"
          sub="같은 작가의 작업을 조금 더 가까이"
          viewAllHref="/store"
        />

        {loading ? (
          <WorkRow>
            {[...Array(4)].map((_, i) => (
              <WorkCell key={i}>
                <div className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-200/60" />
              </WorkCell>
            ))}
          </WorkRow>
        ) : (
          <WorkRow>
            {skus.slice(0, 8).map((sku) => (
              <WorkCell key={sku.skuCode}>
                <ProductCard
                  sku={sku}
                  variant="shop"
                  viewMode="grid"
                  mark={sku.mainCategory === limitedCode ? '한정판' : '오픈에디션'}
                  markTone="purple"
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={handleWishlist}
                />
              </WorkCell>
            ))}
          </WorkRow>
        )}
      </div>
    </section>
  );
}
