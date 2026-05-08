import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtistProfileSectionProps {
  name: string;
  description?: string;
  profileImageUrl?: string;
}

export function ArtistProfileSection({ name, description, profileImageUrl }: ArtistProfileSectionProps) {
  return (
    <section className="mb-16">
      <p className="text-xs text-gray-400 tracking-widest uppercase mb-6">작가 - ARTIST</p>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-64 flex-shrink-0 aspect-[3/4] bg-gray-100 overflow-hidden">
          <ImageWithFallback
            src={profileImageUrl ?? 'https://via.placeholder.com/300x400'}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed break-keep">
            {description ?? '작가에 대한 설명'}
          </p>
        </div>
      </div>
    </section>
  );
}
