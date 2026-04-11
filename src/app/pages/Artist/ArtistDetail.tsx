import { useParams } from 'react-router';
import Navigation from '@/app/components/layouts/Header';
import { useArtistDetail } from '@/app/hooks/useArtistDetail';
import { ArtistDetailSkeleton } from '@/app/components/Artist';
import { ArtistNotFound } from '@/app/components/Artist';
import { ArtistHero } from '@/app/components/Artist';
import { ArtistVideos } from '@/app/components/Artist';
import { ArtistGallery } from '@/app/components/Artist';

export default function ArtistDetail() {
  const { id } = useParams();
  const { loading, artist, videos, images } = useArtistDetail(id);

  if (loading) return <ArtistDetailSkeleton />;
  if (!artist) return <ArtistNotFound />;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 md:pt-32 pb-24 px-5 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          
          <ArtistHero artist={artist} />
          
          <ArtistVideos videos={videos} />
          
          <ArtistGallery images={images} artistName={artist.name} />

        </div>
      </main>
    </div>
  );
}