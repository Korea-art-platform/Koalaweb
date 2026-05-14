import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtImagesProps {
  images?: string[];
  title?: string;
}

export function ArtImages({ images, title = '작품' }: ArtImagesProps) {
  if (!images || images.length === 0) return null;

  const [first, second, third, ...rest] = images;

  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-4">작품 - 상세</p>

      {/* 1장: 전체 너비 정사각 */}
      {images.length === 1 && (
        <div className="w-full aspect-square bg-gray-100 overflow-hidden">
          <ImageWithFallback src={first} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* 2장 이상: 왼쪽 세로 큰 이미지 + 오른쪽 최대 2장 세로 배치 */}
      {images.length >= 2 && (
        <>
          <div className="grid grid-cols-2 gap-2">
            {/* 왼쪽: 세로 긴 이미지 */}
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
              <ImageWithFallback
                src={first}
                alt={`${title} 1`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 오른쪽: 1~2장 세로 배치 */}
            <div className="flex flex-col gap-2">
              <div className="flex-1 min-h-0 bg-gray-100 overflow-hidden">
                <ImageWithFallback
                  src={second}
                  alt={`${title} 2`}
                  className="w-full h-full object-cover"
                />
              </div>
              {third && (
                <div className="flex-1 min-h-0 bg-gray-100 overflow-hidden">
                  <ImageWithFallback
                    src={third}
                    alt={`${title} 3`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 4장 이상: 나머지 이미지 한 장씩 전체 너비 */}
          {rest.map((src, idx) => (
            <div key={idx} className="w-full aspect-square bg-gray-100 overflow-hidden mt-2">
              <ImageWithFallback
                src={src}
                alt={`${title} ${idx + 4}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </>
      )}
    </section>
  );
}
