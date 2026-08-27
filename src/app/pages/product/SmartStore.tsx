import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import StoreHero from '@/app/components/Hero/StoreHero';
import { StickyHero, RisingPanel } from '@/app/components/layouts/RisingPanel';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import TrendingArtists from '@/app/components/Artist/TrendingArtists';
import { getSkus, getGenreCounts, getMainCategoryCounts } from '@/api/sku';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku, PageResponse } from '@/api/types';

const ALL = 'All';

export default function SmartStore() {
  // 홈에서 "전체보기"로 넘어올 때 어떤 분류를 보려는지 주소에 담겨 온다.
  // 주소를 그대로 상태로 쓰면 뒤로가기와 링크 공유가 저절로 된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? ALL;
  const selectedMain = searchParams.get('main') ?? ALL;

  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(0);

  // 분류를 바꾸면 3페이지에 머물러 있을 이유가 없다. 첫 장으로 돌린다.
  useEffect(() => { setPage(0); }, [selectedCategory, selectedMain]);

  const pick = (key: 'category' | 'main') => (code: string) => {
    const next = new URLSearchParams(searchParams);
    if (code === ALL) next.delete(key);
    else next.set(key, code);
    setSearchParams(next, { replace: true });
  };

  const { data: genreCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['genre-counts'],
    queryFn: async () => {
      const res = await getGenreCounts();
      return (res.data.data ?? {}) as Record<string, number>;
    },
  });

  const { data: mainCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['main-category-counts'],
    queryFn: async () => {
      const res = await getMainCategoryCounts();
      return (res.data.data ?? {}) as Record<string, number>;
    },
  });

  const { sub: subCategories, main: mainList } = useCategories();

  // 작품이 하나도 없는 분류는 눌러 봐야 빈 화면이라 아예 내보내지 않는다.
  const categories = [
    ALL,
    ...subCategories.filter((c) => (genreCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];
  const mainCategories = [
    ALL,
    ...mainList.filter((c) => (mainCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];

  // 거르는 일은 서버가 한다. 한 페이지(12개) 안에서 걸러 봐야
  // 뒤 페이지에 있는 작품은 세지 못해 "0점"으로 보인다.
  const { data: skuPage, isLoading: loading } = useQuery({
    queryKey: ['skus', page, selectedCategory, selectedMain],
    queryFn: async () => {
      const res = await getSkus(page, 12, {
        genre: selectedCategory === ALL ? undefined : selectedCategory,
        mainCategory: selectedMain === ALL ? undefined : selectedMain,
      });
      return res.data.data as PageResponse<Sku>;
    },
  });
  const skus: Sku[] = skuPage?.content ?? [];
  const totalPages: number = skuPage?.totalPages ?? 0;

  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  // 히어로가 흰 바탕이면 흰 판이 덮어도 아무것도 안 보인다.
  // 바탕을 옅게 깔아 판의 윗변이 읽히게 한다.
  return (
    <div className="min-h-screen bg-[#F2F0F5]">
      <StickyHero>
        <StoreHero />
      </StickyHero>

      <RisingPanel>
      <StoreFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={pick('category')}
        mainCategories={mainCategories}
        selectedMain={selectedMain}
        onSelectMain={pick('main')}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <StoreProductGrid
        loading={loading}
        skus={skus}
        viewMode={viewMode}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        wishlistedCodes={wishlistedCodes}
        wishlistLoading={wishlistLoading}
        onWishlistClick={handleWishlist}
      />
      <div className="px-6 md:px-8 max-w-[1600px] mx-auto pb-20">
        <TrendingArtists />
      </div>
      </RisingPanel>
    </div>
  );
}
