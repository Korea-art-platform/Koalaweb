import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import VideoPlayer from '@/app/components/common/VideoPlayer';

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
      {/* ── 왼쪽: 프로필 사진 ── */}
      <div className={isReverse ? 'lg:col-start-2' : ''}>
        <Link to={`/artist/${artist.artistCode}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 aspect-[4/5] sm:aspect-[3/4]">
            <ImageWithFallback
              src={artist.profileImageUrl ?? 'https://via.placeholder.com/400'}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </div>

      {/* ── 오른쪽: 정보 + 영상 ── */}
      <div className={isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
        <div className="space-y-5 md:space-y-6">
          {/* 작가 소개 */}
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase mb-2 font-semibold">
              {t('artistLab.row.artistLabel') as string}
            </div>
            <h2 className="text-2xl md:text-4xl mb-3 font-bold">{artist.name}</h2>
            {artist.description && (
              <p className="text-sm md:text-base text-gray-500 leading-relaxed break-keep line-clamp-2">
                {artist.description}
              </p>
            )}
          </div>

          {/* 인터뷰 영상 — 등록된 경우에만 표시 */}
          {anyVideo ? (
            <VideoPlayer
              url={anyVideo.fileUrl}
              thumbnail={anyVideo.thumbnailUrl}
              title={anyVideo.title ?? (t('artistLab.row.interviewTitle', { name: artist.name }) as string)}
            />
          ) : null}

          {/* 팔로워 수 */}
          {followCount > 0 && (
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-900">{followCount.toLocaleString()}</span>
              {' '}
              {t('artistLab.row.collectorsLabel') as string}
            </p>
          )}

          {/* CTA 버튼 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              to={`/artist/${artist.artistCode}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium text-sm"
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
        </div>
      </div>
    </div>
  );
}