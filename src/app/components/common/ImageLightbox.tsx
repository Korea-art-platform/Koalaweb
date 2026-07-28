import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

// 슬라이드(스와이프) 방향 애니메이션
const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? 220 : -220, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir >= 0 ? -220 : 220, opacity: 0 }),
};

export function ImageLightbox({ images, initialIndex = 0, title = '', onClose }: ImageLightboxProps) {
  const [[index, direction], setState] = useState<[number, number]>([initialIndex, 0]);

  const paginate = (dir: number) =>
    setState(([i]) => [(i + dir + images.length) % images.length, dir]);

  const goTo = (i: number) => setState(([cur]) => [i, i > cur ? 1 : -1]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') paginate(-1);
      if (e.key === 'ArrowRight') paginate(1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length]);

  const multi = images.length > 1;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 닫기 */}
      <button
        className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
        onClick={onClose}
        aria-label="닫기"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* 카운터 */}
      {multi && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums z-20">
          {index + 1} / {images.length}
        </div>
      )}

      {/* 이전 / 다음 (데스크탑) */}
      {multi && (
        <>
          <button
            className="absolute left-3 md:left-6 z-20 hidden md:flex bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={(e) => { e.stopPropagation(); paginate(-1); }}
            aria-label="이전"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            className="absolute right-3 md:right-6 z-20 hidden md:flex bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
            onClick={(e) => { e.stopPropagation(); paginate(1); }}
            aria-label="다음"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* 이미지 스테이지 — 열릴 때 확대 애니메이션 */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center px-4 md:px-16 py-16 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={images[index]}
            alt={title ? `${title} ${index + 1}` : `이미지 ${index + 1}`}
            className="absolute max-w-full max-h-full object-contain select-none touch-pan-y"
            draggable={false}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            drag={multi ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = offset.x * 0.5 + velocity.x * 0.05;
              if (swipe < -60) paginate(1);
              else if (swipe > 60) paginate(-1);
            }}
          />
        </AnimatePresence>
      </motion.div>

      {/* 하단 썸네일 */}
      {multi && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`${i + 1}번 이미지`}
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
