import Navigation from '@/app/components/layouts/Header';
import { Filter, Grid3x3, LayoutGrid, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { getSkus } from '@/api/sku';
import { getWishlist, addWishlist, removeWishlist } from '@/api/wishlist';

const categories = ['All', 'ART_TOY', 'SCULPTURE', 'CERAMIC', 'PAINTING', 'GOODS'];

const categoryLabel: Record<string, string> = {
  All: 'All',
  ART_TOY: 'Art Toys',
  SCULPTURE: 'Sculptures',
  CERAMIC: 'Ceramics',
  PAINTING: 'Paintings',
  GOODS: 'Art Goods',
};

export default function SmartStore() {
  const navigate = useNavigate();
  const [skus, setSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [wishlistedCodes, setWishlistedCodes] = useState<Set<string>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSkus = async () => {
      setLoading(true);
      try {
        const res = await getSkus(page, 12);
        const data = res.data.data;
        setSkus(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSkus();
  }, [page]);

  // 로그인 사용자의 위시리스트 목록을 한 번에 불러와 Set으로 관리
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    getWishlist(0, 100)
      .then((res) => {
        const items = res.data?.data?.content ?? [];
        setWishlistedCodes(new Set(items.map((item: any) => item.skuCode)));
      })
      .catch(() => {});
  }, []);

  const handleWishlist = async (e: React.MouseEvent, skuCode: string) => {
    e.preventDefault();       // Link 이동 방지
    e.stopPropagation();      // 이벤트 버블링 방지

    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // 이미 처리 중이면 무시
    if (wishlistLoading.has(skuCode)) return;

    setWishlistLoading((prev) => new Set(prev).add(skuCode));
    try {
      if (wishlistedCodes.has(skuCode)) {
        await removeWishlist(skuCode);
        setWishlistedCodes((prev) => {
          const next = new Set(prev);
          next.delete(skuCode);
          return next;
        });
      } else {
        await addWishlist(skuCode);
        setWishlistedCodes((prev) => new Set(prev).add(skuCode));
      }
    } catch (err) {
      console.error('위시리스트 처리 실패:', err);
    } finally {
      setWishlistLoading((prev) => {
        const next = new Set(prev);
        next.delete(skuCode);
        return next;
      });
    }
  };

  const filteredSkus = selectedCategory === 'All'
    ? skus
    : skus.filter((sku) => sku.genre === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-8 md:pb-12 px-5 md:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-2xl">
            <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.2em] mb-3 md:mb-4 uppercase font-bold">
              Smart Store
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 tracking-tight font-bold leading-[1.1]">
              Art You Can Own
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-lg break-keep">
              Curated collection of premium art goods, collectible objects, and lifestyle art pieces.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="px-5 md:px-8 lg:px-12 pb-8 md:pb-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-1">
              <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition-all whitespace-nowrap border ${selectedCategory === category
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900'
                    }`}
                >
                  {categoryLabel[category]}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'
                  }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('large')}
                className={`p-2 rounded-lg transition-colors ${viewMode === 'large' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="px-5 md:px-8 lg:px-12 pb-32">
        <div className="max-w-[1600px] mx-auto">

          {/* 로딩 */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-2xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredSkus.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-8 py-20 text-center">
              <h2 className="text-xl mb-2 font-medium">해당 작품이 없습니다.</h2>
              <p className="text-sm text-gray-400">다른 필터를 선택해 보세요.</p>
            </div>
          ) : (
            <>
              <div className={`grid ${viewMode === 'grid'
                  ? 'grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-8 lg:gap-12'
                  : 'grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12'
                }`}>
                {filteredSkus.map((sku) => (
                  <Link
                    key={sku.skuCode}
                    to={`/product/${sku.skuCode}`}
                    className="group block"
                  >
                    <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gray-100">
                      <div className={`relative w-full ${viewMode === 'grid' ? 'aspect-[3/4] sm:aspect-square' : 'aspect-[4/3]'
                        }`}>
                        <ImageWithFallback
                          src={sku.primaryImageUrl ?? 'https://via.placeholder.com/400'}
                          alt={sku.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* 뱃지 */}
                        <div className="absolute top-2.5 left-2.5 md:top-4 md:left-4 flex flex-col gap-1.5">
                          <div className="px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-white/90 backdrop-blur-sm text-[9px] md:text-xs font-bold tracking-tight uppercase shadow-sm">
                            {categoryLabel[sku.genre] ?? sku.genre}
                          </div>
                          {sku.isLimitedEdition && (
                            <div className="w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-md bg-black text-white text-[9px] md:text-xs font-bold uppercase shadow-sm">
                              Limited
                            </div>
                          )}
                        </div>

                        {/* 상태 뱃지 */}
                        <div className="absolute top-2.5 right-2.5 md:top-4 md:right-4">
                          <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-md text-[9px] md:text-xs font-bold backdrop-blur-sm shadow-sm ${sku.status === 'ACTIVE'
                              ? 'bg-green-500/90 text-white'
                              : sku.status === 'OUT_OF_STOCK'
                                ? 'bg-gray-900/90 text-white'
                                : 'bg-blue-500/90 text-white'
                            }`}>
                            {sku.status === 'ACTIVE' ? 'Available'
                              : sku.status === 'OUT_OF_STOCK' ? 'Sold Out'
                                : sku.status}
                          </div>
                        </div>

                        {/* 위시리스트 버튼 */}
                        <button
                          onClick={(e) => handleWishlist(e, sku.skuCode)}
                          disabled={wishlistLoading.has(sku.skuCode)}
                          className={`absolute bottom-2.5 right-2.5 md:bottom-4 md:right-4 p-2 md:p-2.5 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 ${
                            wishlistedCodes.has(sku.skuCode)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-gray-500 hover:bg-white hover:text-red-400'
                          } ${wishlistLoading.has(sku.skuCode) ? 'opacity-60 cursor-wait' : ''}`}
                        >
                          <Heart
                            className="w-4 h-4 md:w-4.5 md:h-4.5"
                            fill={wishlistedCodes.has(sku.skuCode) ? 'currentColor' : 'none'}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 px-0.5">
                      <div className="text-[10px] md:text-xs text-gray-400 tracking-wider uppercase mb-1.5 font-medium">
                        {categoryLabel[sku.genre] ?? sku.genre}
                      </div>
                      <h3 className="text-sm md:text-lg lg:text-xl font-bold mb-1 group-hover:text-gray-600 transition-colors truncate">
                        {sku.name}
                      </h3>
                      <p className="text-[12px] md:text-sm text-gray-500 mb-2 font-medium">
                        {sku.artistName}
                      </p>
                      <p className="text-sm md:text-lg font-black tracking-tight">
                        ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-16">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                  >
                    이전
                  </button>
                  <span className="px-6 py-2 text-sm text-gray-500">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                    className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}