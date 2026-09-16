import { useState } from 'react';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { videoEmbedUrl, directVideoUrl } from '@/app/lib/videoEmbed';

export default function VideoPlayer({
  url,
  thumbnail,
  title,
}: {
  url: string;
  thumbnail?: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const { t } = useTranslation();

  const embedUrl = videoEmbedUrl(url);
  const directUrl = embedUrl ? null : directVideoUrl(url);
  const isDirectVideo = directUrl !== null;
  const playSrc = embedUrl ?? directUrl;

  if (!playSrc) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video group cursor-pointer">
      {playing ? (
        isDirectVideo ? (
          <video
            src={playSrc}
            controls
            autoPlay
            className="w-full h-full object-cover" />
        ) : (
          <iframe
            src={`${playSrc}?autoplay=1`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen/>
        )
      ) : (
        <>
          <ImageWithFallback
            src={thumbnail ?? '/placeholder.svg'}
            alt={title ?? ''}
            className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105" />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={() => setPlaying(true)} >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
              <Play className="w-5 h-5 md:w-6 md:h-6 text-black ml-1" fill="currentColor" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white text-xs md:text-sm font-bold mb-0.5">
              {title ?? (t('common.video.defaultTitle') as string)}
            </div>
            <div className="text-[10px] md:text-xs text-gray-300">
              {t('common.video.clickToPlay') as string}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
