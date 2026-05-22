import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Banner } from '@/api/types';

interface HomeHeroProps {
  banners: Banner[];
}

export default function HomeHero({ banners }: HomeHeroProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  // 터치 스와이프
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const total = banners.length;

  // 자동 슬라이드 (5초 간격)
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(id);
  }, [total]);

  function goToIndex(index: number) {
    if (index === current || animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
  }

  function goPrev() {
    goToIndex((current - 1 + total) % total);
  }

  function goNext() {
    goToIndex((current + 1) % total);
  }

  // 터치 핸들러
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }

  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
  }

  function handleTouchEnd() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) >= SWIPE_THRESHOLD) {
      diff > 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  const banner = banners[current] ?? null;

  return (
    <section
      data-hero="dark"
      className="relative h-[55vh] min-h-[420px] md:h-[85vh] overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 배너 이미지 레이어 (페이드 전환) */}
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img
            src={b.imageUrl}
            alt={b.title ?? 'Banner'}
            className="w-full h-full object-cover object-top md:object-center"
          />
        </div>
      ))}

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      {/* 텍스트 콘텐츠 */}
      <div className="relative h-full flex items-center px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto w-full">
          <div
            className="max-w-2xl text-white transition-opacity duration-500"
            style={{ opacity: animating ? 0.6 : 1 }}
          >
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] md:text-xs tracking-widest uppercase rounded-full mb-4 md:mb-6 border border-white/20">
              {t('home.hero.badge')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-7xl mb-4 md:mb-6 font-bold tracking-tighter leading-[1.1]">
              {banner?.title ?? t('home.hero.defaultTitle')}
            </h1>
            <p className="hidden sm:block text-base md:text-xl text-gray-200 mb-6 md:mb-8 max-w-lg break-keep opacity-90">
              {t('home.hero.description')}
            </p>
            <Link
              to={banner?.linkUrl ?? '/store'}
              className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all font-bold group text-sm md:text-base"
            >
              {t('home.hero.shopNow')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* 이전 / 다음 버튼 (배너 2개 이상 + 데스크탑에서만 표시) */}
      {total > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all"
            aria-label="이전 배너"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all"
            aria-label="다음 배너"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* 도트 인디케이터 (배너 2개 이상일 때만) */}
      {total > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => goToIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'w-6 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`배너 ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
