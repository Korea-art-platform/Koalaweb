import Navigation from '../components/Navigation';
import { Play, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const artists = [
  {
    id: '1',
    name: 'Kim Soo-jin',
    specialty: 'Contemporary Painter',
    bio: 'Bridging traditional Korean aesthetics with modern minimalism',
    image: 'https://images.unsplash.com/photo-1703420371268-85d78cfdc5cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    studioImage: 'https://images.unsplash.com/photo-1533619025797-cb54d7bcb5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBhcnRpc3QlMjB3b3Jrc3BhY2UlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    collectors: 1240,
  },
  {
    id: '2',
    name: 'Lee Min-ho',
    specialty: 'Sculptor & Installation Artist',
    bio: 'Exploring forms between organic nature and geometric precision',
    image: 'https://images.unsplash.com/photo-1703420371268-85d78cfdc5cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    studioImage: 'https://images.unsplash.com/photo-1770819372115-dafe72a8c8b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNldW0lMjBleGhpYml0aW9uJTIwc3BhY2UlMjBjbGVhbnxlbnwxfHx8fDE3NzIzNjM0OTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    collectors: 890,
  },
  {
    id: '3',
    name: 'Park Ji-young',
    specialty: 'Art Toy Designer',
    bio: 'Creating collectible characters inspired by Korean folklore',
    image: 'https://images.unsplash.com/photo-1703420371268-85d78cfdc5cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    studioImage: 'https://images.unsplash.com/photo-1533619025797-cb54d7bcb5e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBhcnRpc3QlMjB3b3Jrc3BhY2UlMjBjcmVhdGl2ZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    collectors: 2150,
  },
  {
    id: '4',
    name: 'Choi Hye-won',
    specialty: 'Ceramic Artist',
    bio: 'Reimagining traditional pottery with contemporary expression',
    image: 'https://images.unsplash.com/photo-1703420371268-85d78cfdc5cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnRpc3QlMjBzdHVkaW8lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    studioImage: 'https://images.unsplash.com/photo-1767294274414-5e1e6c3974e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcnQlMjBnYWxsZXJ5JTIwd2hpdGV8ZW58MXx8fHwxNzcyMzYzNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    collectors: 670,
  },
];

export default function ArtistLab() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              Artist Lab
            </div>
            <h1 className="text-6xl mb-6 tracking-tight">
              Stories Behind the Art
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              Meet the visionaries transforming Korean culture into global art experiences.
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
                    <h2 className="text-4xl mb-4">
                      {artist.name}
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed">
                      {artist.bio}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-black">{artist.collectors.toLocaleString()}</span>
                    collectors worldwide
                  </div>

                  {/* Interview Video */}
                  <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-video">
                    <ImageWithFallback
                      src={artist.studioImage}
                      alt={`${artist.name}'s studio`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <button className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors">
                        <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-sm">
                        Studio Behind-the-Scenes
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-4 pt-4">
                    <Link
                      to={`/artist/${artist.id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                    >
                      View Portfolio
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                      Start Collecting
                    </button>
                  </div>

                  {/* IP Expansion Notice */}
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                    <ExternalLink className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium mb-1">
                        IP Expansion Available
                      </div>
                      <div className="text-xs text-gray-600">
                        Original artworks → Art goods → Limited editions
                      </div>
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
