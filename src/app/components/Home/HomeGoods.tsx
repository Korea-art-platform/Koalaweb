import ProductCard from '@/app/components/products/ProductCard';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import SectionHeader from './SectionHeader';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
}

/** 003 — 아트 굿즈 (그리드). 굿즈가 없으면 섹션 자체를 숨긴다. */
export default function HomeGoods({ skus }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (skus.length === 0) return null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          num="003"
          eyebrow="Goods"
          title="아트 굿즈"
          sub="일상 속에서 함께하는 예술"
          viewAllHref="/store"
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {skus.map((sku) => (
            <ProductCard
              key={sku.skuCode}
              sku={sku}
              viewMode="grid"
              isWishlisted={wishlistedCodes.has(sku.skuCode)}
              isWishlistLoading={wishlistLoading.has(sku.skuCode)}
              onWishlistClick={handleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
