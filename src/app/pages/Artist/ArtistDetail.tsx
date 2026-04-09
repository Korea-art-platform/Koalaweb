import Navigation from '@/app/components/layouts/Header';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Play, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getArtist } from '@/api/artist';

// ── 유튜브/Vimeo/S3 URL → 임베드 URL 변환 ──────────────
function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  if (url.endsWith('.mp4') || url.endsWith('.webm')) {
    return url;
  }

  return null;
}

// ── 영상 플레이어 컴포넌트 ─────────────────────────────
function VideoPlayer({
  url,
  thumbnail,
  title,
}: {
  url: string;
  thumbnail?: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getVideoEmbedUrl(url);
  const isDirectVideo = url.endsWith('.mp4') || url.endsWith('.webm');

  if (!embedUrl) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gray-900 aspect-video group shadow-2xl">
      {playing ? (
        isDirectVideo ? (
          <video
            src={embedUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          />
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
              <Play
                className="w-6 h-6 md:w-10 md:h-10 text-black ml-1"
                fill="currentColor"
              />
            </div>
          </div>
          {title && (
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <div className="text-white text-xs md:text-sm font-bold">
                {title}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────
export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const artistRes = await getArtist(id!);
        setArtist(artistRes.data.data);
      } catch (e) {
        console.error('아티스트 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 미디어 분류
  const videos = artist?.mediaList?.filter(
    (m: any) => m.mediaType === 'VIDEO'
  ) ?? [];
  const images = artist?.mediaList?.filter(
    (m: any) => m.mediaType === 'IMAGE'
  ) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-6 animate-pulse">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="aspect-[3/4] bg-gray-100 rounded-[3rem]" />
            <div className="space-y-6 pt-8">
              <div className="h-8 bg-gray-100 rounded w-1/4" />
              <div className="h-16 bg-gray-100 rounded w-3/4" />
              <div className="h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-6 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">작가를 찾을 수 없습니다.</h1>
            <Link to="/artist-lab" className="text-sm underline text-gray-500">
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 md:pt-32 pb-24 px-5 md:px-8">
        <div className="max-w-[1600px] mx-auto">

          {/* 상단 컨트롤 바 */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 py-2 text-sm text-gray-500 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <button className="p-2 text-gray-500 md:hidden">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {/* Artist Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 mb-20 md:mb-32">
            {/* Portrait */}
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 aspect-[3/4] shadow-xl">
              <ImageWithFallback
                src={artist.profileImageUrl ?? 'https://via.placeholder.com/400'}
                alt={artist.name}
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-8 md:mb-10">
                <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.3em] uppercase mb-4 font-bold">
                  Artist
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter leading-none">
                  {artist.name}
                </h1>
                <p className="text-base md:text-xl text-gray-600 leading-relaxed break-keep">
                  {artist.description ?? '작가 소개가 없습니다.'}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/smart-store"
                  className="flex-1 py-4 md:py-5 bg-black text-white rounded-full font-bold text-sm md:text-base hover:bg-gray-800 transition-all active:scale-95 text-center"
                >
                  작품 보러가기
                </Link>
                <button className="px-10 py-4 md:py-5 border border-gray-200 rounded-full font-bold text-sm md:text-base hover:bg-gray-50 transition-all hidden sm:block">
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* 인터뷰 영상 섹션 */}
          {videos.length > 0 && (
            <div className="mb-20 md:mb-32">
              <div className="flex items-end justify-between mb-6 md:mb-8 px-1">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight italic">
                  Inside the Studio
                </h2>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Interview
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
          )}

          {/* 갤러리 이미지 섹션 */}
          {images.length > 0 && (
            <div className="mb-20 md:mb-32">
              <div className="flex items-end justify-between mb-6 md:mb-8 px-1">
                <h2 className="text-2xl md:text-4xl font-bold tracking-tight">
                  Gallery
                </h2>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                  Works
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {images.map((image: any) => (
                  <div
                    key={image.id}
                    className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square"
                  >
                    <ImageWithFallback
                      src={image.fileUrl}
                      alt={image.title ?? artist.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    {image.title && (
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs font-bold">
                          {image.title}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}