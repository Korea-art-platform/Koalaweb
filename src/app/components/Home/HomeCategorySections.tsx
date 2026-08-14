import ProductCard from '@/app/components/products/ProductCard';
import CarouselArrows from '@/app/components/common/CarouselArrows';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import SectionHeader from './SectionHeader';
import type { Category } from '@/api/category';
import type { Sku } from '@/api/types';

interface Props {
  categories: Category[];
  skus: Sku[];
}

const MAX_PER_SECTION = 12;

export default function HomeCategorySections({ categories, skus }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  const sections = categories
    .map((category) => ({
      category,
      items: skus.filter((s) => s.genre === category.code),
    }))
    .filter((s) => s.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <>
      {sections.map(({ category, items }) => (
        <section key={category.id} className="px-4 md:px-12 pt-12 md:pt-24">
          <div className="max-w-[1800px] mx-auto">
            <SectionHeader
              eyebrow={category.code.replace(/_/g, ' ')}
              title={category.name}
              sub={`${items.length}점의 작품`}
              viewAllHref={`/store?category=${category.code}`}
            />
            <CarouselArrows label={category.name}>
              {items.slice(0, MAX_PER_SECTION).map((sku) => (
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
          </div>
        </section>
      ))}
    </>
  );
}
