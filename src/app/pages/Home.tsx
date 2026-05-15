import { useEffect, useState } from 'react';
import { getSkus, getGenreCounts } from '@/api/sku';
import { getBanners } from '@/api/banner';
import type { Sku, Banner } from '@/api/types';

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

  const [skus, setSkus] = useState<Sku[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [mainSubBanner, setMainSubBanner] = useState<Banner | null>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        
        // 병렬 요청으로 로딩 속도 최적화
        const [skuRes, bannerRes, mainSubRes, genreRes] = await Promise.all([
          getSkus(0, 8),
          getBanners('MAIN'),
          getBanners('MAIN_SUB'),
          getGenreCounts()
        ]);

        // 1. 상품 데이터 설정
        setSkus(skuRes.data.data.content ?? []);

        // 2. 메인 히어로 배너 설정
        setBanners(bannerRes.data.data ?? []);

        // 3. 메인 서브 배너 설정 (첫 번째 활성 배너 1개만 사용)
        const subBanners: Banner[] = mainSubRes.data.data ?? [];
        setMainSubBanner(subBanners.length > 0 ? subBanners[0] : null);

        // 4. 카테고리별 수량 가공
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
      <HomeHero banners={banners} />

      <HomeCategories categories={categories} />

      <HomePopularProducts skus={skus} loading={loading} />

      <HomePlatformIntro banner={mainSubBanner} />
    </main>
  );
}