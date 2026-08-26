import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import type { Artist } from '@/api/types';

interface Props {
  artists: Artist[];
}

export default function HomeArtists({ artists }: Props) {
  if (artists.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 md:py-24">
      <SectionHeader
        eyebrow="004 — Artists"
        title="작가"
        sub="작품을 만드는 사람들"
        viewAllHref="/artist-lab"
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 lg:grid-cols-5 lg:gap-x-6">
        {artists.map((artist) => (
          <Link
            key={artist.artistCode}
            to={`/artist/${artist.artistCode}`}
            className="group block"
          >
            <div className="relative overflow-hidden bg-gray-100 aspect-[3/4]">
              <ImageWithFallback
                src={artist.profileImageUrl ?? '/placeholder.svg'}
                alt={artist.name}
                thumb
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="text-base md:text-lg font-bold text-white tracking-tight">
                  {artist.name}
                </p>
                {artist.specialty && (
                  <p className="mt-0.5 text-[11px] md:text-xs text-white/70 truncate">
                    {artist.specialty}
                  </p>
                )}
              </div>

              <span
                aria-hidden
                className="pointer-events-none absolute right-4 top-4 flex h-8 w-8 items-center justify-center
                  bg-koala-gold text-koala-navy opacity-0 translate-y-1
                  transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
              >
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
