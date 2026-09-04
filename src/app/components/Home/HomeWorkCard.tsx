import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { displayPrice, formatWon } from '@/app/lib/price';
import type { Sku } from '@/api/types';

interface Props {
  sku: Sku;
  /** 등급 표시. 원작은 금색, 에디션은 퍼플. */
  mark: string;
  tone: 'gold' | 'purple';
  /** 크게 거는 자리. 정사각으로 보여 준다. */
  large?: boolean;
  isWishlisted: boolean;
  isWishlistLoading: boolean;
  /** 카드 전체가 링크라 이벤트를 받아 기본 이동을 막는다. */
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

/**
 * 홈의 작품 카드.
 *
 * 스토어의 ProductCard 와 따로 둔다. 그쪽은 목록을 훑는 자리라 뱃지·평점·
 * 담기까지 얹혀 있는데, 홈은 몇 점을 골라 거는 자리라 작품 이름과 작가만
 * 남기는 편이 낫다. 하나로 합치면 한쪽을 고칠 때마다 다른 쪽이 흔들린다.
 */
export default function HomeWorkCard({
  sku, mark, tone, large = false,
  isWishlisted, isWishlistLoading, onWishlistClick,
}: Props) {
  const detail = `/product/${sku.skuCode}`;

  return (
    <figure className="group m-0">
      <Link to={detail} className="block">
        <div className={`relative overflow-hidden bg-gray-100 ${large ? 'aspect-square' : 'aspect-[4/5]'}`}>
          <ImageWithFallback
            src={sku.primaryImageUrl ?? '/placeholder.svg'}
            alt={`${sku.artistName} 작 ${sku.model ?? sku.name}`}
            thumb={!large}
            className="h-full w-full object-cover transition-transform duration-700
              group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        </div>
      </Link>

      <figcaption className="relative mt-4">
        <span
          className={`mb-2.5 inline-block px-2 py-0.5 text-[10.5px] font-medium tracking-[0.08em] ${
            tone === 'gold'
              ? 'text-koala-gold-deep ring-1 ring-koala-gold/45'
              : 'bg-koala-purple/8 text-koala-purple'
          }`}
        >
          {mark}
        </span>

        <h3 className="font-serif-ko text-[17px] font-bold text-gray-900 md:text-[19px]">
          <Link to={detail} className="hover:text-koala-purple transition-colors">
            {sku.model ?? sku.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-[13px] text-gray-400">{sku.artistName}</p>
        <p className="mt-2 text-[15px] font-medium tabular-nums text-gray-900 md:text-base">
          {formatWon(displayPrice(sku))}
          <span className="ml-0.5 text-[12.5px] font-normal text-gray-400">원</span>
        </p>

        {/* 찜은 사진 위가 아니라 이름 옆에 둔다. 사진을 가리지 않는다. */}
        <button
          onClick={(e) => onWishlistClick(e, sku.skuCode)}
          disabled={isWishlistLoading}
          aria-label={isWishlisted ? `${sku.name} 찜 해제` : `${sku.name} 찜하기`}
          aria-pressed={isWishlisted}
          className="absolute right-0 top-6 p-1.5 text-gray-300 transition-colors
            hover:text-koala-purple disabled:opacity-40
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-koala-purple"
        >
          <Heart
            className={`h-[18px] w-[18px] ${isWishlisted ? 'fill-koala-purple text-koala-purple' : ''}`}
          />
        </button>
      </figcaption>
    </figure>
  );
}
