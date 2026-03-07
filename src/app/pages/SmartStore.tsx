import Navigation from '../components/Navigation';
import { Filter, Grid3x3, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useViewMode } from '../context/ViewModeContext';

const categories = [
  'All',
  'Premium Art Toy',
  'Decorative Object',
  'High-End Art Accessory',
  'Limited Edition',
];

// 예술 작품 (그림, 조각 등) - Gallery 모드용
const artworks = [
  {
    id: '1',
    name: 'Harmony in Motion',
    artist: 'Kim Soo-jin',
    category: 'Contemporary Painting',
    price: 8500,
    image: 'https://images.unsplash.com/photo-1769524256027-d2dd0d7b7e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydCUyMHBhaW50aW5nfGVufDF8fHx8MTc3MjM2MzQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: false,
    type: 'artwork' as const,
  },
  {
    id: '2',
    name: 'Silent Form',
    artist: 'Lee Min-ho',
    category: 'Sculpture',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1688673375205-fc457c8516bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwc2N1bHB0dXJlJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: false,
    type: 'artwork' as const,
  },
  {
    id: '3',
    name: 'Guardian Spirit Series',
    artist: 'Park Ji-young',
    category: 'Traditional Art',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1598601595901-aef08a775662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydCUyMG1vZGVybnxlbnwxfHx8fDE3NzI2MDcyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: false,
    has3D: false,
    type: 'artwork' as const,
  },
  {
    id: '4',
    name: 'Modern Heritage',
    artist: 'Jung Woo-sung',
    category: 'Contemporary Sculpture',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1692855280352-29490e1d0f0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmUlMjBnYWxsZXJ5fGVufDF8fHx8MTc3MjU3NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: false,
    type: 'artwork' as const,
  },
  {
    id: '5',
    name: 'Ceramic Dreams',
    artist: 'Choi Hye-won',
    category: 'Ceramic Art',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1706821856764-4e85de5482d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNlcmFtaWMlMjBhcnQlMjBwaWVjZXxlbnwxfHx8fDE3NzIzNjM0OTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: false,
    has3D: false,
    type: 'artwork' as const,
  },
  {
    id: '6',
    name: 'Seoul Nightscape',
    artist: 'Han So-young',
    category: 'Digital Art',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1769131011249-08b41886cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwZGVjb3IlMjBvYmplY3R8ZW58MXx8fHwxNzcyNjczMDI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: false,
    type: 'artwork' as const,
  },
];

// 굿즈 상품 (아트 토이, 굿즈 등) - Shop 모드용
const products = [
  {
    id: '11',
    name: 'Harmony Spirit',
    artist: 'Park Ji-young',
    category: 'Premium Art Toy',
    price: 450,
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzIzNjM0OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: true,
    type: 'product' as const,
  },
  {
    id: '12',
    name: 'Mini Silent Form',
    artist: 'Lee Min-ho',
    category: 'Decorative Object',
    price: 890,
    image: 'https://images.unsplash.com/photo-1771219491795-3b4dafc1cdf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVzaWduZXIlMjBzY3VscHR1cmUlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MjY3MzAyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: true,
    type: 'product' as const,
  },
  {
    id: '13',
    name: 'Ceramic Vase Set',
    artist: 'Choi Hye-won',
    category: 'High-End Art Accessory',
    price: 320,
    image: 'https://images.unsplash.com/photo-1765329843964-5968a383fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2VyYW1pYyUyMGFydCUyMHdoaXRlfGVufDF8fHx8MTc3MjY3MzAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: false,
    has3D: true,
    type: 'product' as const,
  },
  {
    id: '14',
    name: 'Future Heritage Collectible',
    artist: 'Jung Woo-sung',
    category: 'Limited Edition',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1764333785980-69a5dc4e514d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjb2xsZWN0aWJsZSUyMGZpZ3VyaW5lfGVufDF8fHx8MTc3MjM2MzQ5NHww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: true,
    type: 'product' as const,
  },
  {
    id: '15',
    name: 'Elegant Desk Object',
    artist: 'Han So-young',
    category: 'Decorative Object',
    price: 680,
    image: 'https://images.unsplash.com/photo-1760716478137-d861d5b354e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwaG9tZSUyMGRlY29yJTIwb2JqZWN0fGVufDF8fHx8MTc3MjM2MzQ5NXww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: false,
    has3D: true,
    type: 'product' as const,
  },
  {
    id: '16',
    name: 'Urban Spirit Mini',
    artist: 'Park Ji-young',
    category: 'Premium Art Toy',
    price: 520,
    image: 'https://images.unsplash.com/photo-1769345749373-d1407c84cdbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMHZpbnlsJTIwZmlndXJlfGVufDF8fHx8MTc3MjY3MzAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    hasNFT: true,
    has3D: true,
    type: 'product' as const,
  },
];

export default function SmartStore() {
  const { mode } = useViewMode();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');

  // Gallery 모드면 artworks, Shop 모드면 products
  const items = mode === 'gallery' ? artworks : products;

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
              {mode === 'gallery' ? 'The Gallery' : 'Smart Store'}
            </div>
            <h1 className="text-6xl mb-6 tracking-tight">
              {mode === 'gallery' ? 'Original Artworks' : 'Art You Can Own'}
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed">
              {mode === 'gallery' 
                ? 'Discover original paintings, sculptures, and fine art pieces from Korea\'s finest artists.'
                : 'Curated collection of premium art goods, from exclusive toys to decorative objects.'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Controls */}
      <section className="px-8 pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between pb-8 border-b border-gray-100">
            {/* Category Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <Filter className="w-5 h-5 text-gray-400" />
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedCategory === 'All'
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {mode === 'shop' && categories.slice(1).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCategory === category
                      ? 'bg-black text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'large' ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-8 pb-32">
        <div className="max-w-[1600px] mx-auto">
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 md:grid-cols-2'
          }`}>
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-50">
                  <div className={`relative ${
                    viewMode === 'grid' ? 'aspect-square' : 'aspect-[4/3]'
                  }`}>
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.hasNFT && (
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium">
                          NFT Authenticated
                        </div>
                      )}
                      {item.has3D && (
                        <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs">
                          3D Preview
                        </div>
                      )}
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 px-1">
                  <div className="text-xs text-gray-400 tracking-wide uppercase mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg mb-1 group-hover:text-gray-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">by {item.artist}</p>
                  <p className="text-lg font-medium">
                    ${item.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
