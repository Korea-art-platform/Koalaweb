interface Props {
  /** 카드 위에 얹는 작은 칩(sm)과 상세·섹션에서 쓰는 큰 칩(md) */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 원작 뱃지.
 *
 * 한정판 뱃지가 금색 바탕에 보라 글씨라, 그보다 위라는 걸 색을 더 쓰지 않고
 * 뒤집어서 나타낸다 — 보라 바탕에 금색 글씨. 금색 실선 테두리와 위에서
 * 비스듬히 지나가는 옅은 광택으로 금속의 느낌만 얹었다.
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
