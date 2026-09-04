import { Link } from 'react-router';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import ProductCard from '@/app/components/products/ProductCard';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
  /** 원작 대분류의 코드. 아직 카테고리를 못 불러왔으면 null 이다. */
  categoryCode: string | null;
}

/**
 * 원작.
 *
 * 가로 캐러셀을 걷어내고 한 번에 펼친다. 지금 걸린 원작이 여섯 점인데
 * 캐러셀에 담으면 화살표를 눌러야 나머지가 보인다 — 몇 점 안 되는 것을
 * 숨겨 두는 셈이었다.
 *
 * 앞의 둘은 크게, 나머지는 작게 건다. 같은 크기로 늘어놓는 것보다 무엇을
 * 먼저 보라는 말이 된다.
 */
export default function HomeOriginal({ skus, loading, categoryCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (!loading && skus.length === 0) return null;

  const big = skus.slice(0, 2);
  const rest = skus.slice(2, 6);

  const card = (sku: Sku, large: boolean) => (
    <ProductCard
      key={sku.skuCode}
      sku={sku}
      mark="원작"
      variant="editorial"
      markTone="gold"
      viewMode={large ? 'large' : 'grid'}
      isWishlisted={wishlistedCodes.has(sku.skuCode)}
      isWishlistLoading={wishlistLoading.has(sku.skuCode)}
      onWishlistClick={handleWishlist}
    />
  );

  return (
    <section className="mx-auto max-w-[1320px] px-5 pt-16 md:px-10 md:pt-24">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-3 md:mb-14">
        <div>
          <h2 className="font-serif-ko text-3xl font-bold text-gray-900 md:text-[34px]">원작</h2>
          <p className="mt-2 text-sm text-gray-500 break-keep">
            작가의 손에서 나온 단 한 점. 다시 만들어지지 않습니다.
          </p>
        </div>
        <Link
          to={categoryCode ? `/store?main=${categoryCode}` : '/store'}
          className="border-b border-gray-400 pb-0.5 text-[13px] text-gray-500
            transition-colors hover:border-koala-purple hover:text-koala-purple"
        >
          원작 전체 보기
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-6 md:gap-11">
          {[0, 1].map((i) => (
            <div key={i} className="aspect-square animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : (
        <>
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mb-20 md:gap-11">
            {big.map((s) => card(s, true))}
          </div>
          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 md:gap-8">
              {rest.map((s) => card(s, false))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
