import Navigation from '../../components/layouts/Header';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';
import { artists } from  '../type/artist';

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const artistData = artists.find((artist) => artist.id === id);

  if (!artistData) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="pt-32 pb-32 px-8">
          <div className="max-w-[1600px] mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <div className="rounded-3xl border border-gray-200 p-12 text-center">
              <h1 className="text-3xl mb-4">작가 정보를 찾을 수 없습니다.</h1>
              <p className="text-gray-500 mb-8">
                존재하지 않거나 삭제된 작가 페이지입니다.
              </p>
              <Link
                to="/artist-lab"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                작가 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <div className="pt-32 pb-32 px-8">
        <div className="max-w-[1600px] mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Artist Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
            {/* Portrait */}
            <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-[3/4]">
              <ImageWithFallback
                src={artistData.image}
                alt={artistData.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <div className="text-sm text-gray-400 tracking-wide uppercase mb-3">
                  {artistData.specialty}
                </div>
                <h1 className="text-5xl mb-4">{artistData.name}</h1>
                <p className="text-lg text-gray-500 mb-6">{artistData.location}</p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {artistData.bio}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-6 border-t border-gray-100">
                <span className="font-medium text-black text-2xl">
                  {artistData.collectors.toLocaleString()}
                </span>
                collectors worldwide
              </div>

              <div className="flex gap-4">
                <button className="flex-1 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                  Start Collecting
                </button>
                <button className="px-8 py-4 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Studio Video */}
          <div className="mb-32">
            <h2 className="text-3xl mb-8">Inside the Studio</h2>
            <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-video">
              <ImageWithFallback
                src={artistData.studioImage}
                alt={`${artistData.name} studio`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <button className="flex items-center justify-center w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                  <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>

          {/* IP Expansion Section */}
          <div className="mb-32">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <ExternalLink className="w-6 h-6 text-purple-500" />
                  <h2 className="text-3xl">IP Expansion Journey</h2>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  {artistData.expansionDescription}
                </p>

                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <div className="px-4 py-2 bg-white rounded-full">Original Art</div>
                  <div className="text-gray-400">→</div>
                  <div className="px-4 py-2 bg-white rounded-full">Art Goods</div>
                  <div className="text-gray-400">→</div>
                  <div className="px-4 py-2 bg-white rounded-full">Limited Editions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div>
            <h2 className="text-3xl mb-8">Portfolio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artistData.portfolio.map((work) => (
                <Link
                  key={work.id}
                  to={work.type === 'available' ? `/product/${work.id}` : '#'}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square mb-4">
                    <ImageWithFallback
                      src={work.image}
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div
                        className={`px-3 py-1.5 rounded-full text-xs backdrop-blur-sm ${
                          work.type === 'available'
                            ? 'bg-green-500/90 text-white'
                            : work.type === 'sold'
                            ? 'bg-gray-900/90 text-white'
                            : 'bg-blue-500/90 text-white'
                        }`}
                      >
                        {work.type === 'available'
                          ? 'Available'
                          : work.type === 'sold'
                          ? 'Sold'
                          : 'On Exhibition'}
                      </div>
                    </div>

                    {/* Overlay */}
                    {work.type === 'available' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>

                  <div className="px-1">
                    <div className="text-xs text-gray-400 tracking-wide uppercase mb-1">
                      {work.category}
                    </div>
                    <h3 className="text-lg mb-2 group-hover:text-gray-600 transition-colors">
                      {work.title}
                    </h3>
                    {work.price && (
                      <p className="text-sm">${work.price.toLocaleString()}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}