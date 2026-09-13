import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Artist, Sku } from '@/api/types';

const SPOT_MS = 4000;
const SWIPE = 45;
const EASE = [0.22, 0.61, 0.36, 1] as const;

interface Props {
  artists: Artist[];
  /** 지금까지 불러온 작품 — 작가마다 세 점을 여기서 고른다 */
  skus: Sku[];
  onPickArtist: (code: string) => void;
}

// 목록 사이 작가 조명 — PC 는 4초마다 넘기고, 모바일은 손으로 민다
export default function StoreArtistSpotlight({ artists, skus, onPickArtist }: Props) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const total = artists.length;
  const current = total ? index % total : 0;

  // 자동 넘김 — 마우스를 올렸거나 화면 밖이면 멈춘다
  useEffect(() => {
    if (!isDesktop || total <= 1 || paused || !inView || reduce) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), SPOT_MS);
    return () => clearTimeout(id);
  }, [isDesktop, total, paused, inView, reduce, current]);

  if (total === 0) return null;

  const go = (step: 1 | -1) => setIndex((i) => (i + step + total) % total);
  const artist = artists[current];
  const works = skus.filter((s) => s.artistCode === artist.artistCode).slice(0, 3);
  const photo = artist.profileImageUrl ?? artist.studioImageUrl;

  return (
    <section
      ref={ref}
      aria-roledescription="작가 소개"
      aria-label={`작가 소개 ${current + 1} / ${total}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > SWIPE) go(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="col-span-full bg-[#F7F5FA] p-5 md:p-7"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={artist.artistCode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
          className="grid gap-5 md:grid-cols-[minmax(0,280px)_1fr] md:items-center md:gap-8"
        >
          <div className="aspect-[4/3] overflow-hidden bg-[#E9E2EF] md:aspect-square">
            {photo ? (
              <ImageWithFallback thumb src={photo} alt={`${artist.name} 작가`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <img src="/logo-symbol.svg" alt="" className="h-1/4 w-1/4 opacity-50" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#856EA6] md:text-[11px]">Artist</p>
            <h3 className="font-serif-ko mt-1.5 text-2xl font-bold text-gray-900 md:text-[28px]">{artist.name}</h3>
            {(artist.description || artist.specialty) && (
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-gray-500 break-keep line-clamp-3">
                {artist.description || artist.specialty}
              </p>
            )}
            {works.length > 0 && (
              <div className="mt-4 flex gap-2.5 md:gap-3">
                {works.map((w) => (
                  <Link
                    key={w.skuCode}
                    to={`/product/${w.skuCode}`}
                    className="block w-[72px] overflow-hidden bg-white md:w-[84px]"
                    aria-label={`${artist.name} 작 ${w.model ?? w.name}`}
                  >
                    <ImageWithFallback thumb src={w.primaryImageUrl ?? ''} alt="" className="aspect-[4/5] h-full w-full object-cover" />
                  </Link>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => onPickArtist(artist.artistCode)}
              className="mt-4 border-b border-gray-400 pb-0.5 text-[13px] text-gray-900 transition-colors hover:border-koala-purple hover:text-koala-purple"
            >
              {artist.name} 작품만 보기
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {total > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {artists.map((a, i) => (
              <button
                key={a.artistCode}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${a.name} 작가 보기`}
                aria-current={i === current}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300
                  ${i === current ? 'w-5 bg-koala-purple' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="이전 작가"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="다음 작가"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
