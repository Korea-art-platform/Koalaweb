import { useEffect, useState } from 'react';
import { getGenreCounts } from '@/api/sku';
import { fetchAllSkus } from '@/api/fetchAllSkus';
import { getBanners } from '@/api/banner';
import { getNotices, type NoticeItem } from '@/api/notice';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku, Banner, Artist, PageResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/api/artist';

import HomeHero from '@/app/components/Home/HomeHero';
import HomeLimitedEdition from '@/app/components/Home/HomeLimitedEdition';
import HomeGenreCollections from '@/app/components/Home/HomeGenreCollections';
import HomeCategorySections from '@/app/components/Home/HomeCategorySections';
import HomeArtists from '@/app/components/Home/HomeArtists';
import HomeStudio from '@/app/components/Home/HomeStudio';
import HomeNotices from '@/app/components/Home/HomeNotices';

const LIMITED = 'LIMITED';

export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [studioBanner, setStudioBanner] = useState<Banner | null>(null);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { sub: subCategories } = useCategories();

  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['artists', 'header'],
    queryFn: async () => {
      const res = await getArtists(0, 10);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [skuRes, bannerRes, mainSubRes, genreRes, noticeRes] = await Promise.allSettled([
          fetchAllSkus(),
          getBanners('MAIN'),
          getBanners('MAIN_SUB'),
          getGenreCounts(),
          getNotices(),
        ]);

        if (skuRes.status === 'fulfilled') setSkus(skuRes.value);
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

  const limitedSkus = skus.filter((s) => s.mainCategory === LIMITED || s.isLimitedEdition);
  const heroFeatured = (limitedSkus.length ? limitedSkus : skus)
    .filter((s) => s.status === 'ACTIVE')
    .slice(0, 12);

  return (
    <main className="bg-white font-sans">
      <HomeHero banners={banners} featured={heroFeatured} />
      <HomeLimitedEdition skus={limitedSkus} loading={loading} />
      <HomeGenreCollections genreCounts={genreCounts} skus={skus} />
      <HomeCategorySections categories={subCategories} skus={skus} />
      <HomeArtists artists={artists} />
      <HomeStudio banner={studioBanner} />
      <HomeNotices notices={notices} />
    </main>
  );
}
