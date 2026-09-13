import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Banner } from '@/api/types';
import ShowcaseArt, { STAGE_LIGHT, stageColor } from '@/app/components/Home/ShowcaseArt';
import { useCoveredByPanel } from '@/app/components/layouts/RisingPanel';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import { toCdnUrl } from '@/app/lib/imageUrl';
import { formatWon } from '@/app/lib/price';

interface HomeHeroProps {
  banners: Banner[];
  loading?: boolean;
}

// 한 작품이 머무는 시간
const SLIDE_MS = 6000;
const SWIPE_THRESHOLD = 50;
const EASE = [0.22, 0.61, 0.36, 1] as const;
const INSTAGRAM = 'https://www.instagram.com/koalaobjects/';

// 라벨만 아래로 넘긴다 — 움직임은 ShowcaseArt 조각마다 있다
const GROUP = { enter: {}, center: {}, exit: {} };

const effectsOf = (b: Banner) => [b.effectImageUrl1, b.effectImageUrl2, b.effectImageUrl3];
// 작품명 — 뒤에 크게 까는 글자와 아래 작은 이름이 같이 쓴다
const fullNameOf = (b: Banner) => b.skuName || b.skuModel || b.title || '';

export default function HomeHero({ banners, loading = false }: HomeHeroProps) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();

  // 작품이 연결된 배너만 건다
  const slides = banners.filter((b) => b.skuCode && b.imageUrl);
  const total = slides.length;

  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const covered = useCoveredByPanel(heroRef);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const index = total ? current % total : 0;
  const slide = total ? slides[index] : null;
  const next = total > 1 ? slides[(index + 1) % total] : null;

  // 자동 넘김 — 가려졌거나 마우스를 올리면 멈춘다
  useEffect(() => {
    if (total <= 1 || covered || paused || reduce) return;
    const id = setTimeout(() => {
      setDir(1);
      setCurrent((c) => (c % total + 1) % total);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [total, index, covered, paused, reduce]);

  // 다음 작품 이미지 미리 받기
  useEffect(() => {
    if (!next) return;
    [next.imageUrl, ...effectsOf(next)].forEach((u) => {
      const src = toCdnUrl(u);
      if (src) new Image().src = src;
    });
  }, [next]);

  function go(step: 1 | -1) {
    if (total <= 1) return;
    setDir(step);
    setCurrent((c) => (c % total + step + total) % total);
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
    if (Math.abs(diff) >= SWIPE_THRESHOLD) go(diff > 0 ? 1 : -1);
    touchStartX.current = null;
    touchEndX.current = null;
  }

  // 가운데 작품 — 배치마다 이동 거리와 뒤 이름 크기·줄 수만 다르다
  const renderArt = (reach: number, nameWidth: number, nameLines: 1 | 2) =>
    slide ? (
      <AnimatePresence custom={dir}>
        <motion.div
          key={slide.id}
          custom={dir}
          variants={GROUP}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <ShowcaseArt
            imageUrl={slide.imageUrl}
            effects={effectsOf(slide)}
            alt={`${slide.artistName ?? ''} 작 ${fullNameOf(slide)}`}
            name={fullNameOf(slide)}
            nameWidth={nameWidth}
            nameLines={nameLines}
            animate={!reduce}
            dir={dir}
            reach={reach}
          />
        </motion.div>
      </AnimatePresence>
    ) : loading ? (
      <div className="absolute inset-[16%] animate-pulse rounded-full bg-white/[0.06]" />
    ) : (
      <img
        src="/logo-symbol-white.svg"
        alt=""
        aria-hidden
        className="absolute left-[30%] top-[30%] h-[40%] w-[40%] opacity-20"
      />
    );

  return (
    <section
      ref={heroRef}
      data-hero="dark"
      aria-roledescription="carousel"
      aria-label="대표 작품"
      className="relative koala-stage overflow-hidden bg-koala-navy"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') setPaused(true); }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse') setPaused(false); }}
    >
      {/* 배경 — 제품 색을 한 톤 누른 색으로 넘어간다 */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={false}
        animate={{ backgroundColor: stageColor(slide?.bgColor) }}
        transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: STAGE_LIGHT }} />

      {isDesktop ? (
        <DesktopStage slide={slide} next={next} total={total} loading={loading} go={go} art={renderArt(2.6, 1.35, 1)} />
      ) : (
        <MobileStage slide={slide} total={total} loading={loading} go={go} art={renderArt(1, 0.95, 2)} />
      )}
    </section>
  );
}

