import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
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
import { ArtQnA } from '@/app/components/ArtDetail';

export default function ArtistDetail() {
  const { id } = useParams();
  const { loading, artist, interviewVideo, interviewImage, studioImages, handsImages, isFollowing } = useArtistDetail(id);
  const { skus } = useArtistSkus(artist?.artistCode);

  if (loading) return <ArtistDetailSkeleton />;
  if (!artist) return <ArtistNotFound />;

  const works: WorkItem[] = skus.map((sku) => ({
    id: sku.skuCode,
    title: sku.name,
    imageUrl: sku.primaryImageUrl ?? '/placeholder.svg',
    price: sku.salePrice ?? sku.listPrice,
  }));

  const artistDescription = artist.description
    ? artist.description.slice(0, 155) + (artist.description.length > 155 ? '…' : '')
    : `${artist.name} 작가의 작품을 KOALA에서 만나보세요.`;
  const artistImage = artist.profileImageUrl ?? 'https://koala-art.co.kr/og-image.svg';
  const artistUrl = `https://koala-art.co.kr/artists/${artist.artistCode}`;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{artist.name} 작가 — KOALA</title>
        <meta name="description" content={artistDescription} />
        <link rel="canonical" href={artistUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={`${artist.name} 작가 — KOALA`} />
        <meta property="og:description" content={artistDescription} />
        <meta property="og:image" content={artistImage} />
        <meta property="og:image:width" content="800" />
        <meta property="og:image:height" content="800" />
        <meta property="og:url" content={artistUrl} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${artist.name} 작가 — KOALA`} />
        <meta name="twitter:description" content={artistDescription} />
        <meta name="twitter:image" content={artistImage} />
      </Helmet>

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
          isFollowing={isFollowing}
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
          <ArtQnA />
        </div>
      </main>
    </div>
  );
}
