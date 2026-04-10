import { ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // i18n 훅 추가
import { getSkus, getGenreCounts } from '@/api/sku';
import { getBanners } from '@/api/banner';

const GENRE_TO_CATEGORY: Record<string, string> = {
  ART_TOY: 'art-toys',
  SCULPTURE: 'sculptures',
  CERAMIC: 'ceramics',
  PAINTING: 'paintings',
  LIMITED_EDITION: 'limited-editions',
  HOME_DECOR: 'home-decor',
};

const DEFAULT_CATEGORIES = [
  { id: 'all', count: 0 },
  { id: 'art-toys', count: 0 },
  { id: 'sculptures', count: 0 },
  { id: 'ceramics', count: 0 },
  { id: 'paintings', count: 0 },
  { id: 'limited-editions', count: 0 },
  { id: 'home-decor', count: 0 },
];

export default function Home() {
  const { t } = useTranslation();

  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [skus, setSkus] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);

  useEffect(() => {
    const fetchData = async () => {
      try {
      
        const skuRes = await getSkus(0, 6);
        setSkus(skuRes.data.data.content ?? []);

      
        const bannerRes = await getBanners('MAIN');
        const banners = bannerRes.data.data ?? [];
        if (banners.length > 0) setBanner(banners[0]);

     
        const genreRes = await getGenreCounts();
        const counts: Record<string, number> = genreRes.data.data ?? {};
        setCategories(DEFAULT_CATEGORIES.map((cat) => {
          if (cat.id === 'all') return { ...cat, count: counts['ALL'] ?? 0 };
          const genreKey = Object.entries(GENRE_TO_CATEGORY).find(([, id]) => id === cat.id)?.[0];
          return { ...cat, count: genreKey ? (counts[genreKey] ?? 0) : 0 };
        }));

      } catch (e) {
        console.error('홈 데이터 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-white">

   
      <section className="relative h-[80vh] min-h-[600px] md:h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={banner?.imageUrl ?? 'https://i.ytimg.com/vi/fNfC7KZ10og/hq720.jpg'}
            alt={banner?.title ?? 'Korean Art Gallery'}
            className="w-full h-full object-cover object-top md:object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative h-full flex items-center px-6 md:px-12">
          <div className="max-w-[1800px] mx-auto w-full">
            <div className="max-w-2xl text-white">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] md:text-xs tracking-widest uppercase rounded-full mb-6 border border-white/20">
                {t('home.hero.badge')}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl mb-6 font-bold tracking-tighter leading-[1.1]">
                {banner?.title ?? t('home.hero.defaultTitle')}<br />
                {banner?.subtitle ?? t('home.hero.defaultSubtitle')}
              </h1>
              <p className="text-base md:text-xl text-gray-200 mb-8 max-w-lg break-keep opacity-90">
                {t('home.hero.description')}
              </p>
              <Link
                to={banner?.linkUrl ?? '/store'}
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all font-bold group"
              >
                {t('home.hero.shopNow')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-12 md:py-20 px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('home.categories.title')}</h2>
              <p className="text-gray-400 text-sm md:text-base font-medium">{t('home.categories.subtitle')}</p>
            </div>
            <div className="hidden md:flex gap-2">
              <button onClick={() => scrollCategories('left')} className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button onClick={() => scrollCategories('right')} className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div ref={categoryScrollRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
            {categories.map((category) => (
              <Link key={category.id} to={`/smart-store?category=${category.id}`} className="flex-shrink-0 group">
                <div className="px-8 py-6 bg-gray-50 rounded-2xl border border-transparent group-hover:border-black group-hover:bg-white transition-all duration-300 min-w-[200px]">
                  <h3 className="text-lg font-bold mb-1">{t(`home.categories.list.${category.id}`)}</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{category.count} {t('home.categories.items')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black">{t('home.popularProducts.title')}</h2>
              <p className="text-gray-500 font-medium break-keep">{t('home.popularProducts.subtitle')}</p>
            </div>
            <Link to="/smart-store" className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
              {t('home.popularProducts.viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-100 rounded-3xl mb-4" />
                  <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : skus.length === 0 ? (
        
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">{t('home.popularProducts.noData.title')}</p>
              <p className="text-gray-300 text-sm mt-2">{t('home.popularProducts.noData.description')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:grid-flow-row-dense gap-4 md:gap-8">
              {skus.map((sku, index) => (
                <Link
                  key={sku.skuCode}
                  to={`/product/${sku.skuCode}`}
                  className={`group flex flex-col ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
                >
                  <div className="relative flex-1 rounded-3xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={sku.primaryImageUrl ?? 'https://via.placeholder.com/400'}
                      alt={sku.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    {sku.salePrice && (
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1.5 bg-white/90 backdrop-blur-md text-black text-[10px] md:text-xs font-black rounded-lg shadow-sm">
                          {t('home.popularProducts.saleBadge')}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <ArrowRight className="w-6 h-6 text-black" />
                      </div>
                    </div>
                  </div>
                  <div className="px-1">
                    <div className="text-[10px] text-gray-400 font-bold tracking-widest uppercase mb-1">{sku.genre}</div>
                    <h3 className="text-base md:text-xl font-bold mb-1 group-hover:text-gray-500 transition-colors">{sku.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 font-medium mb-2">{sku.artistName}</p>
                    <p className="text-sm md:text-lg font-black tracking-tight">
                      ₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-12 md:hidden">
            <Link to="/smart-store" className="flex items-center justify-center w-full py-4 bg-black text-white rounded-full font-bold">
              {t('home.popularProducts.viewAllMobile')}
            </Link>
          </div>
        </div>
      </section>

      {/* 플랫폼 소개 섹션 */}
      <section className="py-24 px-6 md:px-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-[10px] md:text-xs text-indigo-500 font-black tracking-[0.2em] mb-4 uppercase">
              {t('home.intro.badge')}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter break-keep">
              {t('home.intro.title')}
            </h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10 break-keep">
              {t('home.intro.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/artist-lab" className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all text-center">
                {t('home.intro.exploreArtist')}
              </Link>
              <Link to="/ar-view" className="px-8 py-4 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white transition-all text-center">
                {t('home.intro.tryAR')}
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ0hzEOYPkyRA1dh4RzFqNE3Zs80bd6jZMDA&s" alt="Platform Vision" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}