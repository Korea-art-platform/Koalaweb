import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Phone, X } from 'lucide-react';
import { usePastHero } from '@/app/components/layouts/RisingPanel';

export default function QuickMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 히어로 위에는 띄우지 않는다. 첫 화면의 인상을 만드는 자리라
  // 그 위에 떠다니는 버튼이 없는 편이 낫다.
  const past = usePastHero();

  // 펼친 채로 히어로로 되돌아가면 메뉴만 남아 떠 있다. 접어 둔다.
  useEffect(() => {
    if (!past) setOpen(false);
  }, [past]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const itemClass =
    `flex items-center gap-3 pl-3 pr-4 h-11 rounded-full bg-white border border-gray-200
     shadow-[0_6px_18px_rgba(0,0,0,.1)] text-sm font-semibold text-gray-700
     hover:border-koala-purple hover:text-koala-purple transition-colors
     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koala-purple`;

  const iconClass = 'w-7 h-7 rounded-full bg-koala-navy/5 text-koala-purple flex items-center justify-center';

  return (
    <div
      ref={wrapRef}
      aria-hidden={!past}
      className={`fixed z-40 bottom-6 right-6 flex flex-col items-end gap-2
        transition-[opacity,transform] duration-300 motion-reduce:transition-none ${
        past ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="flex flex-col items-end gap-2"
          >
            <Link to="/account/inquiry" className={itemClass} onClick={() => setOpen(false)}>
              <span className={iconClass}><MessageCircle className="w-4 h-4" /></span>
              1:1 문의
            </Link>
            <a href="tel:18332817" className={itemClass} onClick={() => setOpen(false)}>
              <span className={iconClass}><Phone className="w-4 h-4" /></span>
              전화 상담
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        tabIndex={past ? 0 : -1}
        aria-expanded={open}
        aria-label={open ? '고객지원 닫기' : '고객지원 열기'}
        className="w-12 h-12 rounded-full bg-white border border-gray-200
          shadow-[0_8px_24px_rgba(62,34,89,.18)] flex items-center justify-center
          transition-transform hover:scale-105 active:scale-95
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koala-purple"
      >
        {open ? (
          <X className="w-5 h-5 text-gray-500" />
        ) : (
          <img src="/logo-symbol.svg" alt="" aria-hidden className="w-7 h-7" />
        )}
      </button>
    </div>
  );
}
