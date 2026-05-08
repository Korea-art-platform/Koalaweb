import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtistHandsProps {
  title?: string;
  description?: string;
  images?: string[];
}

const PLACEHOLDER = 'https://via.placeholder.com/300x200';

export function ArtistHands({
  title = '작가의 손',
  description = '도구가 아닌\n순서 글쓰기',
  images,
}: ArtistHandsProps) {
  const imgs = images && images.length > 0 ? images : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="md:w-48 flex-shrink-0">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">{description}</p>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-2">
          {imgs.map((src, idx) => (
            <div
              key={idx}
              className={`bg-gray-100 overflow-hidden ${idx === 0 ? 'col-span-2 aspect-[2/1]' : 'aspect-square'}`}
            >
              <ImageWithFallback
                src={src}
                alt={`작가의 손 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
