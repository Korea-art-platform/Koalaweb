import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useReducedMotion, type PanInfo } from 'framer-motion';
import Navigation from '@/app/components/layouts/Header';
import { MapPin, Phone, Mail, Store as StoreIcon, ArrowUpRight, Instagram, ChevronRight, Search, X } from 'lucide-react';
import { getStores, type StoreItem } from '@/api/store';

const cityOf = (addr?: string) => (addr?.trim().split(/\s+/)[0]) || '기타';

export default function Stores() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('전체');
  const [selectedCode, setSelectedCode] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    getStores()
      .then((res) => setStores(res.data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  const regions = useMemo(() => {
    const seen: string[] = [];
    for (const s of stores) {
      const c = cityOf(s.address);
      if (!seen.includes(c)) seen.push(c);
    }
    return ['전체', ...seen];
  }, [stores]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stores.filter((s) => {
      const inRegion = region === '전체' || cityOf(s.address) === region;
      const inQuery = q === '' || `${s.name} ${s.address} ${s.addressDetail ?? ''}`.toLowerCase().includes(q);
      return inRegion && inQuery;
    });
  }, [stores, query, region]);

  const active = filtered.find((s) => s.storeCode === selectedCode) ?? filtered[0] ?? null;

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sheetOpen]);

  const onSelect = (code: string) => {
    setSelectedCode(code);
    setSheetOpen(true);
  };

  const onSheetDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 600) setSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Helmet>
        <title>입점 매장 — KOALA</title>
        <meta name="description" content="KOALA 작품을 직접 만나보실 수 있는 공식 입점 매장 안내." />
      </Helmet>
      <Navigation />

      <div className="pt-32 pb-24 px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <p className="text-xs font-bold text-koala-gold-deep tracking-[0.24em] uppercase mb-2">Stores</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">입점 매장</h1>
          <p className="text-sm md:text-base text-gray-500 mt-3 break-keep">
            KOALA 작품을 직접 만나보실 수 있는 공식 입점 매장입니다.
          </p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
        ) : stores.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <StoreIcon className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm">아직 등록된 입점 매장이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 검색 + 지역 필터 */}
            <div className="mb-6 flex flex-col gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="매장명 · 주소 검색"
                  className="w-full md:max-w-md pl-10 pr-9 py-2.5 rounded-full border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-koala-purple/15 focus:border-koala-purple/40"
                />
                {query && (
                  <button onClick={() => setQuery('')} aria-label="검색어 지우기"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {regions.length > 2 && (
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                  {regions.map((r) => {
                    const on = r === region;
                    return (
                      <button
                        key={r}
                        onClick={() => setRegion(r)}
                        className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                          on
                            ? 'bg-koala-purple text-white border-koala-purple'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-5 md:gap-7 items-start">
              {/* 좌측(모바일: 전체) 리스트 */}
              <motion.div layout className="flex flex-col gap-2.5">
                <AnimatePresence mode="popLayout" initial={false}>
                  {filtered.map((s) => {
                    const on = active?.storeCode === s.storeCode;
                    return (
                      <motion.button
                        key={s.storeCode}
                        layout
                        initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                        whileHover={{ x: reduce ? 0 : 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onSelect(s.storeCode)}
                        aria-pressed={on}
                        className={`group relative overflow-hidden text-left rounded-xl border px-4 py-3.5 transition-colors ${
                          on
                            ? 'border-koala-purple bg-koala-purple/[0.04] shadow-sm md:shadow'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        {on && (
                          <motion.span
                            layoutId="store-active-bar"
                            className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-koala-purple hidden md:block"
                            transition={{ type: 'spring', stiffness: 500, damping: 34 }}
                          />
                        )}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-bold text-sm truncate ${on ? 'text-koala-purple' : 'text-gray-900'}`}>
                            {s.name}
                          </span>
                          <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${on ? 'text-koala-purple' : 'text-gray-300'}`} />
                        </div>
                        <p className="text-xs text-gray-400 truncate mt-1">{s.address}</p>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>

                {filtered.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </motion.div>

              {/* 우측 상세 (데스크톱 전용) */}
              <div className="group hidden md:block sticky top-28 bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_-20px_rgba(62,34,89,0.35)] overflow-hidden min-h-[420px]">
                <AnimatePresence mode="wait">
                  {active && (
                    <motion.div
                      key={active.storeCode}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                      <StoreDetail store={active} reduce={!!reduce} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 모바일 바텀시트 상세 */}
      <AnimatePresence>
        {sheetOpen && active && (
          <div className="md:hidden fixed inset-0 z-[60]">
            <motion.div
              className="absolute inset-0 bg-black/45"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl overflow-hidden max-h-[88vh] flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={reduce ? { duration: 0.2 } : { type: 'spring', stiffness: 340, damping: 34 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={onSheetDragEnd}
            >
              <div className="pt-3 pb-1 flex justify-center shrink-0 cursor-grab active:cursor-grabbing">
                <span className="w-10 h-1.5 rounded-full bg-gray-300" />
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                aria-label="닫기"
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="overflow-y-auto">
                <StoreDetail store={active} reduce={!!reduce} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StoreDetail({ store: s, reduce }: { store: StoreItem; reduce: boolean }) {
  const dy = reduce ? 0 : 1;
  const item = { hidden: { opacity: 0, y: 10 * dy }, show: { opacity: 1, y: 0 } };
  return (
    <div className="flex flex-col">
      {s.imageUrl ? (
        <div className="overflow-hidden">
          <motion.img
            src={s.imageUrl}
            alt={s.name}
            className="w-full h-56 md:h-72 object-cover"
            initial={{ scale: reduce ? 1 : 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-koala-purple/10 to-koala-gold/10 flex items-center justify-center">
          <StoreIcon className="w-10 h-10 text-koala-purple/30" />
        </div>
      )}

      <motion.div
        className="p-6 md:p-8"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } } }}
      >
        <motion.div variants={item} className="flex items-start justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">{s.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            {s.snsUrl && (
              <a
                href={s.snsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SNS"
                className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-koala-purple hover:border-koala-purple transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {s.mapUrl && (
              <a
                href={s.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-koala-purple text-white text-xs md:text-sm font-bold hover:bg-koala-purple-hover transition-colors"
              >
                <MapPin className="w-4 h-4" />
                위치 보기
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>

        {s.description && (
          <motion.p variants={item} className="text-sm md:text-[15px] text-gray-600 leading-relaxed break-keep mt-4">{s.description}</motion.p>
        )}

        <motion.div variants={item} className="mt-6 pt-6 border-t border-gray-100 grid gap-3.5 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
            <span className="text-gray-700 break-keep">
              {s.zipCode && <span className="text-gray-400">({s.zipCode}) </span>}
              {s.address}
              {s.addressDetail && <span> {s.addressDetail}</span>}
            </span>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
            <span className="text-gray-700">
              <a href={`tel:${s.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-koala-purple transition-colors">{s.phone}</a>
              {s.phone2 && (
                <>
                  <span className="text-gray-300 mx-2">|</span>
                  <a href={`tel:${s.phone2.replace(/[^0-9+]/g, '')}`} className="hover:text-koala-purple transition-colors">{s.phone2}</a>
                </>
              )}
            </span>
          </div>
          {s.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-koala-gold-deep mt-0.5 shrink-0" />
              <a href={`mailto:${s.email}`} className="text-gray-700 hover:text-koala-purple transition-colors break-all">{s.email}</a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
