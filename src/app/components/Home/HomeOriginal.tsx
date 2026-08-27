import ProductCard from '@/app/components/products/ProductCard';
import CarouselArrows from '@/app/components/common/CarouselArrows';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import SectionHeader from './SectionHeader';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
  /** 원작 대분류의 코드. 아직 카테고리를 못 불러왔으면 null 이다. */
  categoryCode: string | null;
}

export default function HomeOriginal({ skus, loading, categoryCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (!loading && skus.length === 0) return null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          eyebrow="000 — Original"
          title="원작"
          sub="작가의 손에서 하나만 나온 유일한 작품"
          viewAllHref={categoryCode ? `/store?main=${categoryCode}` : '/store'}
        />

        {loading ? (
          <div className="flex overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-[260px] md:w-[300px] shrink-0 animate-pulse">
                <div className="aspect-[3/4] bg-gray-100" />
              </div>
            ))}
          </div>
        ) : (
          <CarouselArrows label="원작">
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
