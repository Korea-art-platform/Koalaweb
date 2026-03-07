import Navigation from '../components/Navigation';
import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, ExternalLink, Play } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const artistData = {
  id: '1',
  name: 'Park Ji-young',
  specialty: 'Art Toy Designer',
  bio: 'Park Ji-young is a visionary art toy designer who bridges the gap between traditional Korean folklore and contemporary pop culture. Her work reimagines mythical creatures and guardian spirits through a modern lens, creating collectible pieces that resonate with global audiences while preserving cultural heritage.',
  location: 'Seoul, South Korea',
  image: 'https://images.unsplash.com/photo-1703420371268-85d78cfdc5cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  studioImage: 'https://images.unsplash.com/photo-1533619025797-cb54d7bcb5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBhcnRpc3QlMjB3b3Jrc3BhY2UlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  collectors: 2150,
  portfolio: [
    {
      id: '1',
      title: 'Harmony Spirit',
      category: 'Art Toy',
      image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'available',
      price: 450,
    },
    {
      id: '2',
      title: 'Guardian Series',
      category: 'Original Artwork',
      image: 'https://images.unsplash.com/photo-1769524256027-d2dd0d7b7e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydCUyMHBhaW50aW5nfGVufDF8fHx8MTc3MjM2MzQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'available',
      price: 8500,
    },
    {
      id: '3',
      title: 'Urban Spirit',
      category: 'Art Toy',
      image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'available',
      price: 520,
    },
    {
      id: '4',
      title: 'Dream Keeper',
      category: 'Limited Edition',
      image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'sold',
    },
    {
      id: '5',
      title: 'Spirit Collection',
      category: 'Original Artwork',
      image: 'https://images.unsplash.com/photo-1767294274414-5e1e6c3974e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBnYWxsZXJ5JTIwd2hpdGV8ZW58MXx8fHwxNzcyMzYzNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'exhibition',
    },
    {
      id: '6',
      title: 'Folk Tales',
      category: 'Art Toy',
      image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
      type: 'available',
      price: 480,
    },
  ],
};

export default function ArtistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

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
                <h1 className="text-5xl mb-4">
                  {artistData.name}
                </h1>
                <p className="text-lg text-gray-500 mb-6">
                  {artistData.location}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {artistData.bio}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 pt-6 border-t border-gray-100">
                <span className="font-medium text-black text-2xl">{artistData.collectors.toLocaleString()}</span>
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
            <h2 className="text-3xl mb-8">
              Inside the Studio
            </h2>
            <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-video">
              <ImageWithFallback
                src={artistData.studioImage}
                alt={`${artistData.name}'s studio`}
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
                  <h2 className="text-3xl">
                    IP Expansion Journey
                  </h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Park Ji-young's creative process begins with original paintings that explore 
                  Korean mythology. These artworks are then transformed into premium art toys, 
                  limited edition collectibles, and high-end accessories—creating a complete 
                  ecosystem from canvas to collectible.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="px-4 py-2 bg-white rounded-full">
                    Original Art
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="px-4 py-2 bg-white rounded-full">
                    Art Goods
                  </div>
                  <div className="text-gray-400">→</div>
                  <div className="px-4 py-2 bg-white rounded-full">
                    Limited Editions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Grid */}
          <div>
            <h2 className="text-3xl mb-8">
              Portfolio
            </h2>
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
                      <div className={`px-3 py-1.5 rounded-full text-xs backdrop-blur-sm ${
                        work.type === 'available'
                          ? 'bg-green-500/90 text-white'
                          : work.type === 'sold'
                          ? 'bg-gray-900/90 text-white'
                          : 'bg-blue-500/90 text-white'
                      }`}>
                        {work.type === 'available' ? 'Available' : work.type === 'sold' ? 'Sold' : 'On Exhibition'}
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
                      <p className="text-sm">
                        ${work.price.toLocaleString()}
                      </p>
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
