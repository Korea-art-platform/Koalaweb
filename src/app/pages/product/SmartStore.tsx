import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/app/components/layouts/Header';
import StoreHero from '@/app/components/Hero/StoreHero';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import TrendingArtists from '@/app/components/Artist/TrendingArtists';
import { getSkus, getGenreCounts } from '@/api/sku';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useCategories } from '@/app/hooks/useCategories';
import type { Sku, PageResponse } from '@/api/types';

export default function SmartStore() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(0);

  // 장르별 상품 수 → 상품 있는 카테고리만 노출 ('전체'는 항상 표시)
  const { data: genreCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['genre-counts'],
    queryFn: async () => {
      const res = await getGenreCounts();
      return (res.data.data ?? {}) as Record<string, number>;
    },
  });
  // 카테고리 목록은 서버가 관리한다 — 관리자가 추가한 소분류가 바로 필터에 나타난다
  const { sub: subCategories } = useCategories();
  const categories = [
    'All',
    ...subCategories.filter((c) => (genreCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];

  // SKU 목록
  const { data: skuPage, isLoading: loading } = useQuery({
    queryKey: ['skus', page],
    queryFn: async () => {
      const res = await getSkus(page, 12);
      return res.data.data as PageResponse<Sku>;
    },
  });
  const skus: Sku[] = skuPage?.content ?? [];
  const totalPages: number = skuPage?.totalPages ?? 0;

  // 위시리스트 토글 (홈과 공유하는 훅)
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  const filteredSkus = selectedCategory === 'All'
    ? skus
    : skus.filter((sku) => sku.genre === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <StoreHero />
      <StoreFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      <StoreProductGrid
        loading={loading}
        skus={filteredSkus}
        viewMode={viewMode}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        wishlistedCodes={wishlistedCodes}
        wishlistLoading={wishlistLoading}
        onWishlistClick={handleWishlist}
      />

      {/* 작가 섹션 */}
      <div className="px-6 md:px-8 max-w-[1600px] mx-auto pb-20">
        <TrendingArtists />
      </div>
    </div>
  );
}
