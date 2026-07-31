import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SectionHeader from './SectionHeader';
import type { Sku } from '@/api/types';

interface Props {
  /** 장르별 상품 수 (예: { SCULPTURE: 5 }) */
  genreCounts: Record<string, number>;
  /** 배경 이미지용 상품 목록 */
  skus: Sku[];
}

/**
 * 002 — 장르별 컬렉션.
 * 등록된 장르(상품 1개 이상)만 아코디언 행으로 생성하고,
 * 행에 호버(모바일은 탭)하면 펼쳐지며 그 장르 대표 작품이 배경으로 드러난다.
 */
export default function HomeGenreCollections({ genreCounts, skus }: Props) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // 상품이 있는 장르만 (ALL 제외)
  const genres = Object.entries(genreCounts)
    .filter(([key, count]) => key !== 'ALL' && count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (genres.length === 0) return null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          num="002"
          eyebrow="Collections"
          title="장르별 컬렉션"
          sub="장르마다 다른 작가의 시선을 만나보세요"
        />

        <div className="flex flex-col border-t border-gray-200">
          {genres.map(([genre, count], i) => {
            const label = t(`store.categories.${genre}`, { defaultValue: genre }) as string;
            const cover = skus.find((s) => s.genre === genre)?.primaryImageUrl;
            const isActive = activeIndex === i;

            return (
              <Link
                key={genre}
                to={`/store?category=${genre}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(i)}
                onBlur={() => setActiveIndex(null)}
                className="group relative block border-b border-gray-200 overflow-hidden"
              >
                {/* 펼쳐지는 배경 (대표 작품) */}
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {cover ? (
                    <>
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-koala-purple/70" />
                    </>
                  ) : (
                    <div className="h-full w-full bg-koala-purple" />
                  )}
                </motion.div>

                {/* 행 내용 */}
                <motion.div
                  className="relative flex items-center justify-between gap-4 px-2 md:px-6"
                  initial={false}
                  animate={{ paddingTop: isActive ? 40 : 20, paddingBottom: isActive ? 40 : 20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="flex items-baseline gap-3 md:gap-5 min-w-0">
                    <span
                      className={`text-[10px] md:text-xs font-bold tabular-nums transition-colors ${
                        isActive ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <motion.h3
                      className={`font-bold tracking-tight truncate transition-colors ${
                        isActive ? 'text-white' : 'text-gray-900'
                      }`}
                      initial={false}
                      animate={{ fontSize: isActive ? '2rem' : '1.5rem' }}
                      transition={{ duration: 0.35 }}
                    >
                      {label}
                    </motion.h3>
                    <span
                      className={`text-xs md:text-sm font-medium shrink-0 transition-colors ${
                        isActive ? 'text-white/70' : 'text-gray-400'
                      }`}
                    >
                      {count}점
                    </span>
                  </div>

                  <span
                    className={`text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    보러가기 +
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
