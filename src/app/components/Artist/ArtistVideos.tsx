import { useState } from 'react';
import { Play } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  if (url.endsWith('.mp4') || url.endsWith('.webm')) return url;
  return null;
}

function VideoPlayer({ url, thumbnail, title }: { url: string; thumbnail?: string; title?: string }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getVideoEmbedUrl(url);
  const isDirectVideo = url.endsWith('.mp4') || url.endsWith('.webm');

  if (!embedUrl) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 aspect-video group shadow-2xl">
      {playing ? (
        isDirectVideo ? (
          <video src={embedUrl} controls autoPlay className="w-full h-full object-cover" />
        ) : (
          <iframe
            src={`${embedUrl}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : (
        <>
          <ImageWithFallback
            src={thumbnail ?? 'https://via.placeholder.com/800x450'}
            alt={title ?? ''}
            className="w-full h-full object-cover opacity-80"
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center shadow-2xl transform transition-transform group-hover:scale-110">
              <Play className="w-6 h-6 md:w-10 md:h-10 text-black ml-1" fill="currentColor" />
            </div>
          </div>
          {title && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <div className="text-white text-xs md:text-sm font-bold">{title}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface ArtistVideosProps {
  videos: any[];
}

export function ArtistVideos({ videos }: ArtistVideosProps) {
  const { t } = useTranslation('artistLab'); // 🌟 네임스페이스 지정

  if (!videos || videos.length === 0) return null;

  return (
    <div className="mb-20 md:mb-32">
      <div className="flex items-end justify-between mb-6 md:mb-8 px-1">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight italic">
          {t('detail.titles.insideStudio')}
        </h2>
        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          {t('detail.labels.interview')}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((video: any) => (
          <VideoPlayer
            key={video.id}
            url={video.fileUrl}
            thumbnail={video.thumbnailUrl}
            title={video.title}
          />
        ))}
      </div>
    </div>
  );
}