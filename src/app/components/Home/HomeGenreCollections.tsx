import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku } from '@/api/types';

interface Props {
  genreCounts: Record<string, number>;

  skus: Sku[];
}

export default function HomeGenreCollections({ genreCounts, skus }: Props) {
  const { subLabel } = useCategories();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const genres = Object.entries(genreCounts)
    .filter(([key, count]) => key !== 'ALL' && count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (genres.length === 0) return null;

  return (
    <section className="px-4 md:px-12 pt-12 md:pt-24">
      <div className="max-w-[1800px] mx-auto">
        <SectionHeader
          eyebrow="Collections"
          title="장르별 컬렉션"
          sub="장르마다 다른 작가의 시선을 만나보세요"
        />
        <div className="flex flex-col border-t border-gray-200">
          {genres.map(([genre, count], i) => {
            const label = subLabel(genre);
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
