import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useIsDesktop } from '@/app/hooks/useMediaQuery';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { displayPrice, formatWon } from '@/app/lib/price';
import type { Sku } from '@/api/types';

const SHOW_MS = 4000;
const SWIPE = 45;
const EASE = [0.22, 0.61, 0.36, 1] as const;

// 목록 위 원작 한 점 — PC 는 4초마다 다음 원작으로, 모바일은 손으로 민다
export default function StoreOriginalShowcase({ works }: { works: Sku[] }) {
  const reduce = useReducedMotion();
  const isDesktop = useIsDesktop();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const total = works.length;
  const current = total ? index % total : 0;

  // 자동 넘김 — 마우스를 올렸거나 화면 밖이면 멈춘다
  useEffect(() => {
    if (!isDesktop || total <= 1 || paused || !inView || reduce) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % total), SHOW_MS);
    return () => clearTimeout(id);
  }, [isDesktop, total, paused, inView, reduce, current]);

  if (total === 0) return null;

  const go = (step: 1 | -1) => setIndex((i) => (i + step + total) % total);
  const sku = works[current];
  const title = sku.model ?? sku.name;
  const price = displayPrice(sku);

  return (
    <section
      ref={ref}
      aria-roledescription="원작 소개"
      aria-label={`원작 ${current + 1} / ${total}`}
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
      className="mx-auto max-w-[1320px] px-5 pt-8 md:px-10 md:pt-10"
    >
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:items-center md:gap-12">
        {/* 사진은 자르지 않는다 — 가로로 긴 작품도 통째로 보이게 */}
        <div className="relative aspect-[4/3] overflow-hidden bg-white">
          <AnimatePresence initial={false}>
            <motion.div
              key={sku.skuCode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
              className="absolute inset-0"
            >
              <Link to={`/product/${sku.skuCode}`} className="block h-full w-full">
                <ImageWithFallback
                  src={sku.primaryImageUrl ?? ''}
                  alt={`${sku.artistName} 작 ${title}`}
                  className="h-full w-full object-contain"
                />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={sku.skuCode}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
            className="min-w-0"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#876A32] md:text-[11px]">Original</p>
            <p className="mt-3 text-[15px] text-gray-900 md:text-base">{sku.artistName}</p>
            <h2 className="font-serif-ko mt-1 text-[26px] font-bold leading-snug text-gray-900 break-keep md:text-[34px]">{title}</h2>
            {sku.material && <p className="mt-1.5 text-sm text-gray-500 break-keep">{sku.material}</p>}
            {price != null && (
              <p className="mt-4 text-lg font-bold tabular-nums text-gray-900 md:text-xl">₩{formatWon(price)}</p>
            )}
            <Link
              to={`/product/${sku.skuCode}`}
              className="mt-5 inline-block border-b border-gray-400 pb-0.5 text-[13px] text-gray-900 transition-colors hover:border-koala-purple hover:text-koala-purple"
            >
              작품 자세히 보기
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {total > 1 && (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            {works.map((w, i) => (
              <button
                key={w.skuCode}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${w.model ?? w.name} 보기`}
                aria-current={i === current}
                className={`h-1.5 rounded-full transition-[width,background-color] duration-300
                  ${i === current ? 'w-5 bg-koala-purple' : 'w-1.5 bg-gray-300 hover:bg-gray-400'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="이전 원작"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="다음 원작"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
