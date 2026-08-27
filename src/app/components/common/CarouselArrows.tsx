import { useRef, useState, useEffect, useCallback, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselArrows({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 1);

    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges, children]);

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
        className="flex overflow-x-auto no-scrollbar snap-x scroll-smooth
                   pb-2 -mx-4 px-4 md:mx-0 md:px-0"
      >
        {children}
      </div>
    </div>
  );
}
