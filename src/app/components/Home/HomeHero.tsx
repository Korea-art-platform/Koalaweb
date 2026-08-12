import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Palette, Layers } from 'lucide-react';
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
      /*
       * 화면을 꽉 채운다. dvh 는 모바일 주소창이 접혔다 펴져도 실제 보이는 높이를 따라가서
       * vh 처럼 아래에 빈 띠가 생기지 않는다. dvh 를 모르는 브라우저는 앞의 vh 로 떨어진다.
       */
      className="relative h-screen h-[100dvh] overflow-hidden bg-koala-navy"
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
          {/* object-cover + object-center — 화면 비율이 어떻게 바뀌어도 잘릴지언정 빈틈은 없다 */}
          <img
            src={b.imageUrl}
            alt={b.title ?? 'Banner'}
            className="w-full h-full object-cover object-center"
          />
        </div>
      ))}

      {/* 그라디언트 오버레이 — 하단만 어둡게 (위쪽 상품 노출) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

      {/* 텍스트 콘텐츠 — 하단 정렬 (상품 사진 가림 방지) */}
      <div className="relative h-full flex items-end px-6 md:px-12 pb-10 md:pb-14">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className="flex items-end justify-between gap-6">

            <div
              className="max-w-2xl text-white transition-opacity duration-500"
              style={{ opacity: animating ? 0.6 : 1 }}
            >
              {/* 메타 줄 — 제목 위에 작게 깔아 정보를 먼저 준다 */}
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

            {/* 이전 / 다음 — 참고 시안처럼 우하단에 나란히 (데스크탑) */}
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

      {/* 도트 인디케이터 — 모바일에서는 이것이 유일한 이동 수단이다 */}
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
