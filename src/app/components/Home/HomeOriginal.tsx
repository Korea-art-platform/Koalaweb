import { Link } from 'react-router';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useIsWide } from '@/app/hooks/useMediaQuery';
import ProductCard from '@/app/components/products/ProductCard';
import WorkRow, { WorkCell } from './WorkRow';
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
 * 넓은 화면에서는 앞의 둘을 크게, 나머지를 작게 건다. 같은 크기로 늘어놓는
 * 것보다 무엇을 먼저 보라는 말이 된다.
 *
 * 좁은 화면에서는 그 둘을 하나로 합쳐 한 줄로 민다. 큰 줄과 작은 줄을 그대로
 * 쌓으면 섹션 하나가 화면 두 개 높이가 되어, 아래 섹션까지 내려가기 전에
 * 지친다. 섹션마다 한 줄이면 엄지로 훑어 전체를 지나갈 수 있다.
 */
export default function HomeOriginal({ skus, loading, categoryCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();
  const isWide = useIsWide();

  if (!loading && skus.length === 0) return null;

  const shown = skus.slice(0, 6);
  const big = shown.slice(0, 2);
  const rest = shown.slice(2);

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
        <WorkRow columns={2}>
          {[0, 1].map((i) => (
            <WorkCell key={i} wide>
              <div className="aspect-square animate-pulse bg-gray-100" />
            </WorkCell>
          ))}
        </WorkRow>
      ) : isWide ? (
        <>
          <div className="mb-12 md:mb-20">
            <WorkRow columns={2}>
              {big.map((s) => (
                <WorkCell key={s.skuCode} wide>
                  {card(s, true)}
                </WorkCell>
              ))}
            </WorkRow>
          </div>
          {rest.length > 0 && (
            <WorkRow>
              {rest.map((s) => (
                <WorkCell key={s.skuCode}>{card(s, false)}</WorkCell>
              ))}
            </WorkRow>
          )}
        </>
      ) : (
        <WorkRow>
          {shown.map((s) => (
            <WorkCell key={s.skuCode} wide>
              {card(s, true)}
            </WorkCell>
          ))}
        </WorkRow>
      )}
    </section>
  );
}
