import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Palette, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Banner } from '@/api/types';
import BannerMedia from '@/app/components/common/BannerMedia';

interface HomeHeroProps {
  banners: Banner[];
}

export default function HomeHero({ banners }: HomeHeroProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  const total = banners.length;

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

      className="relative h-screen h-[100dvh] overflow-hidden bg-koala-navy"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >

      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <BannerMedia
            imageUrl={b.imageUrl}
            videoUrl={b.videoUrl}
            alt={b.title ?? 'Banner'}
            eager={i === 0}
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      {/* 하단 흰-보라 대기광 — 푸터의 글로우와 대칭. 화면(screen) 블렌드로 이미지를 가리지 않고 빛만 더한다 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 100%, rgba(162,142,191,0.45) 0%, rgba(133,110,166,0.24) 26%, rgba(62,34,89,0.12) 46%, transparent 68%)',
          mixBlendMode: 'screen',
        }}
      />
      <div className="relative h-full flex items-end px-6 md:px-12 pb-10 md:pb-14">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className="flex items-end justify-between gap-6">
            <div
              className="max-w-2xl text-white transition-opacity duration-500"
              style={{ opacity: animating ? 0.6 : 1 }}
            >
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-4 text-[11px] md:text-xs text-white/80">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {banner?.badge ?? t('home.hero.badge')}
                </span>
                {banner?.subtitle && (
                  <span className="inline-flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    {banner.subtitle}
                  </span>
                )}
                {total > 1 && (
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <Layers className="w-3.5 h-3.5" />
                    {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl mb-3 md:mb-5 font-bold tracking-tighter leading-[1.05]">
                {banner?.title ?? t('home.hero.defaultTitle')}
              </h1>
              <p className="hidden sm:block text-sm md:text-lg text-white/75 mb-7 md:mb-9 max-w-xl break-keep">
                {banner?.description ?? t('home.hero.description')}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={banner?.linkUrl ?? '/store'}
                  className="inline-flex items-center gap-2 pl-5 pr-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors font-bold group text-sm"
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  {t('home.hero.shopNow')}
                </Link>
                <Link
                  to="/artist-lab"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-white/40 text-white text-sm font-bold hover:bg-white/10 hover:border-white/70 transition-colors"
                >
                  {t('home.hero.learnMore', { defaultValue: '작가 둘러보기' })}
                </Link>
              </div>
            </div>

            {total > 1 && (
              <div className="hidden md:flex items-center gap-2 shrink-0">
                <button
                  onClick={goPrev}
                  className="inline-flex items-center gap-1.5 pl-3 pr-5 py-2.5 rounded-full border border-white/40 text-white text-xs font-bold hover:bg-white/10 hover:border-white/70 transition-colors"
                  aria-label="이전 배너"
                >
                  <ChevronLeft className="w-4 h-4" />
                  이전
                </button>
                <button
                  onClick={goNext}
                  className="inline-flex items-center gap-1.5 pl-5 pr-3 py-2.5 rounded-full border border-white/40 text-white text-xs font-bold hover:bg-white/10 hover:border-white/70 transition-colors"
                  aria-label="다음 배너"
                >
                  다음
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {total > 1 && (
        <div className="md:hidden absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
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