interface StageProps {
  slide: Banner | null;
  total: number;
  loading: boolean;
  art: ReactNode;
  go: (step: 1 | -1) => void;
}

// PC — 왼쪽 문구, 가운데 작품(뒤에 큰 작품명), 오른쪽 가격, 아래 작품명·다음 작품
function DesktopStage({ slide, next, total, loading, art, go }: StageProps & { next: Banner | null }) {
  const { t } = useTranslation();
  const discounted = slide?.displayPrice != null && slide.displayListPrice != null
    && slide.displayListPrice > slide.displayPrice;

  return (
    <div
      className="relative mx-auto grid h-full max-w-[1440px] grid-cols-[minmax(0,240px)_minmax(0,1fr)_minmax(0,180px)]
        grid-rows-[minmax(0,1fr)_auto] gap-x-10 px-12 pt-28 pb-9 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,240px)]"
    >
      {/* 왼쪽 — 넘기기 · 메인 문구 · 서브 문구 · 버튼 */}
      <div className="relative z-10 flex min-w-0 flex-col justify-center">
        {total > 1 && (
          <div className="mb-8 flex gap-2">
            <RoundButton label="이전 작품" onClick={() => go(-1)}><ArrowLeft className="h-4 w-4" /></RoundButton>
            <RoundButton label="다음 작품" onClick={() => go(1)}><ArrowRight className="h-4 w-4" /></RoundButton>
          </div>
        )}
        {slide ? (
          <Swap id={slide.id}>
            <h1 className="font-serif-ko text-[34px] font-bold leading-[1.2] text-white break-keep line-clamp-3 xl:text-[42px]">
              {slide.title || fullNameOf(slide)}
            </h1>
            {slide.description && (
              <p className="mt-5 text-[15px] leading-relaxed text-white/70 break-keep line-clamp-4">{slide.description}</p>
            )}
          </Swap>
        ) : loading ? (
          <div className="space-y-3">
            <div className="h-10 w-56 animate-pulse rounded bg-white/[0.06]" />
            <div className="h-10 w-40 animate-pulse rounded bg-white/[0.06]" />
          </div>
        ) : (
          <h1 className="font-serif-ko text-[34px] font-bold leading-[1.2] text-white break-keep xl:text-[42px]">
            {t('home.hero.defaultTitle')}
            <br />
            {t('home.hero.defaultSubtitle')}
          </h1>
        )}
        <div className="mt-8">
          <HeroButtons slide={slide} />
        </div>
      </div>

      {/* 가운데 — 작품 */}
      <div className="relative flex min-w-0 items-center justify-center [container-type:inline-size]">
        <div className="relative aspect-square w-[min(100cqw,56svh)]">{art}</div>
      </div>

      {/* 오른쪽 — 가격 */}
      <div className="relative z-10 flex min-w-0 flex-col items-end justify-center text-right">
        {slide?.displayPrice != null && (
          <Swap id={slide.id}>
            <p className="text-[30px] font-medium leading-none tabular-nums text-white xl:text-[44px]">
              ₩{formatWon(slide.displayPrice)}
            </p>
            {discounted && (
              <p className="mt-3 text-lg tabular-nums text-white/45 line-through xl:text-xl">
                ₩{formatWon(slide.displayListPrice)}
              </p>
            )}
          </Swap>
        )}
      </div>

      {/* 아래 — 인스타그램 · 작품명 · 다음 작품 */}
      <div className="relative z-10 col-span-3 grid grid-cols-[1fr_auto_1fr] items-end">
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="KOALA Instagram"
          className="inline-flex h-10 w-10 items-center justify-center justify-self-start rounded-full border border-white/20
            text-white/75 transition-colors hover:border-white/50 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <div className="min-h-[52px] text-center">
          {slide && (
            <Swap id={slide.id}>
              <p className="text-[15px] font-semibold text-white">{fullNameOf(slide)}</p>
              <p className="mt-1 text-[13px] text-white/65">{slide.artistName}</p>
            </Swap>
          )}
        </div>
        <div className="justify-self-end">{next && <NextThumb banner={next} onClick={() => go(1)} />}</div>
      </div>
    </div>
  );
}

