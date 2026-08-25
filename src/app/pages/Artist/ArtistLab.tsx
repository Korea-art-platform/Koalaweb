import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import ArtistLabHero from '@/app/components/Hero/ArtistLabHero';
import ArtistListSkeleton from '@/app/components/Artist/ArtistListSkeleton';
import ArtistRow from '@/app/components/Artist/ArtistRow';
import { getArtists } from '@/api/artist';
import type { Artist, PageResponse } from '@/api/types';

export default function ArtistLab() {
  const { t } = useTranslation();

  const { data: artists = [], isLoading: loading } = useQuery<Artist[]>({
    queryKey: ['artists'],
    queryFn: async () => {
      const res = await getArtists(0, 20);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    retry: false,
  });

  return (
    <div className="min-h-screen bg-white">
      <ArtistLabHero />
      <section className="px-6 md:px-8 pb-32">
        <div className="max-w-[1600px] mx-auto space-y-20 md:space-y-32">
          {loading ? (
            <ArtistListSkeleton count={3} />
          ) : artists.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">
                {t('artistLab.emptyState.title') as string}
              </p>
            </div>
          ) : (
            artists.map((artist, index) => (
              <ArtistRow key={artist.artistCode} artist={artist} index={index} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
