import Navigation from '../../components/layouts/Header';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { getArtists } from '../../../api/artist';

// ── 영상 플레이어 컴포넌트 ─────────────────────────────
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
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-video group cursor-pointer">
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
            className="w-full h-full object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
          />
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30"
            onClick={() => setPlaying(true)}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transform transition-transform group-hover:scale-110">
              <Play
                className="w-5 h-5 md:w-6 md:h-6 text-black ml-1"
                fill="currentColor"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <div className="text-white text-xs md:text-sm font-bold mb-0.5">
              {title ?? '스튜디오 인터뷰 영상'}
            </div>
            <div className="text-[10px] md:text-xs text-gray-300">
              클릭하여 재생
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── 메인 컴포넌트 ──────────────────────────────────────
export default function ArtistLab() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await getArtists(0, 20);
        setArtists(res.data.data.content ?? []);
      } catch (e) {
        console.error('아티스트 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 md:px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-[10px] md:text-sm text-gray-400 tracking-[0.2em] mb-3 md:mb-4 uppercase font-bold">
              작가의 연구실
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl mb-2 md:mb-4 tracking-tight font-bold leading-[1.2]">
              작품 뒤에 숨겨진 이야기
            </h1>
            <h1 className="text-3xl sm:text-4xl md:text-6xl mb-6 tracking-tight font-bold leading-[1.2]">
              연구실에서 만나다
            </h1>
            <p className="text-sm md:text-xl text-gray-500 leading-relaxed max-w-lg break-keep">
              한국 현대미술의 선구자들이 펼치는 창조적 여정과 영감을 경험하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="px-6 md:px-8 pb-32">
        <div className="max-w-[1600px] mx-auto space-y-20 md:space-y-32">

          {/* 로딩 스켈레톤 */}
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 animate-pulse">
                <div className="aspect-[4/5] bg-gray-100 rounded-3xl" />
                <div className="space-y-4 pt-8">
                  <div className="h-6 bg-gray-100 rounded w-1/4" />
                  <div className="h-10 bg-gray-100 rounded w-3/4" />
                  <div className="h-20 bg-gray-100 rounded" />
                  <div className="aspect-video bg-gray-100 rounded-2xl mt-6" />
                </div>
              </div>
            ))
          ) : artists.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">등록된 아티스트가 없습니다.</p>
            </div>
          ) : (
            artists.map((artist, index) => {
              // 인터뷰 영상만 추출
              const interviewVideo = artist.mediaList?.find(
                (m: any) => m.mediaType === 'VIDEO' && m.mediaRole === 'INTERVIEW_VIDEO'
              );
              // 첫 번째 영상 (INTERVIEW_VIDEO 없으면 아무 VIDEO나)
              const anyVideo = interviewVideo ?? artist.mediaList?.find(
                (m: any) => m.mediaType === 'VIDEO'
              );

              return (
                <div
                  key={artist.artistCode}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                    }`}
                >
                  {/* Artist Portrait */}
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
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

                  {/* Artist Info */}
                  <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                    <div className="space-y-6 md:space-y-8">
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-400 tracking-widest uppercase mb-2 md:mb-3 font-semibold">
                          Artist
                        </div>
                        <h2 className="text-2xl md:text-4xl mb-3 md:mb-4 font-bold">
                          {artist.name}
                        </h2>
                        <p className="text-sm md:text-lg text-gray-500 leading-relaxed break-keep">
                          {artist.description ?? '작가 소개가 없습니다.'}
                        </p>
                      </div>

                      {/* 인터뷰 영상 — 있을 때만 표시 */}
                      {anyVideo && (
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-3">
                            Studio Interview
                          </p>
                          <VideoPlayer
                            url={anyVideo.fileUrl}
                            thumbnail={anyVideo.thumbnailUrl}
                            title={anyVideo.title ?? `${artist.name}의 스튜디오 인터뷰`}
                          />
                        </div>
                      )}

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                        <Link
                          to={`/artist/${artist.artistCode}`}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-black text-white rounded-full hover:bg-gray-800 transition-all font-medium text-sm"
                        >
                          프로필 보기
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-all font-medium text-sm">
                          수집 시작하기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}