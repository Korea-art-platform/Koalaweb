import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Banner, Sku } from '@/api/types';
import BannerMedia from '@/app/components/common/BannerMedia';
import { useCoveredByPanel } from '@/app/components/layouts/RisingPanel';
import { displayPrice, formatWon } from '@/app/lib/price';
import { toCdnUrl, toThumbUrl } from '@/app/lib/imageUrl';

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

  // 히어로는 제자리에 붙어 있어 화면 밖으로 나가지 않는다. 판에 다 가려진
  // 뒤에도 영상이 계속 돌면 보이지도 않는 화면을 디코딩하며 배터리를 쓴다.
  const heroRef = useRef<HTMLElement>(null);
  const covered = useCoveredByPanel(heroRef);

  // 이미지 배너가 머무는 시간
  const IMAGE_MS = 5000;
  // 영상은 끝나면 넘어간다. 다만 자동재생이 막히거나 파일이 멈춰 버리면
  // onEnded 가 오지 않아 캐러셀이 영영 서 버리므로 상한을 같이 건다.
  const VIDEO_MAX_MS = 30000;

  const hasVideo = Boolean(banners[current]?.videoUrl);
  const [videoMode, setVideoMode] = useState(hasVideo);

  useEffect(() => {
    setVideoMode(Boolean(banners[current]?.videoUrl));
  }, [current, banners]);

  useEffect(() => {
    // 가려진 동안에는 넘기지 않는다. 그냥 두면 안 보이는 채로 배너가 계속
    // 바뀌면서 다음 영상까지 받아 온다.
    if (total <= 1 || covered) return;
    const id = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, videoMode ? VIDEO_MAX_MS : IMAGE_MS);
    return () => clearTimeout(id);
  }, [total, current, videoMode, covered]);

  function handleVideoEnded() {
    if (total <= 1) return;
    setCurrent((prev) => (prev + 1) % total);
  }

  function goToIndex(index: number) {
    if (index === current || animating) return;
    setAnimating(true);
    setCurrent(index);
    setTimeout(() => setAnimating(false), 700);
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
      goToIndex((current + (diff > 0 ? 1 : total - 1)) % total);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  const banner = banners[current] ?? null;
  const pick = featured[0] ?? null;
  const pickPrice = pick ? formatWon(displayPrice(pick)) : null;
  const two = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      ref={heroRef}
      data-hero="dark"
      className="relative koala-stage overflow-hidden bg-koala-navy"
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
            active={i === current && !covered}
            // 배너가 하나뿐이면 넘어갈 곳이 없으니 그대로 반복한다
            loop={total <= 1}
            onEnded={handleVideoEnded}
            onFallback={i === current ? () => setVideoMode(false) : undefined}
          />
        </div>
      ))}

      {/*
        위아래 어두운 막. 배너 사진은 관리자가 올리는 것이라 밝을 수도 어두울 수도
        있는데 그 위에 흰 글씨가 얹힌다. 사진에 기대지 않고 읽히게 만든다.
        · 위  — 헤더 글자가 밝은 배너 위에서도 보이게
        · 아래 — 제목과 정보 바가 사진에서 떠 보이지 않게

        Tailwind 임의색에 투명도를 붙이는 대신 인라인으로 적는다. 앞서 그렇게
        했을 때 막이 제대로 걸리지 않아 헤더 명암비가 2:1 에 머물렀다.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[200px]"
        style={{ background: 'linear-gradient(to bottom, rgba(13,9,18,.85) 0%, rgba(13,9,18,.45) 45%, transparent 100%)' }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[58%]"
        style={{ background: 'linear-gradient(to top, rgba(13,9,18,.94) 0%, rgba(13,9,18,.55) 38%, transparent 100%)' }}
      />

      {/* 아래 정보 묶음 — 작품을 가리지 않도록 제목·버튼을 전부 밑으로 내렸다 */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div
          className="flex flex-col md:flex-row md:items-end gap-5 md:gap-8 px-5 md:px-12 pt-5 pb-4 md:pb-5 border-b border-white/12"
          style={{ opacity: animating ? 0.65 : 1, transition: 'opacity .5s' }}
        >
          <div className="min-w-0 flex-1 text-white">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1.5 text-[11px] md:text-xs tracking-wide">
              <span className="font-bold text-koala-gold">{banner?.badge ?? t('home.hero.badge')}</span>
              {banner?.subtitle && <span className="text-white/65">· {banner.subtitle}</span>}
            </div>
            <h1 className="text-2xl md:text-[2rem] font-black tracking-tight leading-tight truncate">
              {banner?.title ?? t('home.hero.defaultTitle')}
            </h1>
            <p className="hidden md:block text-sm text-white/65 mt-1 truncate">
              {banner?.description ?? t('home.hero.description')}
            </p>
          </div>

          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            {total > 1 && (
              <div className="flex items-center gap-2.5">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => goToIndex(i)}
                    aria-label={`배너 ${i + 1}`}
                    aria-current={i === current ? 'true' : undefined}
                    className={`rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 h-1.5 bg-koala-gold' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/75'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-bold text-white/55 tabular-nums">
                  {two(current + 1)} / {two(total)}
                </span>
              </div>
            )}
            <div className="flex gap-2.5">
              <Link
                to={banner?.linkUrl ?? '/store'}
                className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-[13px] font-bold hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                {t('home.hero.shopNow')}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/artist-lab"
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-white/40 text-white text-[13px] font-bold hover:bg-white/10 hover:border-white/70 transition-colors whitespace-nowrap"
              >
                {t('home.hero.learnMore', { defaultValue: '작가 둘러보기' })}
              </Link>
            </div>
          </div>
        </div>

      {/* 하단 정보 바 — 주목받는 작품 한 점과 주요 이동 */}
        <div className="grid grid-cols-2 md:grid-cols-[1.55fr_.9fr_.9fr] backdrop-blur-md">
        {pick ? (
          <Link
            to={`/product/${pick.skuCode}`}
            className="col-span-2 md:col-span-1 px-5 md:px-7 py-3.5 md:py-5 bg-[#0D0912]/62 border-r border-white/12 hover:bg-[#0D0912]/80 transition-colors"
          >
            <p className="text-[10px] font-bold tracking-[0.24em] text-koala-gold mb-2">
              FEATURED · 지금 주목받는 작품
            </p>
            <div className="flex items-center gap-3.5">
              <img
                src={toThumbUrl(pick.primaryImageUrl) ?? '/placeholder.svg'}
                onError={(e) => {
                  const img = e.currentTarget;
                  const full = toCdnUrl(pick.primaryImageUrl);
                  if (full && img.src !== full) img.src = full;
                }}
                alt=""
                className="w-11 h-11 md:w-[52px] md:h-[52px] object-cover bg-white/10 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[11px] text-white/60 truncate">{pick.artistName}</p>
                <p className="text-sm md:text-[15px] font-bold text-white truncate">
                  {pick.model ?? pick.name}
                </p>
              </div>
              <p className="ml-auto text-sm md:text-[15px] font-black text-koala-gold whitespace-nowrap">
                ₩{pickPrice}
              </p>
            </div>
          </Link>
        ) : (
          <div className="col-span-2 md:col-span-1 bg-[#0D0912]/62 border-r border-white/12" />
        )}

        <Link
          to="/store"
          className="flex items-center justify-between px-5 md:px-7 py-4 md:py-5 bg-[#0D0912]/62 border-r border-white/12 text-white hover:bg-[#0D0912]/80 transition-colors"
        >
          <span className="text-[13px] md:text-[15px] font-bold">{t('header.menus.store')}</span>
          <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </Link>

        <Link
          to="/artist-lab"
          className="flex items-center justify-between px-5 md:px-7 py-4 md:py-5 text-white bg-gradient-to-r from-koala-purple via-koala-purple-hover to-koala-gold hover:brightness-110 transition-[filter]"
        >
          <span className="text-[13px] md:text-[15px] font-bold">{t('header.menus.lab')}</span>
          <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" />
        </Link>
        </div>
      </div>
    </section>
  );
}
