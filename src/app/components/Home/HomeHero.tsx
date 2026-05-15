import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Banner } from '@/api/types';

interface HomeHeroProps {
  banners: Banner[];
}

export default function HomeHero({ banners }: HomeHeroProps) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

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

  const banner = banners[current] ?? null;

  return (
    <section data-hero="dark" className="relative h-[55vh] min-h-[420px] md:h-[85vh] overflow-hidden bg-black">

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

      {/* 배너 없을 때 빈 다크 배경만 표시 */}

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
