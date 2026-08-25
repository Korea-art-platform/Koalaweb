import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Headset,
  HelpCircle,
  MessageCircle,
  Phone,
  RotateCcw,
  Truck,
  X,
} from 'lucide-react';

type Item = {
  id: string;
  label: string;
  hint: string;
  icon: typeof Phone;
  to?: string;
  href?: string;
  action?: () => void;
};

const ITEMS: Item[] = [
  { id: 'inquiry', label: '1:1 문의', hint: '문의를 남기면 답변해 드립니다', icon: MessageCircle, to: '/account/inquiry' },
  { id: 'call', label: '전화 상담', hint: '1833-2817', icon: Phone, href: 'tel:18332817' },
  { id: 'faq', label: '자주 묻는 질문', hint: '가장 많이 묻는 것들', icon: HelpCircle, to: '/faq' },
  { id: 'shipping', label: '배송 안내', hint: '배송비와 소요 기간', icon: Truck, to: '/shipping' },
  { id: 'returns', label: '교환 · 반품', hint: '신청 방법과 기간', icon: RotateCcw, to: '/returns' },
  { id: 'top', label: '맨 위로', hint: '페이지 처음으로', icon: ArrowUp, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
];

const STEP = 360 / ITEMS.length;

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export default function QuickMenu() {
  const [open, setOpen] = useState(false);
  const [turn, setTurn] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const index = ((turn % ITEMS.length) + ITEMS.length) % ITEMS.length;
  const current = ITEMS[index];

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') setTurn((t) => t - 1);
      if (e.key === 'ArrowRight') setTurn((t) => t + 1);
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const spin = reduced ? 'none' : 'transform .55s cubic-bezier(.22,.68,.32,1)';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? '퀵메뉴 닫기' : '퀵메뉴 열기'}
        className="fixed z-40 bottom-6 right-6 w-14 h-14 rounded-full bg-koala-navy text-white
          shadow-[0_10px_30px_rgba(62,34,89,.35)] ring-2 ring-koala-gold/70
          flex items-center justify-center transition-transform hover:scale-105
          focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-koala-gold"
      >
        {open ? <X className="w-6 h-6" /> : <Headset className="w-6 h-6" />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-30 bg-black/45 backdrop-blur-[2px]"
            />

            <motion.div
              ref={panelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="퀵메뉴"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 24 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 16 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              className="fixed z-40 inset-x-0 bottom-24 mx-auto w-[21rem] h-[21rem] [--qm-r:6.9rem]
                sm:right-6 sm:left-auto sm:mx-0 sm:w-[26rem] sm:h-[26rem] sm:[--qm-r:8.7rem]
                focus:outline-none"
            >
              <div className="absolute inset-0 rounded-full bg-white/95 backdrop-blur
                border border-koala-gold/40 shadow-[0_24px_70px_rgba(0,0,0,.28)]" />
              <div className="absolute inset-[14%] rounded-full border border-dashed border-koala-gold/35" />

              <div
                className="absolute inset-0"
                style={{ transform: `rotate(${-turn * STEP}deg)`, transition: spin }}
              >
                {ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  const active = i === index;
                  const inner = (
                    <span
                      className="flex flex-col items-center gap-1"
                      style={{ transform: `rotate(${turn * STEP - i * STEP}deg)`, transition: spin }}
                    >
                      <span
                        className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                          border transition-colors ${
                            active
                              ? 'bg-koala-navy text-white border-koala-gold'
                              : 'bg-white text-gray-500 border-gray-200 group-hover:border-koala-gold group-hover:text-koala-purple'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <span
                        className={`text-[11px] whitespace-nowrap font-medium transition-colors ${
                          active ? 'text-koala-purple' : 'text-gray-400'
                        }`}
                      >
                        {item.label}
                      </span>
                    </span>
                  );

                  const cls =
                    'group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none';
                  const style = {
                    transform: `rotate(${i * STEP}deg) translateY(calc(-1 * var(--qm-r)))`,
                    transition: spin,
                  } as const;

                  const onPick = () => {
                    item.action?.();
                    close();
                  };

                  if (item.to) {
                    return (
                      <Link key={item.id} to={item.to} className={cls} style={style} onClick={close}>
                        {inner}
                      </Link>
                    );
                  }
                  if (item.href) {
                    return (
                      <a key={item.id} href={item.href} className={cls} style={style} onClick={close}>
                        {inner}
                      </a>
                    );
                  }
                  return (
                    <button key={item.id} type="button" className={cls} style={style} onClick={onPick}>
                      {inner}
                    </button>
                  );
                })}
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-24 sm:w-28">
                <p className="text-[10px] tracking-[.2em] text-koala-gold font-semibold mb-1">고객지원</p>
                <p className="text-base font-bold text-gray-900 leading-tight">{current.label}</p>
                <p className="text-[11px] text-gray-400 mt-1 leading-snug break-keep">{current.hint}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    type="button"
                    aria-label="이전 항목"
                    onClick={() => setTurn((t) => t - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-koala-gold/25 text-gray-600
                      flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="다음 항목"
                    onClick={() => setTurn((t) => t + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-koala-gold/25 text-gray-600
                      flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
