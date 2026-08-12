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

// 가로 스크롤이라 세로로 길어지지 않는다. 나머지는 '전체보기'로
const MAX_PER_SECTION = 12;

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
            <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0">
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
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
