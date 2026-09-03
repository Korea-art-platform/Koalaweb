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

// 머리말은 어드민에 등록한 영문 이름을 쓴다.
//
// 예전에는 분류 코드를 그대로 썼는데, 코드는 한글 이름을 옮길 수 없을 때
// SUB_2 처럼 순번이 붙는 내부 값이라 이름을 바꿔도 머리말이 따라오지
// 않았다. 영문명을 안 넣었으면 한글 이름을 그대로 쓴다 — 코드가 그대로
// 노출되는 것보다는 낫다.
const eyebrowOf = (nameEn: string | undefined, name: string) =>
  nameEn?.trim() ? nameEn.trim().toUpperCase() : name;

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
              eyebrow={eyebrowOf(category.nameEn, category.name)}
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
