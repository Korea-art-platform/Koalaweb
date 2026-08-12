import ProductCard from '@/app/components/products/ProductCard';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import SectionHeader from './SectionHeader';
import type { Category } from '@/api/category';
import type { Sku } from '@/api/types';

interface Props {
  /** 활성 소분류 — 이미 sortOrder 순으로 내려온다 */
  categories: Category[];
  skus: Sku[];
}

/** 한 섹션에 너무 많이 깔리지 않도록 자른다. 나머지는 '전체보기'로 */
const MAX_PER_SECTION = 8;

/**
 * 소분류 카테고리별 상품 섹션.
 *
 * 카테고리는 관리자가 계속 추가하므로 섹션도 고정하지 않는다.
 * <b>상품이 하나도 없는 카테고리는 건너뛴다</b> — 빈 섹션이 늘어서면
 * 상품이 없는 것처럼 보인다.
 */
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {items.slice(0, MAX_PER_SECTION).map((sku) => (
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
      ))}
    </>
  );
}
