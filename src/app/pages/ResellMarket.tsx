import Navigation from '../components/Navigation';
import { Filter, TrendingUp, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const filters = ['All', 'Art Toys', 'Sculptures', 'Ceramics', 'Limited Editions'];

const resellItems = [
  {
    id: '1',
    name: 'Harmony Spirit',
    artist: 'Park Ji-young',
    category: 'Premium Art Toy',
    originalPrice: 450,
    currentPrice: 680,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '125/500',
    condition: 'Mint',
    owners: [
      { name: 'Collector A', date: '2024-01-15' },
      { name: 'Collector B', date: '2025-06-20' },
    ],
    hasBlockchain: true,
  },
  {
    id: '2',
    name: 'Silent Form',
    artist: 'Lee Min-ho',
    category: 'Decorative Object',
    originalPrice: 890,
    currentPrice: 1250,
    priceChange: 40,
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '45/100',
    condition: 'Excellent',
    owners: [
      { name: 'Gallery Seoul', date: '2023-08-10' },
      { name: 'Private Collector', date: '2024-11-05' },
    ],
    hasBlockchain: true,
  },
  {
    id: '3',
    name: 'Future Heritage',
    artist: 'Jung Woo-sung',
    category: 'Limited Edition',
    originalPrice: 1250,
    currentPrice: 1890,
    priceChange: 51,
    image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '12/50',
    condition: 'Mint',
    owners: [
      { name: 'Early Backer', date: '2023-03-01' },
    ],
    hasBlockchain: true,
  },
  {
    id: '4',
    name: 'Ceramic Dreams',
    artist: 'Choi Hye-won',
    category: 'High-End Art Accessory',
    originalPrice: 320,
    currentPrice: 425,
    priceChange: 33,
    image: 'https://images.unsplash.com/photo-1706821856764-4e85de5482d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNlcmFtaWMlMjBhcnQlMjBwaWVjZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    edition: '210/300',
    condition: 'Excellent',
    owners: [
      { name: 'Art Enthusiast', date: '2024-05-12' },
      { name: 'Reseller Pro', date: '2025-12-18' },
    ],
    hasBlockchain: false,
  },
];

export default function ResellMarket() {
  const [selectedFilter, setSelectedFilter] = useState('All');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              Resell Market
            </div>
            <h1 className="text-6xl mb-6 tracking-tight">
              Luxury Art Resale
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              A trusted marketplace for authenticated art goods with full ownership history and blockchain verification.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-8 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3 pb-8 border-b border-gray-100">
            <Filter className="w-5 h-5 text-gray-400" />
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedFilter === filter
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resell Items */}
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resellItems.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-white p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {item.hasBlockchain && (
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                            <Shield className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-xs">Blockchain Verified</span>
                          </div>
                        )}
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                          <span className="text-xs">{item.condition}</span>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-between space-y-6">
                      <div>
                        <div className="text-xs text-gray-400 tracking-wide uppercase mb-2">
                          {item.category}
                        </div>
                        <h3 className="text-2xl mb-2 group-hover:text-gray-600 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">by {item.artist}</p>

                        {/* Price Info */}
                        <div className="space-y-2">
                          <div className="flex items-baseline gap-3">
                            <div className="text-2xl">
                              ${item.currentPrice.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-green-600">
                              <TrendingUp className="w-4 h-4" />
                              +{item.priceChange}%
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            Original: ${item.originalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Edition & Shipping */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm pb-3 border-b border-gray-200">
                          <span className="text-gray-500">Edition</span>
                          <span>{item.edition}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Globe className="w-4 h-4" />
                          Global shipping available
                        </div>
                      </div>

                      {/* Ownership History */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                          Ownership History
                        </div>
                        <div className="space-y-2">
                          {item.owners.map((owner, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">{owner.name}</span>
                              <span className="text-gray-400 text-xs">{owner.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl mb-6">
                Buy & Sell with Confidence
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-12">
                Every item on our resale marketplace is authenticated, verified on blockchain, 
                and comes with complete ownership history. Global shipping, full insurance, 
                and buyer protection included.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6">
                  <Shield className="w-8 h-8 mx-auto mb-4 text-green-500" />
                  <div className="font-medium mb-2">Blockchain Verified</div>
                  <div className="text-sm text-gray-500">
                    Full authenticity guarantee
                  </div>
                </div>
                <div className="p-6">
                  <Globe className="w-8 h-8 mx-auto mb-4 text-blue-500" />
                  <div className="font-medium mb-2">Global Shipping</div>
                  <div className="text-sm text-gray-500">
                    DHL Express worldwide
                  </div>
                </div>
                <div className="p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-4 text-purple-500" />
                  <div className="font-medium mb-2">Market Insights</div>
                  <div className="text-sm text-gray-500">
                    Real-time value tracking
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
