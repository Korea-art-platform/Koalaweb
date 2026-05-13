import { useParams } from 'react-router';
import Navigation from '@/app/components/layouts/Header';
import { useArtistDetail } from '@/app/hooks/useArtistDetail';
import { useArtistSkus } from '@/app/hooks/useArtistSkus';
import { ArtistDetailSkeleton, ArtistNotFound } from '@/app/components/Artist';
import {
  ArtistWorldView,
  ArtistProfileSection,
  ArtistCareer,
  ArtistInterview,
  ArtistStudio,
  ArtistHands,
  ArtistWorksCarousel,
} from '@/app/components/ArtistDetail';
import type { WorkItem } from '@/app/components/ArtistDetail';
import { ArtInfo, ArtQnA } from '@/app/components/ArtDetail';

export default function ArtistDetail() {
  const { id } = useParams();
  const { loading, artist, interviewVideo, interviewImage, studioImages, handsImages } = useArtistDetail(id);
  const { skus } = useArtistSkus(artist?.artistCode);

  if (loading) return <ArtistDetailSkeleton />;
  if (!artist) return <ArtistNotFound />;

  const works: WorkItem[] = skus.map((sku) => ({
    id: sku.skuCode,
    title: sku.name,
    imageUrl: sku.primaryImageUrl ?? 'https://via.placeholder.com/280x350',
    price: sku.salePrice ?? sku.listPrice,
  }));

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-24 px-5 md:px-8 max-w-2xl mx-auto w-full">
        <ArtistWorldView
          breadcrumb="작가 소개"
          worldViewTitle={`${artist.name}의 세계관`}
          worldViewDesc={artist.description ?? ''}
        />

        <ArtistProfileSection
          name={artist.name}
          description={artist.description}
          profileImageUrl={artist.profileImageUrl}
          artistCode={artist.artistCode}
          followCount={artist.followCount ?? 0}
          isFollowing={artist.isFollowing ?? false}
        />

        {artist.artistNote && (
          <section className="mb-16">
            <h3 className="text-lg font-semibold mb-4">작가 노트</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {artist.artistNote}
            </p>
          </section>
        )}

        <ArtistCareer items={artist.careerList} />

        <ArtistInterview
          videoUrl={interviewVideo?.fileUrl}
          thumbnailUrl={interviewImage?.fileUrl}
        />

        <ArtistStudio
          studioImages={studioImages.map((m) => m.fileUrl)}
          artistName={artist.name}
        />

        <ArtistHands images={handsImages.map((m) => m.fileUrl)} />

        <ArtistWorksCarousel works={works} artistId={id} />

        <div className="mt-20 border-t border-gray-100 pt-16">
          <ArtInfo
            items={[
              { label: '전공', value: artist.specialty ?? '-' },
              { label: '활동', value: '-' },
              { label: '소속', value: '-' },
              { label: '연락처', value: '-' },
            ]}
          />
          <ArtQnA />
        </div>
      </main>
    </div>
  );
}