// 모바일·태블릿 — 좌우 화살표, 가운데 작품(뒤에 큰 작품명), 아래 작품명·버튼
function MobileStage({ slide, total, loading, art, go }: StageProps) {
  const { t } = useTranslation();

  return (
    <div className="relative mx-auto flex h-full max-w-[1320px] flex-col justify-center px-3 pt-24 pb-8 md:px-8">
      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 md:gap-4">
        {total > 1 ? (
          <RoundButton label="이전 작품" onClick={() => go(-1)}><ArrowLeft className="h-4 w-4" /></RoundButton>
        ) : <div aria-hidden />}

        {/* 넘어가는 동안에도 좌우 화살표를 덮지 않게 가로만 자른다 */}
        <div className="flex min-w-0 items-center justify-center overflow-x-clip [container-type:inline-size]">
          <div className="relative aspect-square w-[min(100cqw,54svh)] [@media(max-height:560px)]:w-[min(100cqw,30svh)]">
            {art}
          </div>
        </div>

        {total > 1 ? (
          <RoundButton label="다음 작품" onClick={() => go(1)}><ArrowRight className="h-4 w-4" /></RoundButton>
        ) : <div aria-hidden />}
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <div className="flex min-h-[54px] flex-col items-center justify-center">
          {slide ? (
            <Swap id={slide.id}>
              <h1 className="font-serif-ko text-[20px] font-bold leading-snug text-white break-keep line-clamp-1">
                {fullNameOf(slide)}
              </h1>
              <p className="mt-1 text-[13px] text-white/70">{slide.artistName}</p>
            </Swap>
          ) : loading ? (
            <>
              <div className="h-7 w-40 animate-pulse rounded bg-white/[0.06]" />
              <div className="mt-2 h-4 w-20 animate-pulse rounded bg-white/[0.06]" />
            </>
          ) : (
            <>
              <h1 className="font-serif-ko text-[20px] font-bold leading-snug text-white break-keep">
                {t('home.hero.defaultTitle')} {t('home.hero.defaultSubtitle')}
              </h1>
              <p className="mt-1 text-[13px] text-white/70">KOALA · Korea Art Lab</p>
            </>
          )}
        </div>
        <div className="mt-5">
          <HeroButtons slide={slide} />
        </div>
      </div>
    </div>
  );
}

// 작품이 바뀔 때 글자를 살짝 올리며 바꾼다
function Swap({ id, children }: { id: number; children: ReactNode }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3, ease: EASE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white/80
        transition-colors duration-300 hover:border-white/60 hover:text-white"
    >
      {children}
    </button>
  );
}

// 쇼핑하기 → 스토어, 작가 둘러보기 → 작가 상세
function HeroButtons({ slide }: { slide: Banner | null }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2.5">
      {/* 화살표를 글씨 옆에 벗겨 두지 않고 제 자리(원)에 담는다.
          올리면 원 안에서만 움직여 버튼 폭이 흔들리지 않는다. */}
      <Link
        to="/store"
        className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full
          bg-white py-1.5 pl-5 pr-1.5 text-[13px] font-bold text-black
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          hover:bg-white/95 active:scale-[0.985] motion-reduce:transition-none"
      >
        {t('home.hero.shopNow')}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/6
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          group-hover:translate-x-0.5 motion-reduce:transition-none">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
      <Link
        to={slide?.artistCode ? `/artist/${slide.artistCode}` : '/artist-lab'}
        className="inline-flex items-center whitespace-nowrap rounded-full border
          border-white/40 px-5 py-2.5 text-[13px] font-bold text-white
          transition-[background-color,border-color,transform] duration-300
          ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-white/70 hover:bg-white/10
          active:scale-[0.985] motion-reduce:transition-none"
      >
        {t('home.hero.learnMore', { defaultValue: '작가 둘러보기' })}
      </Link>
    </div>
  );
}

// 다음 작품 — 오른쪽 아래. 넘기면 새 작품이 이쪽에서 들어온다
function NextThumb({ banner, onClick }: { banner: Banner; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-label="다음 작품" className="group relative block h-24 w-24">
      <AnimatePresence initial={false}>
        <motion.img
          key={banner.id}
          src={toCdnUrl(banner.imageUrl)}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full object-contain drop-shadow-[0_8px_12px_rgba(13,9,18,0.4)]
            transition-[scale] duration-300 group-hover:scale-105"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </AnimatePresence>
    </button>
  );
}
