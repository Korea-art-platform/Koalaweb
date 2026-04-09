import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navigation from '@/app/components/layouts/Header';
import ArtistLabHero from '@/app/components/Hero/ArtistLabHero';
import ArtistListSkeleton from '@/app/components/Artist/ArtistListSkeleton';
import ArtistRow from '@/app/components/Artist/ArtistRow';
import { getArtists } from '@/api/artist';

export default function ArtistLab() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getArtists(0, 20);
        setArtists(res.data.data.content ?? []);
      } catch (e) {
        console.error('아티스트 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
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