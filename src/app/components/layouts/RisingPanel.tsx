interface Props {
  children: React.ReactNode;
  className?: string;
}

/**
 * 히어로 위로 올라와 덮는 판.
 *
 * 스크롤을 내릴 때 히어로가 밀려 올라가는 게 아니라, 아래 내용이 한 장의 판처럼
 * 올라와 히어로를 가린다. 히어로는 StickyHero 로 제자리에 붙여 둔다.
 *
 * data-hero-cover 는 헤더가 읽는다. 히어로가 붙어 있으면 화면에서 사라지지 않아
 * "히어로가 보이는가"로는 지나쳤는지 알 수 없다. 이 판의 윗변이 헤더에 닿은
 * 순간이 곧 히어로가 끝난 순간이다.
 */
export function RisingPanel({ children, className = '' }: Props) {
  return (
    <div
      data-hero-cover
      className={`relative z-10 bg-white rounded-t-[1.5rem] md:rounded-t-[2.25rem] shadow-[0_-20px_50px_-20px_rgba(13,9,18,0.55)] ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * 제자리에 붙어 있는 히어로.
 *
 * sticky 는 부모 높이 안에서만 붙는다. 히어로를 딱 맞는 상자로 감싸면 붙을
 * 여유가 0 이라 아예 붙지 않으니, 이 컴포넌트는 페이지 전체를 부모로 삼는
 * 자리에 그대로 놓아야 한다 — 중간에 다른 상자로 또 감싸면 동작하지 않는다.
 */
export function StickyHero({ children }: Props) {
  return <div className="sticky top-0 z-0">{children}</div>;
}
