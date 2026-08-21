import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Palette, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Banner, Sku } from '@/api/types';
import BannerMedia from '@/app/components/common/BannerMedia';
import { toCdnUrl } from '@/app/lib/imageUrl';

interface HomeHeroProps {
  banners: Banner[];
  featured?: Sku[];
}

export default function HomeHero({ banners, featured = [] }: HomeHeroProps) {
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
  const railItems = featured.slice(0, 3);

  return (
    <section
      data-hero="dark"
      className="relative overflow-hidden bg-koala-navy"
    >
      <div className="grid lg:grid-cols-[1.55fr_1fr]">
        <div
          className="relative h-[64vh] min-h-[440px] max-h-[600px] lg:h-[58vh] lg:min-h-[600px] lg:max-h-[860px] overflow-hidden"
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

          <div className="relative h-full flex items-end px-6 md:px-10 lg:px-12 pb-8 md:pb-12">
            <div
              className="max-w-xl text-white transition-opacity duration-500"
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
              <h1 className="text-3xl sm:text-4xl md:text-6xl mb-3 md:mb-5 font-bold tracking-tighter leading-[1.05]">
                {banner?.title ?? t('home.hero.defaultTitle')}
              </h1>
              <p className="hidden sm:block text-sm md:text-base text-white/75 mb-6 md:mb-8 max-w-lg break-keep">
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
                {total > 1 && (
                  <span className="hidden md:flex items-center gap-2 ml-1">
                    <button
                      onClick={goPrev}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-colors"
                      aria-label="이전 배너"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={goNext}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/40 text-white hover:bg-white/10 hover:border-white/70 transition-colors"
                      aria-label="다음 배너"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          {total > 1 && (
            <div className="lg:hidden absolute bottom-4 right-5 flex gap-2">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`배너 ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <aside
          className="relative hidden lg:flex flex-col justify-center lg:px-8 lg:pt-28 lg:pb-8 overflow-hidden"
          style={{ background: 'linear-gradient(175deg, #1a0f27 0%, #241338 52%, #2c1a30 100%)' }}
        >
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px]"
            style={{
              background:
                'radial-gradient(150% 110% at 50% 100%, rgba(199,161,90,0.72) 0%, rgba(165,129,61,0.40) 22%, rgba(62,34,89,0.18) 48%, transparent 76%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px]"
            style={{
              background:
                'radial-gradient(92% 68% at 50% 106%, rgba(244,228,198,0.52) 0%, rgba(228,206,158,0.22) 34%, transparent 64%)',
            }}
          />
          <div className="relative">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-koala-gold mb-1">Featured</p>
                <h2 className="text-white text-lg font-bold tracking-tight">지금 주목받는 작품</h2>
              </div>
              <Link to="/store" className="text-xs font-bold text-white/50 hover:text-white transition-colors whitespace-nowrap">
                더보기 +
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {railItems.length > 0
                ? railItems.map((s) => {
                    const price = (s.salePrice ?? s.listPrice)?.toLocaleString();
                    return (
                      <Link
                        key={s.skuCode}
                        to={`/product/${s.skuCode}`}
                        className="group flex items-center gap-3 rounded-xl bg-white/95 hover:bg-white p-2.5 shadow-sm transition-colors"
                      >
                        <img
                          src={toCdnUrl(s.primaryImageUrl) ?? '/placeholder.svg'}
                          alt={s.name}
                          className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-100"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] text-gray-500 truncate">{s.artistName}</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{s.name}</p>
                          <p className="text-sm font-bold text-koala-gold-deep mt-0.5">₩{price}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </Link>
                    );
                  })
                : Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 animate-pulse">
                      <div className="w-16 h-16 rounded-lg bg-white/15 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-2.5 w-1/3 rounded bg-white/15" />
                        <div className="h-3 w-2/3 rounded bg-white/15" />
                        <div className="h-3 w-1/4 rounded bg-white/15" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
