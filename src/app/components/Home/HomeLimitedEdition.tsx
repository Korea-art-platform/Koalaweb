import { Link } from 'react-router';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import ProductCard from '@/app/components/products/ProductCard';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
  /** 한정판 대분류 코드. 이 값이면 "한정판", 아니면 "오픈에디션"으로 표시한다. */
  limitedCode: string;
}

/**
 * 한정판 · 오픈에디션.
 *
 * 원작이 아닌 것을 한자리에 모은다. 예전에는 한정판만 따로 걸고 오픈에디션은
 * 소분류 섹션에 흩어져 있어, 여덟 점이 어디에 있는지 보이지 않았다.
 *
 * 바탕을 한 단계 눌러 원작 구간과 층을 나눈다. 등급이 다르다는 것을 색과
 * 바탕으로 먼저 알려 준다.
 */
export default function HomeLimitedEdition({ skus, loading, limitedCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (!loading && skus.length === 0) return null;

  return (
    <section className="mt-16 border-y border-gray-100 bg-[#F7F5FA] md:mt-24">
      <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3 md:mb-14">
          <div>
            <h2 className="font-serif-ko text-3xl font-bold text-gray-900 md:text-[34px]">
              한정판 · 오픈에디션
            </h2>
            <p className="mt-2 text-sm text-gray-500 break-keep">
              같은 작가의 작업을 조금 더 가까이.
            </p>
          </div>
          <Link
            to="/store"
            className="border-b border-gray-400 pb-0.5 text-[13px] text-gray-500
              transition-colors hover:border-koala-purple hover:text-koala-purple"
          >
            전체 보기
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-gray-200/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
            {skus.slice(0, 8).map((sku) => (
              <ProductCard
                key={sku.skuCode}
                sku={sku}
                mark={sku.mainCategory === limitedCode ? '한정판' : '오픈에디션'}
                variant="editorial"
                markTone="purple"
                viewMode="large"
                isWishlisted={wishlistedCodes.has(sku.skuCode)}
                isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                onWishlistClick={handleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
