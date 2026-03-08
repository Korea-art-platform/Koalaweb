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
    image:
      'https://tse3.mm.bing.net/th/id/OIP.A2JTa5_y7Mf_KI1NbDP1xAHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
    title: '내사랑',
    artist: '김원근',
    category: 'Art Toy',
    price: '₩298,000',
    isAICurated: true,
    size: 'large' as const,
  },
  {
    id: '2',
    image:
      'https://cdn.artkoreatv.com/news/photo/202504/97359_302137_3344.jpg',
    title: 'Silent Form',
    artist: '주후식',
    category: 'Sculpture',
    price: '₩1,250,000',
    size: 'medium' as const,
  },
  {
    id: '3',
    image:
      'https://tse1.mm.bing.net/th/id/OIP.1vGCAssXi3mUP_j2keroiAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3',
    title: 'Ceramic Dreams',
    artist: '박준상',
    category: 'Ceramic',
    price: '₩450,000',
    size: 'medium' as const,
  },
  {
    id: '4',
    image:
      'https://contents.sixshop.com/uploadedFiles/98649/product/image_1700548287742.jpg',
    title: 'Modern Heritage',
    artist: '박준상',
    category: 'Contemporary',
    price: '₩2,100,000',
    isAICurated: true,
    size: 'large' as const,
  },
  {
    id: '5',
    image:
      'https://cdn.jejusori.net/news/photo/201106/100618_109510_034.jpg',
    title: 'Elegant Essence',
    artist: '유종욱',
    category: 'Decorative',
    price: '₩680,000',
    size: 'small' as const,
  },
  {
    id: '6',
    image:
      'https://images.unsplash.com/photo-1769345749373-d1407c84cdbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGFydCUyMHRveSUyMHZpbnlsJTIwZmlndXJlfGVufDF8fHx8MTc3MjY3MzAyNnww&ixlib=rb-4.1.0&q=80&w=1080',
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
    <div className="bg-white">
      <section
        id="home-hero"
        className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src="https://i.ytimg.com/vi/fNfC7KZ10og/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCJZq_xTBV_5iyzMaJYpDxH34lBNA"
            alt="Korean Art Gallery"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative h-full flex items-center px-6 md:px-8 lg:px-12">
          <div className="max-w-[1800px] mx-auto w-full">
            <div className="max-w-2xl">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-xs tracking-wider uppercase rounded-full mb-6 border border-white/20">
                신제품 드랍!
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight text-white">
                예술작품이
                <br />
                지금 당장 당신의 손에
              </h1>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8">
                한국의 아름다운 예술작품들을 디지털과 물리적 형태로 만나보세요. KoALa는
                전통과 현대가 어우러진 독특한 컬렉션을 통해 예술의 새로운 경험을
                선사합니다.
              </p>

              <Link
                to="/store"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 hover:gap-4"
              >
                쇼핑하기
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Horizontal Scroll */}
      <section className="py-16 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl">카테고리</h2>

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
              <h2 className="text-3xl md:text-4xl mb-2">인기상품</h2>
              <p className="text-gray-500">지금 당장 작가님들의 인기상품을 만나보세요.</p>
            </div>

            <Link
              to="/smart-store"
              className="hidden md:flex items-center gap-2 text-sm hover:gap-3 transition-all duration-300"
            >
              상품 전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {product.isAICurated && (
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full">
                          작가 수제품
                        </div>
                      </div>
                    )}
                  </div>

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

          <div className="mt-12 md:hidden text-center">
            <Link
              to="/smart-store"
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              상품 전체보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-8 lg:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="text-sm text-gray-400 tracking-wide mb-4 uppercase">
                KoALa 플랫폼
              </div>

              <h2 className="text-4xl md:text-5xl mb-6 tracking-tight">
                글로벌 K-아트 IP 구축
              </h2>

              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                KoALa는 아티스트와 IP, 아트 굿즈, 그리고 원화 사이의 모든 접점을
                연결합니다. 디지털과 실물의 경계를 허물고, 로컬을 넘어 글로벌로 이어지는
                매끄러운 경험을 선사합니다. 이제, 아트 컬렉팅의 미래를 직접 경험해 보세요
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/artist-lab"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
                >
                  작가 탐색하기
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/ar-view"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-black rounded-full hover:bg-black hover:text-white transition-colors"
                >
                  AR 뷰어 체험하기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl overflow-hidden">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ0hzEOYPkyRA1dh4RzFqNE3Zs80bd6jZMDA&s"
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