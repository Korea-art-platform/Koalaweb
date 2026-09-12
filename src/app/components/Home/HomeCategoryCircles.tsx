import { useState } from 'react';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useCategoryTint } from '@/app/hooks/useCategoryTint';
import ProductCard from '@/app/components/products/ProductCard';
import SectionHeader from './SectionHeader';
import WorkRow, { WorkCell } from './WorkRow';
import { toCdnUrl, toThumbUrl } from '@/app/lib/imageUrl';
import type { Category } from '@/api/category';
import type { Sku } from '@/api/types';

interface Props {
  categories: Category[];
  skus: Sku[];
  genreCounts: Record<string, number>;
  /** 원작 대분류 코드. 카드 표시(원작·한정판·오픈에디션)를 가른다 */
  originalCode: string | null;
  limitedCode: string;
}

// 분류 + 전체 작품 — 분류 원을 누르면 그 분류 작품만 아래에 나열한다
export default function HomeCategoryCircles({ categories, skus, genreCounts, originalCode, limitedCode }: Props) {
  const tintOf = useCategoryTint();
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();
  const [selected, setSelected] = useState<string | null>(null);

  if (skus.length === 0) return null;

  // 분류마다 첫 작품을 원에 건다
  const circles = categories
    .map((category) => ({
      category,
      cover: skus.find((s) => s.genre === category.code),
      count: genreCounts[category.code] ?? skus.filter((s) => s.genre === category.code).length,
    }))
    .filter((c): c is { category: Category; cover: Sku; count: number } => Boolean(c.cover));

  const works = selected ? skus.filter((s) => s.genre === selected) : skus;
  const selectedName = categories.find((c) => c.code === selected)?.name;

  const markOf = (sku: Sku) => {
    if (originalCode && sku.mainCategory === originalCode) return { mark: '원작', tone: 'gold' as const };
    return { mark: sku.mainCategory === limitedCode ? '한정판' : '오픈에디션', tone: 'purple' as const };
  };

  return (
    <section className="mx-auto max-w-[1320px] px-5 py-16 md:px-10 md:py-24">
      <SectionHeader
        eyebrow="003 — All Works"
        title="전체 작품"
        sub="분류를 누르면 그 분류 작품만 모아 봅니다"
        viewAllHref={selected ? `/store?category=${selected}` : '/store'}
        viewAllLabel={selectedName ? `${selectedName} 스토어에서 보기` : '스토어에서 보기'}
      />

      {/* 분류 원 — 좁은 화면은 옆으로 민다 */}
      <div
        role="group"
        aria-label="분류 고르기"
        className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 py-1 no-scrollbar
          md:mx-0 md:gap-8 md:px-0 ${circles.length <= 5 ? 'lg:justify-center lg:gap-12' : ''}`}
      >
        <CircleButton
          label="전체"
          count={skus.length}
          active={!selected}
          tint="#ECE8F4"
          onClick={() => setSelected(null)}
        />
        {circles.map(({ category, cover, count }) => (
          <CircleButton
            key={category.id}
            label={category.name}
            count={count}
            image={cover.primaryImageUrl}
            active={selected === category.code}
            tint={tintOf(category.code)}
            onClick={() => setSelected(selected === category.code ? null : category.code)}
          />
        ))}
      </div>

      {/* 고른 분류 작품 — 바뀔 때 한 번 번지게 */}
      <div key={selected ?? 'all'} className="mt-10 animate-in fade-in duration-500 motion-reduce:animate-none md:mt-14">
        <WorkRow>
          {works.map((sku) => {
            const { mark, tone } = markOf(sku);
            return (
              <WorkCell key={sku.skuCode}>
                <ProductCard
                  sku={sku}
                  variant="shop"
                  viewMode="grid"
                  mark={mark}
                  markTone={tone}
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={handleWishlist}
                />
              </WorkCell>
            );
          })}
        </WorkRow>
      </div>
    </section>
  );
}

interface CircleButtonProps {
  label: string;
  count: number;
  active: boolean;
  tint: string;
  image?: string;
  onClick: () => void;
}

// 바깥 테는 분류 색, 안은 작품 사진. 고른 분류는 보라 테
function CircleButton({ label, count, active, tint, image, onClick }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="group flex w-[72px] shrink-0 snap-start flex-col items-center text-center md:w-[108px]
        focus-visible:outline-none"
    >
      {/* 안쪽 원을 띄워 두어야 사진 크기가 원 크기를 밀어내지 않는다 */}
      <span
        className={`relative block aspect-square w-full rounded-full transition-transform duration-300 group-hover:scale-[1.03]
          group-focus-visible:ring-2 group-focus-visible:ring-koala-purple motion-reduce:transition-none
          ${active ? 'ring-2 ring-koala-purple ring-offset-2' : ''}`}
        style={{ backgroundColor: tint }}
      >
        <span className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-full bg-white md:inset-1.5">
          {image ? (
            <img
              src={toThumbUrl(image) ?? '/placeholder.svg'}
              onError={(e) => {
                const img = e.currentTarget;
                const full = toCdnUrl(image);
                if (full && img.src !== full) img.src = full;
              }}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105
                motion-reduce:transition-none"
            />
          ) : (
            <img src="/logo-symbol.svg" alt="" className="h-1/2 w-1/2 opacity-70" />
          )}
        </span>
      </span>
      <span className={`mt-2.5 text-[13px] font-bold break-keep md:text-sm ${active ? 'text-koala-purple' : 'text-gray-900'}`}>
        {label}
      </span>
      <span className="mt-0.5 text-xs text-gray-400">{count}점</span>
    </button>
  );
}
