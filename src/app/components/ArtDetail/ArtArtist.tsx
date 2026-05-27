import { Link } from 'react-router';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

interface ArtArtistProps {
  artistCode?: string;
  artistName?: string;
  artistDescription?: string;
  artistImageUrl?: string;
}

export function ArtArtist({
  artistCode,
  artistName = '작가 이름',
  artistDescription = '작가에 대한 설명',
  artistImageUrl,
}: ArtArtistProps) {
  const inner = (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <div className="w-full md:w-56 flex-shrink-0 aspect-[3/4] bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={artistImageUrl ?? 'https://via.placeholder.com/224x300'}
          alt={artistName}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold mb-2">{artistName}</h3>
        <p className="text-sm text-gray-500 leading-relaxed break-keep">{artistDescription}</p>
      </div>
    </div>
  );

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold text-gray-400 mb-6">작가 - ARTIST</h2>
      {artistCode ? (
        <Link to={`/artist/${artistCode}`} className="block hover:opacity-90 transition-opacity">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </section>
  );
}
