import { useState } from 'react';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import ProductCard from '@/app/components/products/ProductCard';
import SectionHeader from './SectionHeader';
import { toCdnUrl, toThumbUrl } from '@/app/lib/imageUrl';
import type { Sku } from '@/api/types';

interface Props {
  skus: Sku[];
  loading: boolean;
  /** 원작 대분류의 코드. 아직 카테고리를 못 불러왔으면 null 이다. */
  categoryCode: string | null;
}

// 원작 — 짙은 무대에 한 점씩 크게. 아래 작은 원작을 누르면 무대 위 작품이 바뀐다
export default function HomeOriginal({ skus, loading, categoryCode }: Props) {
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();
  const [active, setActive] = useState(0);

  if (!loading && skus.length === 0) return null;

  const shown = skus.slice(0, 6);
  const current = shown.length ? shown[Math.min(active, shown.length - 1)] : null;

  return (
    <section
      // 히어로 위로 올라오는 판의 맨 위 — 판의 둥근 윗모서리를 같이 쓴다
      className="md:rounded-t-[2.25rem]"
      style={{ background: 'radial-gradient(80% 60% at 28% 38%, rgba(90,53,128,0.45) 0%, rgba(29,18,38,0) 70%), #1D1226' }}
    >
      {/* 모바일은 한 화면에 담기게 위아래를 줄인다 */}
      <div className="mx-auto max-w-[1320px] px-5 py-9 md:px-10 md:py-24">
        <SectionHeader
          dark
          eyebrow="001 — Originals"
          title="원작"
          sub="작가의 손에서 나온 단 한 점. 다시 만들어지지 않습니다."
          viewAllHref={categoryCode ? `/store?main=${categoryCode}` : '/store'}
          viewAllLabel="원작 전체 보기"
        />

        {loading || !current ? (
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="aspect-square animate-pulse rounded-2xl bg-white/[0.06]" />
          </div>
        ) : (
          <>
            <div key={current.skuCode} className="animate-in fade-in duration-500 motion-reduce:animate-none">
              <ProductCard
                sku={current}
                variant="stage"
                viewMode="large"
                mark="원작"
                markTone="gold"
                isWishlisted={wishlistedCodes.has(current.skuCode)}
                isWishlistLoading={wishlistLoading.has(current.skuCode)}
                onWishlistClick={handleWishlist}
              />
            </div>

            {shown.length > 1 && (
              <div className="-mx-5 mt-5 flex gap-2.5 overflow-x-auto px-5 no-scrollbar md:mx-0 md:mt-14 md:gap-3 md:px-0">
                {shown.map((s, i) => (
                  <button
                    key={s.skuCode}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`${s.artistName} 작 ${s.model ?? s.name} 보기`}
                    aria-pressed={s.skuCode === current.skuCode}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F1F7] md:rounded-xl transition-opacity duration-300
                      md:h-24 md:w-24 ${s.skuCode === current.skuCode ? 'ring-2 ring-koala-gold' : 'opacity-55 hover:opacity-90'}`}
                  >
                    <img
                      src={toThumbUrl(s.primaryImageUrl) ?? '/placeholder.svg'}
                      onError={(e) => {
                        const img = e.currentTarget;
                        const full = toCdnUrl(s.primaryImageUrl);
                        if (full && img.src !== full) img.src = full;
                      }}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-contain p-2 mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
