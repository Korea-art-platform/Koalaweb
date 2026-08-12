import { useEffect, useState } from 'react';
import { getSkus, getGenreCounts } from '@/api/sku';
import { getBanners } from '@/api/banner';
import { getNotices, type NoticeItem } from '@/api/notice';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku, Banner } from '@/api/types';

import HomeHero from '@/app/components/Home/HomeHero';
import HomeLimitedEdition from '@/app/components/Home/HomeLimitedEdition';
import HomeGenreCollections from '@/app/components/Home/HomeGenreCollections';
import HomeCategorySections from '@/app/components/Home/HomeCategorySections';
import HomeStudio from '@/app/components/Home/HomeStudio';
import HomeNotices from '@/app/components/Home/HomeNotices';

/** 대분류가 이 코드인 상품만 한정판 섹션에 올린다 */
const LIMITED = 'LIMITED';

/**
 * 홈 구성
 *  Hero → 한정판 → 장르별 컬렉션 → 소분류별 상품 → 작가의 공방 → 공지사항
 *
 * 소분류 섹션은 고정이 아니다. 관리자가 카테고리를 추가하면 섹션이 늘고,
 * 상품이 없는 카테고리는 나타나지 않는다.
 * 상품은 한 번만 받아 프론트에서 분류한다(현재 상품 수가 적어 별도 API 불필요).
 */
export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [studioBanner, setStudioBanner] = useState<Banner | null>(null);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { sub: subCategories } = useCategories();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [skuRes, bannerRes, mainSubRes, genreRes, noticeRes] = await Promise.allSettled([
          getSkus(0, 100),
          getBanners('MAIN'),
          getBanners('MAIN_SUB'),
          getGenreCounts(),
          getNotices(),
        ]);

        if (skuRes.status === 'fulfilled') setSkus(skuRes.value.data.data.content ?? []);
        if (bannerRes.status === 'fulfilled') setBanners(bannerRes.value.data.data ?? []);
        if (mainSubRes.status === 'fulfilled') {
          const subs: Banner[] = mainSubRes.value.data.data ?? [];
          setStudioBanner(subs.length > 0 ? subs[0] : null);
        }
        if (genreRes.status === 'fulfilled') setGenreCounts(genreRes.value.data.data ?? {});
        if (noticeRes.status === 'fulfilled') setNotices(noticeRes.value.data.data ?? []);
      } catch (e) {
        console.error('Home data fetching failed:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // 옛 상품은 mainCategory 가 비어 있을 수 있어 isLimitedEdition 으로도 받는다
  const limitedSkus = skus.filter((s) => s.mainCategory === LIMITED || s.isLimitedEdition);

  return (
    <main className="bg-white font-sans">
      <HomeHero banners={banners} />
      <HomeLimitedEdition skus={limitedSkus} loading={loading} />
      <HomeGenreCollections genreCounts={genreCounts} skus={skus} />
      <HomeCategorySections categories={subCategories} skus={skus} />
      <HomeStudio banner={studioBanner} />
      <HomeNotices notices={notices} />
    </main>
  );
}
