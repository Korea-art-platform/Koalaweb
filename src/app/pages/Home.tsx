import Navigation from '../components/Navigation';
import ArtworkCard from '../components/ArtworkCard';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useRef } from 'react';

// Categories for horizontal scroll
const categories = [
  { id: 'all', name: 'All Collections', count: 247 },
  { id: 'art-toys', name: 'Art Toys', count: 89 },
  { id: 'sculptures', name: 'Sculptures', count: 52 },
  { id: 'ceramics', name: 'Ceramics', count: 34 },
  { id: 'paintings', name: 'Paintings', count: 41 },
  { id: 'limited-editions', name: 'Limited Editions', count: 21 },
  { id: 'home-decor', name: 'Home Décor', count: 10 },
];

// Trending products
const trendingProducts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1771515221699-dd1b7a2f86f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcnQlMjBjb2xsZWN0aWJsZSUyMGZpZ3VyZXxlbnwxfHx8fDE3NzI2NzMwMjV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Urban Spirit Series',
    artist: 'Park Ji-young',
    category: 'Art Toy',
    price: '₩298,000',
    isAICurated: true,
    size: 'large' as const,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1771219491795-3b4dafc1cdf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZGVzaWduZXIlMjBzY3VscHR1cmUlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc3MjY3MzAyNHww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Silent Form',
    artist: 'Lee Min-ho',
    category: 'Sculpture',
    price: '₩1,250,000',
    size: 'medium' as const,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1765329843964-5968a383fa4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2VyYW1pYyUyMGFydCUyMHdoaXRlfGVufDF8fHx8MTc3MjY3MzAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Ceramic Dreams',
    artist: 'Choi Hye-won',
    category: 'Ceramic',
    price: '₩450,000',
    size: 'medium' as const,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1692855280352-29490e1d0f0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBzY3VscHR1cmUlMjBnYWxsZXJ5fGVufDF8fHx8MTc3MjU3NzU5M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Modern Heritage',
    artist: 'Jung Woo-sung',
    category: 'Contemporary',
    price: '₩2,100,000',
    isAICurated: true,
    size: 'large' as const,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1769131011249-08b41886cef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob21lJTIwZGVjb3IlMjBvYmplY3R8ZW58MXx8fHwxNzcyNjczMDI1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Elegant Essence',
    artist: 'Han So-young',
    category: 'Decorative',
    price: '₩680,000',
    size: 'small' as const,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1769345749373-d1407c84cdbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMHZpbnlsJTIwZmlndXJlfGVufDF8fHx8MTc3MjY3MzAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Neo Seoul Collection',
    artist: 'Kim Soo-jin',
    category: 'Art Toy',
    price: '₩320,000',
    size: 'medium' as const,
  },
];

export default function Home() {
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = 300;
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Banner Section - 21:9 Aspect Ratio */}
      <section className="pt-24 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl overflow-hidden">
            {/* 21:9 Aspect Ratio Container */}
            <div className="relative w-full" style={{ paddingBottom: '42.857%' }}>
              <div className="absolute inset-0 flex flex-col md:flex-row items-center">
                {/* Text Content - Left Side */}
                <div className="w-full md:w-1/2 px-8 md:px-16 py-12 md:py-0 flex flex-col justify-center z-10">
                  <div className="max-w-xl">
                    <div className="inline-block px-4 py-1.5 bg-black text-white text-xs tracking-wider uppercase rounded-full mb-6">
                      New Arrival
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
                      The Art in
                      <br />
                      Your Hands
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8">
                      Discover exclusive Korean art collectibles curated by AI and experts. Limited editions from Korea's finest artists.
                    </p>
                    <Link
                      to="/smart-store"
                      className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-all duration-300 hover:gap-4"
                    >
                      Shop Now
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                {/* Product Image - Right Side */}
                <div className="w-full md:w-1/2 h-full relative flex items-center justify-center p-8 md:p-12">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1722426874719-d8aa92ff7f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBrb3JlYW4lMjBhcnQlMjB0b3klMjBjb2xsZWN0aWJsZSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzI2NzMwMjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Featured Product"
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Horizontal Scroll */}
      <section className="py-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl">Browse by Category</h2>
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scrollCategories('left')}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button
                onClick={() => scrollCategories('right')}
                className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrollable Categories */}
          <div className="relative">
            <div
              ref={categoryScrollRef}
              className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/smart-store?category=${category.id}`}
                  className="flex-shrink-0 group"
                >
                  <div className="px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all duration-300 min-w-[180px]">
                    <h3 className="text-base font-medium mb-1 group-hover:translate-x-1 transition-transform">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-400">{category.count} items</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Items Grid */}
      <section className="py-16 px-6 md:px-8 lg:px-12 bg-gray-50">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl mb-2">Trending Now</h2>
              <p className="text-gray-500">Curated by AI + Expert Selection</p>
            </div>
            <Link
              to="/smart-store"
              className="hidden md:flex items-center gap-2 text-sm hover:gap-3 transition-all duration-300"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group block"
              >
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
                  {/* Product Image */}
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.isAICurated && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full">
                          AI Curated
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-xl mb-1 group-hover:translate-x-1 transition-transform duration-300">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">{product.artist}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-medium">{product.price}</span>
                      <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile View All Button */}
          <div className="mt-12 md:hidden text-center">
            <Link
              to="/smart-store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
                KoALa Platform
              </div>
              <h2 className="text-4xl md:text-5xl mb-6 tracking-tight">
                Building a Global K-Art IP Ecosystem
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                KoALa connects the dots between artists, their intellectual property, art goods, 
                and original artworks—creating a seamless journey from digital to physical, 
                from local to global. Experience the future of art collecting.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/artist-lab"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  Explore Artists
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/ar-view"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  Try AR View
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1598601595901-aef08a775662?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjB0cmFkaXRpb25hbCUyMGFydCUyMG1vZGVybnxlbnwxfHx8fDE3NzI2MDcyNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Korean Art"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
