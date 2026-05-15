import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  title?: string;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex = 0, title = '', onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const goPrev = () => { setZoomed(false); setIndex((i) => (i - 1 + images.length) % images.length); };
  const goNext = () => { setZoomed(false); setIndex((i) => (i + 1) % images.length); };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [index]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (zoomed) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    if (Math.abs(dx) > 50 && dy < 60) dx < 0 ? goNext() : goPrev();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={onClose}>
      {/* 닫기 */}
      <button
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium tabular-nums">
          {index + 1} / {images.length}
        </div>
      )}

      {/* 이전 */}
      {images.length > 1 && (
        <button
          className="absolute left-3 md:left-6 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* 다음 */}
      {images.length > 1 && (
        <button
          className="absolute right-3 md:right-6 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* 이미지 */}
      <div
        className="relative flex items-center justify-center w-full h-full px-16 py-16"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[index]}
          alt={title ? `${title} ${index + 1}` : `이미지 ${index + 1}`}
          className={`max-w-full max-h-full object-contain select-none transition-transform duration-300 ${
            zoomed ? 'scale-[2] cursor-zoom-out' : 'scale-100 cursor-zoom-in'
          }`}
          onClick={() => setZoomed((z) => !z)}
          draggable={false}
        />
      </div>

      {/* 줌 버튼 (데스크탑) */}
      <button
        className="absolute bottom-5 right-5 hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 rounded-full px-3 py-2 text-white/70 text-xs transition-colors"
        onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
      >
        {zoomed ? <><ZoomOut className="w-4 h-4" /> 축소</> : <><ZoomIn className="w-4 h-4" /> 확대</>}
      </button>

      {/* 하단 썸네일 */}
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setZoomed(false); }}
              className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all duration-150 flex-shrink-0 ${
                i === index ? 'border-white opacity-100' : 'border-white/20 opacity-40 hover:opacity-70'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" draggable={false} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
