import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import Navigation from '@/app/components/layouts/Header';
import { useArtistDetail } from '@/app/hooks/useArtistDetail';
import { useArtistSkus } from '@/app/hooks/useArtistSkus';
import { ArtistDetailSkeleton, ArtistNotFound } from '@/app/components/Artist';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';

export default function ArtistWorks() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loading: artistLoading, artist } = useArtistDetail(id);
  const { skus, isLoading: skusLoading } = useArtistSkus(artist?.artistCode);

  if (artistLoading) return <ArtistDetailSkeleton />;
  if (!artist) return <ArtistNotFound />;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-24 px-5 md:px-8 max-w-2xl mx-auto w-full">
        <button
          onClick={() => navigate(`/artist/${id}`)}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          작가 페이지로
        </button>

        {/* 작가 요약 */}
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            <ImageWithFallback
              src={artist.profileImageUrl ?? '/placeholder.svg'}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-gray-400 tracking-widest uppercase mb-0.5">ARTIST</p>
            <h1 className="text-lg font-bold">{artist.name}</h1>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">
          작가의 작품 - Works
          {!skusLoading && (
            <span className="text-sm font-normal text-gray-400 ml-2">({skus.length})</span>
          )}
        </h2>

        {skusLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded mb-2" />
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : skus.length === 0 ? (
          <div className="py-20 text-center text-gray-400 text-sm">등록된 작품이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8">
            {skus.map((sku) => (
              <Link key={sku.skuCode} to={`/art/${sku.skuCode}`} className="group block">
                <div className="aspect-square bg-gray-100 overflow-hidden mb-3">
                  <ImageWithFallback
                    src={sku.primaryImageUrl ?? '/placeholder.svg'}
                    alt={sku.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{sku.genre}</p>
                <p className="text-sm font-semibold truncate group-hover:text-gray-600 transition-colors">
                  {sku.name}
                </p>
                <p className="text-sm font-bold mt-1">
                  ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
