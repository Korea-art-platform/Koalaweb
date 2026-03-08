import Navigation from '../../components/layouts/Header';
import { Play, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { artists } from '../type/artist';

export default function ArtistLab() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              작가의 연구실
            </div>
            <h1 className="text-6xl mb-6 tracking-tight">
              작품 뒤에 숨겨진 이야기
            </h1>
            <h1 className="text-6xl mb-6 tracking-tight">
              작가의 연구실에서 만나다
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              한국 현대미술의 선구자들이 펼치는 창조적 여정과 영감을 경험하세요.
            </p>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto space-y-32">
          {artists.map((artist, index) => (
            <div
              key={artist.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
            >
              {/* Artist Portrait */}
              <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                <Link to={`/artist/${artist.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-[3/4]">
                    <ImageWithFallback
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </div>

              {/* Artist Info */}
              <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                <div className="space-y-6">
                  <div>
                    <div className="text-xs text-gray-400 tracking-wide uppercase mb-3">
                      {artist.specialty}
                    </div>
                    <h2 className="text-4xl mb-4">{artist.name}</h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-black">
                      {artist.collectors.toLocaleString()}
                    </span>
                    collectors worldwide
                  </div>

                  {/* Interview Video */}
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-video">
                    <ImageWithFallback
                      src={artist.studioImage}
                      alt={`${artist.name} studio`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <button className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                        <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-sm">스튜디오 인터뷰 영상</div>
                      <div className="text-xs text-gray-300">
                        {artist.name}의 창작 과정과 영감을 담은 인터뷰 영상입니다.
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      to={`/artist/${artist.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                      프로필 보기
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                      수집 시작하기
                    </button>
                  </div>

                  {/* IP Expansion Notice */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <ExternalLink className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium mb-1">IP 확장 예정</div>
                      <div className="text-xs text-gray-600">{artist.ipNotice}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}