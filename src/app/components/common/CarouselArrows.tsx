import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * 가로 스크롤 목록에 좌우 화살표를 얹는다.
 *
 * 모바일은 손가락으로 밀면 되지만 데스크탑에서는 밀 방법이 마땅치 않다.
 * 마우스 휠은 세로로만 움직이고, 스크롤바는 숨겨 두었다.
 *
 * 반투명 유리 느낌으로 얹어 작품 위에 올라와도 사진을 가리지 않게 한다.
 */
export default function CarouselArrows({
  label,
  children,
  className = '',
}: {
  /** 스크린리더용 — 섹션이 여러 개라 "이전"만으로는 어느 것인지 알 수 없다 */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  /** 양끝에 닿으면 그쪽 화살표를 숨긴다 — 눌러도 안 움직이는 버튼은 고장으로 보인다 */
  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);
    // 소수점 오차로 끝에 닿아도 1px 쯤 남는다
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges, children]);

  /** 카드 한 장 너비만큼 민다 — 화면 폭이 달라도 자연스럽게 맞는다 */
  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = 24;
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: 'smooth' });
  };

  const arrow =
    'absolute top-1/2 -translate-y-1/2 z-20 hidden md:flex w-11 h-11 items-center justify-center '
    + 'rounded-full bg-black/35 backdrop-blur-md text-white border border-white/25 '
    + 'hover:bg-black/55 hover:scale-105 active:scale-95 '
    + 'transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none';

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => scrollByCard(-1)}
        disabled={atStart}
        aria-label={`${label} 이전`}
        className={`${arrow} left-2`}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => scrollByCard(1)}
        disabled={atEnd}
        aria-label={`${label} 다음`}
        className={`${arrow} right-2`}
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div
        ref={trackRef}
        onScroll={syncEdges}
        className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x scroll-smooth
                   pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {children}
      </div>
    </div>
  );
}
