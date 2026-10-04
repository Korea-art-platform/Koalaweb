import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const STEP = 0.5;
const clamp = (v: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));

const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 220 : -220, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -220 : 220, opacity: 0 }),
};

export function ImageLightbox({ images, initialIndex = 0, title = '', onClose }: ImageLightboxProps) {
  const { t } = useTranslation();
  const [[index, direction], setState] = useState<[number, number]>([initialIndex, 0]);
  const [scale, setScale] = useState(1);

  const stageRef = useRef<HTMLDivElement>(null);
  // 휠·핀치는 리액트 밖(네이티브 리스너)에서 받아 지금 배율을 참조해야 한다
  const scaleRef = useRef(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const zoomed = scale > 1;
  const multi = images.length > 1;

  const zoomTo = (v: number) => {
    const next = clamp(v);
    // 원래 크기로 돌아오면 움직여 둔 위치도 가운데로
    if (next === MIN_SCALE) { x.set(0); y.set(0); }
    scaleRef.current = next;
    setScale(next);
  };

  const paginate = (dir: number) => {
    zoomTo(MIN_SCALE);
    setState(([i]) => [(i + dir + images.length) % images.length, dir]);
  };

  const goTo = (i: number) => {
    zoomTo(MIN_SCALE);
    setState(([cur]) => [i, i > cur ? 1 : -1]);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // 확대 중에는 좌우 키로 사진을 넘기지 않는다 — 보던 자리를 잃는다
      if (e.key === 'ArrowLeft' && scaleRef.current === MIN_SCALE) paginate(-1);
      if (e.key === 'ArrowRight' && scaleRef.current === MIN_SCALE) paginate(1);
      if (e.key === '+' || e.key === '=') zoomTo(scaleRef.current + STEP);
      if (e.key === '-' || e.key === '_') zoomTo(scaleRef.current - STEP);
      if (e.key === '0') zoomTo(MIN_SCALE);
    };
    // 뒤 화면이 같이 스크롤되지 않게. 팝업 위에서 열 수도 있어 원래 값으로 되돌린다
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [images.length]);

  // 휠과 두 손가락 벌리기 — 리액트 핸들러는 기본 동작을 막지 못해 직접 건다
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const spread = (touches: TouchList) =>
      Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);
    let startSpread = 0;
    let startScale = 1;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTo(scaleRef.current + (e.deltaY < 0 ? STEP : -STEP));
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        startSpread = spread(e.touches);
        startScale = scaleRef.current;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && startSpread > 0) {
        e.preventDefault();
        zoomTo(startScale * (spread(e.touches) / startSpread));
      }
    };
    const onTouchEnd = () => { startSpread = 0; };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <button
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
        onClick={onClose}
        aria-label={t('common.close')}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {multi && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums z-20">
          {index + 1} / {images.length}
        </div>
      )}

      {/* 확대 중에는 좌우 넘김 화살표를 숨긴다 — 사진을 움직이는 중이다 */}
      {multi && !zoomed && (
        <>
          <button
            className="absolute left-3 md:left-6 z-20 hidden md:flex bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            aria-label={t('common.prev')}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-3 md:right-6 z-20 hidden md:flex bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            aria-label={t('common.next')}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      <motion.div
        ref={stageRef}
        className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-16 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.img
              src={images[index]}
              alt={title ? `${title} ${index + 1}` : t('common.imageN', { n: index + 1 })}
              className={`max-w-full max-h-full object-contain select-none
                ${zoomed ? 'cursor-grab active:cursor-grabbing touch-none' : 'cursor-zoom-in touch-pan-y'}`}
              draggable={false}
              style={{ x, y }}
              animate={{ scale }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onDoubleClick={() => zoomTo(zoomed ? MIN_SCALE : 2.5)}
              drag={zoomed || multi}
              dragConstraints={zoomed ? stageRef : { left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={zoomed ? 0.05 : 0.6}
              onDragEnd={(_e, { offset, velocity }) => {
                // 확대 중 끌기는 사진 안을 움직이는 것이다 — 넘기지 않는다
                if (zoomed || !multi) return;
                const swipe = offset.x * 0.5 + velocity.x * 0.05;
                if (swipe < -60) paginate(1);
                else if (swipe > 60) paginate(-1);
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* 확대 단추 — 사진 목록이 있으면 그 위에 둔다 */}
      <div
        className={`absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-sm
          ${multi ? 'bottom-20' : 'bottom-5'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => zoomTo(scale - STEP)}
          disabled={scale <= MIN_SCALE}
          aria-label={t('common.zoomOut', { defaultValue: '축소' }) as string}
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="w-12 text-center text-xs tabular-nums text-white/70">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => zoomTo(scale + STEP)}
          disabled={scale >= MAX_SCALE}
          aria-label={t('common.zoomIn', { defaultValue: '확대' }) as string}
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={() => zoomTo(MIN_SCALE)}
          disabled={!zoomed}
          aria-label={t('common.zoomReset', { defaultValue: '원래 크기로' }) as string}
          className="rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
      </div>

      {multi && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={t('product.card.imageN', { n: i + 1 })}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                i === index ? 'border-white opacity-100' : 'border-white/20 opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
