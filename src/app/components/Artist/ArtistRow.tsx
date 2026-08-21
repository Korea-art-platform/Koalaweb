import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import VideoPlayer from '@/app/components/common/VideoPlayer';

const fmt = (n: number) => n.toLocaleString('ko-KR');

interface ArtistRowProps {
  artist: any;
  index: number;
}

export default function ArtistRow({ artist, index }: ArtistRowProps) {
  const { t } = useTranslation();

  const interviewVideo = artist.mediaList?.find(
    (m: any) => m.mediaRole === 'INTERVIEW_VIDEO'
  );
  const anyVideo = interviewVideo ?? artist.mediaList?.find((m: any) => m.mediaType === 'VIDEO');

  const followCount: number = artist.followCount ?? 0;
  const isReverse = index % 2 === 1;

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start
        ${isReverse ? 'lg:grid-flow-dense' : ''}`}
    >
      <div className={isReverse ? 'lg:col-start-2' : ''}>
        <Link to={`/artist/${artist.artistCode}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 aspect-[4/5] sm:aspect-[3/4]">
            <ImageWithFallback
              src={artist.profileImageUrl ?? '/placeholder.svg'}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </div>
      <div className={isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
        <div className="space-y-5 md:space-y-6">
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase mb-2 font-semibold">
              {t('artistLab.row.artistLabel') as string}
            </div>
            <h2 className="text-2xl md:text-4xl mb-3 font-bold">{artist.name}</h2>
            {artist.description && (
              <p className="text-base md:text-lg text-gray-500 leading-relaxed break-keep line-clamp-3">
                {artist.description}
              </p>
            )}
          </div>

          {anyVideo ? (
            <VideoPlayer
              url={anyVideo.fileUrl}
              thumbnail={anyVideo.thumbnailUrl}
              title={anyVideo.title ?? (t('artistLab.row.interviewTitle', { name: artist.name }) as string)}
            />
          ) : null}

          {followCount > 0 && (
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{followCount.toLocaleString()}</span>
              {' '}
              {t('artistLab.row.collectorsLabel') as string}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              to={`/artist/${artist.artistCode}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-koala-navy text-white rounded-full hover:bg-koala-navy-hover transition-all font-medium text-sm"
            >
              {t('artistLab.row.viewProfile') as string}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={`/artist/${artist.artistCode}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-medium text-sm"
            >
              {t('artistLab.row.startCollecting') as string}
            </Link>
          </div>

          {artist.featuredSku && (
            <Link
              to={`/product/${artist.featuredSku.skuCode}`}
              className="group relative block border border-gray-200 rounded-2xl overflow-hidden hover:border-koala-purple/40 transition-colors mt-2"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-[58%] translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{
                  background: 'linear-gradient(115deg, #3E2259 0%, #533274 44%, #7c5a86 70%, #b58f4e 100%)',
                  clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)',
                }}
              />
              <div className="relative z-10 flex items-center gap-5 p-4">
                <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={artist.featuredSku.imageUrl ?? ''}
                    alt={artist.featuredSku.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">대표 작품</p>
                  <p className="text-base font-semibold text-gray-900 truncate">{artist.featuredSku.name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {artist.featuredSku.salePrice ? (
                      <>
                        <span className="text-base font-bold text-koala-red">₩{fmt(artist.featuredSku.salePrice)}</span>
                        <span className="text-sm text-gray-400 line-through">₩{fmt(artist.featuredSku.listPrice)}</span>
                      </>
                    ) : (
                      <span className="text-base font-bold text-gray-900">₩{fmt(artist.featuredSku.listPrice)}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 transition-colors duration-500 group-hover:text-white flex-shrink-0" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
