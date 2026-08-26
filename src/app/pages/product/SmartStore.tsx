import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import StoreHero from '@/app/components/Hero/StoreHero';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import TrendingArtists from '@/app/components/Artist/TrendingArtists';
import { getSkus, getGenreCounts } from '@/api/sku';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku, PageResponse } from '@/api/types';

const ALL = 'All';

export default function SmartStore() {
  // 홈에서 "전체보기"로 넘어올 때 어떤 분류를 보려는지 주소에 담겨 온다.
  // 주소를 그대로 상태로 쓰면 뒤로가기와 링크 공유가 저절로 된다.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? ALL;
  const mainCategory = searchParams.get('main') ?? '';

  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(0);

  // 분류를 바꾸면 3페이지에 머물러 있을 이유가 없다. 첫 장으로 돌린다.
  useEffect(() => { setPage(0); }, [selectedCategory, mainCategory]);

  const selectCategory = (code: string) => {
    const next = new URLSearchParams(searchParams);
    if (code === ALL) next.delete('category');
    else next.set('category', code);
    setSearchParams(next, { replace: true });
  };

  const { data: genreCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['genre-counts'],
    queryFn: async () => {
      const res = await getGenreCounts();
      return (res.data.data ?? {}) as Record<string, number>;
    },
  });

  const { sub: subCategories, main: mainCategories } = useCategories();
  const categories = [
    ALL,
    ...subCategories.filter((c) => (genreCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];

  // 거르는 일은 서버가 한다. 한 페이지(12개) 안에서 걸러 봐야
  // 뒤 페이지에 있는 작품은 세지 못해 "0점"으로 보인다.
  const { data: skuPage, isLoading: loading } = useQuery({
    queryKey: ['skus', page, selectedCategory, mainCategory],
    queryFn: async () => {
      const res = await getSkus(page, 12, {
        genre: selectedCategory === ALL ? undefined : selectedCategory,
        mainCategory: mainCategory || undefined,
      });
      return res.data.data as PageResponse<Sku>;
    },
  });
  const skus: Sku[] = skuPage?.content ?? [];
  const totalPages: number = skuPage?.totalPages ?? 0;

  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  const mainLabel = mainCategory
    ? mainCategories.find((c) => c.code === mainCategory)?.name
    : null;

  return (
    <div className="min-h-screen bg-white">
      <StoreHero />
      {mainLabel && (
        <div className="px-6 md:px-8 max-w-[1600px] mx-auto pt-6 flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">{mainLabel}</span>
          <button
            onClick={() => {
              const next = new URLSearchParams(searchParams);
              next.delete('main');
              setSearchParams(next, { replace: true });
            }}
            className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-koala-purple"
          >
            전체 보기
          </button>
        </div>
      )}
      <StoreFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
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
    </div>
  );
}
