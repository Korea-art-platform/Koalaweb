import ProductCard from '@/app/components/products/ProductCard';
import CarouselArrows from '@/app/components/common/CarouselArrows';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import SectionHeader from './SectionHeader';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
}

/** 001 — 한정판 에디션 (가로 스크롤) */
export default function HomeLimitedEdition({ skus, loading }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (!loading && skus.length === 0) return null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          eyebrow="Limited"
          title="한정판 에디션"
          sub="한정 수량으로 제작된 소장 가치 높은 작품"
          viewAllHref="/store"
        />

        {loading ? (
          <div className="flex gap-4 md:gap-6 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[260px] md:w-[300px] shrink-0 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <CarouselArrows label="한정판">
            {skus.map((sku) => (
              <div key={sku.skuCode} className="w-[260px] md:w-[300px] shrink-0 snap-start">
                <ProductCard
                  sku={sku}
                  viewMode="grid"
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={handleWishlist}
                />
              </div>
            ))}
          </CarouselArrows>
        )}
      </div>
    </section>
  );
}
