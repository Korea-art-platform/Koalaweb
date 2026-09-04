interface Props {
  /** 카드 위에 얹는 작은 칩(sm)과 상세·섹션에서 쓰는 큰 칩(md) */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 원작 뱃지.
 *
 * 사이트에서 금색을 쓰는 자리는 여기와 원작 카드 마크뿐이다. 활성 표시나
 * 찜에도 금색을 쓰던 때에는 금색이 아무 등급도 뜻하지 않았다.
 *
 * 한정판 뱃지는 보라 바탕에 흰 글씨다. 같은 보라 위에 금색 글씨와 금색
 * 테두리, 비스듬히 지나가는 광택을 더해 그보다 위라는 것을 나타낸다.
 */
export default function OriginalBadge({ size = 'sm', className = '' }: Props) {
  const pad = size === 'sm'
    ? 'px-2 py-1 text-[9px] md:text-xs gap-1'
    : 'px-2.5 py-1.5 text-xs md:text-sm gap-1.5';

  return (
    <span
      className={`relative inline-flex items-center overflow-hidden rounded-md font-bold uppercase tracking-tight
        bg-[linear-gradient(135deg,#4A2A69_0%,#3E2259_55%,#2C1740_100%)]
        text-koala-gold shadow-sm ring-1 ring-koala-gold/70 ${pad} ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_38%,rgba(239,224,196,0.28)_50%,transparent_62%)]"
      />
      <span aria-hidden className="relative block h-1 w-1 rounded-full bg-koala-gold" />
      <span className="relative">원작</span>
    </span>
  );
}
