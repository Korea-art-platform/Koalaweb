import { Link } from 'react-router';
import ProductCard from '@/app/components/products/ProductCard';
import WorkRow, { WorkCell } from './WorkRow';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import type { Category } from '@/api/category';
import type { Sku } from '@/api/types';

interface Props {
  categories: Category[];
  skus: Sku[];
}

const MAX_PER_SECTION = 8;

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
        <section key={category.id} className="mx-auto max-w-[1320px] px-5 pt-16 md:px-10 md:pt-24">
          <div>
            <div className="mb-10 flex flex-wrap items-end justify-between gap-3 md:mb-12">
              <div>
                <span className="text-[11px] font-medium tracking-[0.2em] text-koala-purple-light">
                  {eyebrowOf(category.nameEn, category.name)}
                </span>
                <h2 className="font-serif-ko mt-2 text-3xl font-bold text-gray-900 md:text-[34px]">
                  {category.name}
                </h2>
                <p className="mt-1.5 text-sm text-gray-500">{items.length}점의 작품</p>
              </div>
              <Link
                to={`/store?category=${category.code}`}
                className="border-b border-gray-400 pb-0.5 text-[13px] text-gray-500
                  transition-colors hover:border-koala-purple hover:text-koala-purple"
              >
                전체 보기
              </Link>
            </div>

            {/* 캐러셀을 걷어내고 펼친다. 한 분류에 한두 점뿐인 것도 있어
                화살표를 두면 눌러도 넘어가지 않는 헛버튼이 된다. */}
            <WorkRow>
              {items.slice(0, MAX_PER_SECTION).map((sku) => (
                <WorkCell key={sku.skuCode}>
                <ProductCard
                  key={sku.skuCode}
                  sku={sku}
                  viewMode="grid"
                  variant="editorial"
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={handleWishlist}
                />
                </WorkCell>
              ))}
            </WorkRow>
          </div>
        </section>
      ))}
    </>
  );
}
