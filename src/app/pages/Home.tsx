import { useEffect, useState } from 'react';
import { getSkus, getGenreCounts } from '@/api/sku';
import { getBanners } from '@/api/banner';
import { getNotices, type NoticeItem } from '@/api/notice';
import type { Sku, Banner } from '@/api/types';

import HomeHero from '@/app/components/Home/HomeHero';
import HomeLimitedEdition from '@/app/components/Home/HomeLimitedEdition';
import HomeGenreCollections from '@/app/components/Home/HomeGenreCollections';
import HomeGoods from '@/app/components/Home/HomeGoods';
import HomeStudio from '@/app/components/Home/HomeStudio';
import HomeNotices from '@/app/components/Home/HomeNotices';

/**
 * 홈 구성
 *  Hero → 001 한정판 → 002 장르별 컬렉션 → 003 아트 굿즈 → 004 작가의 공방 → 005 공지사항
 *  상품은 한 번만 받아 프론트에서 분류한다(현재 상품 수가 적어 별도 API 불필요).
 */
export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [studioBanner, setStudioBanner] = useState<Banner | null>(null);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 001 한정판 / 003 굿즈 분류
  const limitedSkus = skus.filter((s) => s.isLimitedEdition);
  const goodsSkus = skus.filter((s) => s.genre === 'GOODS' || s.skuType === 'GOODS');

  return (
    <main className="bg-white font-sans">
      <HomeHero banners={banners} />
      <HomeLimitedEdition skus={limitedSkus} loading={loading} />
      <HomeGenreCollections genreCounts={genreCounts} skus={skus} />
      <HomeGoods skus={goodsSkus} />
      <HomeStudio banner={studioBanner} />
      <HomeNotices notices={notices} />
    </main>
  );
}
