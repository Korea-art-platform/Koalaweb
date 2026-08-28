import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import ArtistLabHero from '@/app/components/Hero/ArtistLabHero';
import ArtistListSkeleton from '@/app/components/Artist/ArtistListSkeleton';
import ArtistRow from '@/app/components/Artist/ArtistRow';
import { getArtists } from '@/api/artist';
import type { Artist, PageResponse } from '@/api/types';
import PageMeta from '@/app/components/common/PageMeta';

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
      <PageMeta title="작가의 연구소" description="한국 현대미술 작가들의 작품 세계와 창작 여정을 소개합니다." />
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
