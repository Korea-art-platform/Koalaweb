import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

export interface WorkItem {
  id: string;
  title: string;
  imageUrl: string;
  price?: number;
}

interface ArtistWorksCarouselProps {
  works?: WorkItem[];
  artistId?: string;
}

export function ArtistWorksCarousel({ works, artistId }: ArtistWorksCarouselProps) {
  if (!works || works.length === 0) return null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    el?.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);
    return () => {
      el?.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [works]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
  };

  const allWorksUrl = artistId ? `/artist/${artistId}/works` : '#';

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">작가의 작품 - Works</h3>
        <Link
          to={allWorksUrl}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-black transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          <span className="text-xs">전체보기</span>
        </Link>
      </div>
      <div className="relative">

        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {works.map((work) => (
            <Link
              key={work.id}
              to={`/product/${work.id}`}
              className="flex-shrink-0 w-52 group"
            >
              <div className="w-full aspect-[4/5] bg-gray-100 overflow-hidden mb-2">
                <ImageWithFallback
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-sm font-medium truncate">{work.title}</p>
              {work.price != null && (
                <p className="text-sm text-gray-400">{work.price.toLocaleString()}원</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
