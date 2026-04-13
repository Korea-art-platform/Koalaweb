import { useEffect, useState } from 'react';
import { getSkus, getGenreCounts } from '@/api/sku';
import { getBanners } from '@/api/banner';

// 분리한 컴포넌트들 Import
import HomeHero from '@/app/components/Home/HomeHero';
import HomeCategories from '@/app/components/Home/HomeCategories';
import HomePopularProducts from '@/app/components/Home/HomePopularProducts';
import HomePlatformIntro from '@/app/components/Home/HomePlatformIntro';

// 장르 키와 카테고리 ID 매핑
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

  const [skus, setSkus] = useState<any[]>([]);
  const [banner, setBanner] = useState<any>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // 병렬 요청으로 로딩 속도 최적화
        const [skuRes, bannerRes, genreRes] = await Promise.all([
          getSkus(0, 8), 
          getBanners('MAIN'),
          getGenreCounts()
        ]);

        // 1. 상품 데이터 설정
        setSkus(skuRes.data.data.content ?? []);

        // 2. 메인 배너 설정
        const banners = bannerRes.data.data ?? [];
        if (banners.length > 0) setBanner(banners[0]);

        // 3. 카테고리별 수량 가공
        const counts: Record<string, number> = genreRes.data.data ?? {};
        setCategories(DEFAULT_CATEGORIES.map((cat) => {
          if (cat.id === 'all') return { ...cat, count: counts['ALL'] ?? 0 };
          
          const genreKey = Object.entries(GENRE_TO_CATEGORY)
            .find(([, id]) => id === cat.id)?.[0];
            
          return { 
            ...cat, 
            count: genreKey ? (counts[genreKey] ?? 0) : 0 
          };
        }));

      } catch (e) {
        console.error('Home data fetching failed:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <main className="bg-white font-sans">
      <HomeHero banner={banner} />

      <HomeCategories categories={categories} />

      <HomePopularProducts skus={skus} loading={loading} />

      <HomePlatformIntro />
    </main>
  );
}