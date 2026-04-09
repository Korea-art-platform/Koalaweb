import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import VideoPlayer from '@/app/components/common/VideoPlayer';

interface ArtistRowProps {
  artist: any;
  index: number;
}
export default function ArtistRow({ artist, index }: ArtistRowProps) {
  const { t } = useTranslation();

  const interviewVideo = artist.mediaList?.find(
    (m: any) => m.mediaType === 'VIDEO' && m.mediaRole === 'INTERVIEW_VIDEO'
  );
  const anyVideo = interviewVideo ?? artist.mediaList?.find((m: any) => m.mediaType === 'VIDEO');
  
  const isReverse = index % 2 === 1;

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start ${isReverse ? 'lg:grid-flow-dense' : ''}`}>
      <div className={isReverse ? 'lg:col-start-2' : ''}>
        <Link to={`/artist/${artist.artistCode}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 aspect-[4/5] sm:aspect-[3/4]">
            <ImageWithFallback
              src={artist.profileImageUrl ?? 'https://via.placeholder.com/400'}
              alt={artist.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>
      </div>

      <div className={isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}>
        <div className="space-y-6 md:space-y-8">
          <div>
            <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase mb-2 md:mb-3 font-semibold">
              {t('artistLab.row.artistLabel') as string}
            </div>
            <h2 className="text-2xl md:text-4xl mb-3 md:mb-4 font-bold">{artist.name}</h2>
            <p className="text-sm md:text-lg text-gray-500 leading-relaxed break-keep">
              {artist.description ?? (t('artistLab.row.noDescription') as string)}
            </p>
          </div>

          {anyVideo && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">
                {t('artistLab.row.interviewLabel') as string}
              </p>
              <VideoPlayer
                url={anyVideo.fileUrl}
                thumbnail={anyVideo.thumbnailUrl}
                title={anyVideo.title ?? (t('artistLab.row.interviewTitle', { name: artist.name }) as string)}/>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              to={`/artist/${artist.artistCode}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium text-sm" >
              {t('artistLab.row.viewProfile') as string}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-medium text-sm">
              {t('artistLab.row.startCollecting') as string}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}