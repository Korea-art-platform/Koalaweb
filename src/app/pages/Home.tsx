import { useEffect, useState } from 'react';
import { getGenreCounts } from '@/api/sku';
import { fetchAllSkus } from '@/api/fetchAllSkus';
import { getBanners } from '@/api/banner';
import { getNotices, type NoticeItem } from '@/api/notice';
import { useCategories } from '@/app/hooks/useCategories';
import { useOriginalCategoryCode } from '@/app/hooks/useOriginalCategory';
import type { Sku, Banner, Artist, PageResponse } from '@/api/types';
import { useQuery } from '@tanstack/react-query';
import { getArtists } from '@/api/artist';

import HomeHero from '@/app/components/Home/HomeHero';
import { StickyHero, RisingPanel } from '@/app/components/layouts/RisingPanel';
import HomeOriginal from '@/app/components/Home/HomeOriginal';
import HomeLimitedEdition from '@/app/components/Home/HomeLimitedEdition';
import HomeGenreCollections from '@/app/components/Home/HomeGenreCollections';
import HomeCategorySections from '@/app/components/Home/HomeCategorySections';
import HomeArtists from '@/app/components/Home/HomeArtists';
import HomeStudio from '@/app/components/Home/HomeStudio';
import HomeNotices from '@/app/components/Home/HomeNotices';
import PageMeta from '@/app/components/common/PageMeta';

const LIMITED = 'LIMITED';

export default function Home() {
  const [skus, setSkus] = useState<Sku[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [studioBanner, setStudioBanner] = useState<Banner | null>(null);
  const [genreCounts, setGenreCounts] = useState<Record<string, number>>({});
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { sub: subCategories } = useCategories();
  const originalCode = useOriginalCategoryCode();

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

  // 원작이 제일 위 등급이라 한정판보다 먼저 걸러 낸다 —
  // 원작이면서 한정판인 작품이 아래 한정판 줄에 또 나오지 않게 한다.
  const originalSkus = originalCode
    ? skus.filter((s) => s.mainCategory === originalCode)
    : [];
  const originalCodes = new Set(originalSkus.map((s) => s.skuCode));
  const limitedSkus = skus.filter(
    (s) => !originalCodes.has(s.skuCode) && (s.mainCategory === LIMITED || s.isLimitedEdition),
  );
  const heroFeatured = (limitedSkus.length ? limitedSkus : skus)
    .filter((s) => s.status === 'ACTIVE')
    .slice(0, 12);

  return (
    <main className="bg-koala-navy font-sans">
      <PageMeta title="한국 미술 작품 마켓" description="한국 작가의 원작·한정판·오픈에디션 작품을 만나보세요. 조각·아트토이·굿즈·회화까지, KOALA에서 소장하세요." />
      {/* 히어로는 제자리에 붙어 있는다. 스크롤을 내리면 히어로가 밀려 올라가는 게
          아니라, 아래 섹션들이 한 장의 판처럼 그 위로 올라와 덮는다.
          sticky 는 부모 높이 안에서만 붙으므로 부모는 main 이어야 한다 —
          히어로를 딱 맞는 상자로 감싸면 붙을 여유가 0 이라 아예 붙지 않는다. */}
      <StickyHero>
        <HomeHero banners={banners} featured={heroFeatured} />
      </StickyHero>

      <RisingPanel>
        <HomeOriginal skus={originalSkus} loading={loading} categoryCode={originalCode} />
        <HomeLimitedEdition skus={limitedSkus} loading={loading} />
        <HomeGenreCollections genreCounts={genreCounts} skus={skus} />
        <HomeCategorySections categories={subCategories} skus={skus} />
        <HomeArtists artists={artists} />
        <HomeStudio banner={studioBanner} />
        <HomeNotices notices={notices} />
      </RisingPanel>
    </main>
  );
}
