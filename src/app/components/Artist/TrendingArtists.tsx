import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/api/artist';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Artist, PageResponse } from '@/api/types';

interface TrendingArtistsProps {
  excludeArtistCode?: string;
}

export default function TrendingArtists({ excludeArtistCode }: TrendingArtistsProps) {
  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['artists', 'trending'],
    queryFn: async () => {
      const res = await getArtists(0, 20);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const filtered = artists.filter(
    (a) => !excludeArtistCode || a.artistCode !== excludeArtistCode
  );

  if (filtered.length === 0) return null;

  return (
    <section className="mt-20 border-t border-gray-100 pt-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-gray-400">→</span> 인기 작가
        </h2>
        <Link
          to="/artist-lab"
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors"
        >
          작가 전체보기
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-1 px-1 snap-x">
        {filtered.map((artist) => (
          <Link
            key={artist.artistCode}
            to={`/artist/${artist.artistCode}`}
            className="flex-1 min-w-[180px] snap-start group"
          >
            <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-3">
              <ImageWithFallback
                src={artist.profileImageUrl ?? ''}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">{artist.name}</p>
            {artist.bio && (
              <p className="text-xs text-gray-400 truncate mt-0.5">{artist.bio}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
