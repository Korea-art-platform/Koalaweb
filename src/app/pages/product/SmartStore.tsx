import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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

  const { data: genreCounts = {} } = useQuery<Record<string, number>>({
    queryKey: ['genre-counts'],
    queryFn: async () => {
      const res = await getGenreCounts();
      return (res.data.data ?? {}) as Record<string, number>;
    },
  });

  const { sub: subCategories } = useCategories();
  const categories = [
    'All',
    ...subCategories.filter((c) => (genreCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];

  const { data: skuPage, isLoading: loading } = useQuery({
    queryKey: ['skus', page],
    queryFn: async () => {
      const res = await getSkus(page, 12);
      return res.data.data as PageResponse<Sku>;
    },
  });
  const skus: Sku[] = skuPage?.content ?? [];
  const totalPages: number = skuPage?.totalPages ?? 0;

  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  const filteredSkus = selectedCategory === 'All'
    ? skus
    : skus.filter((sku) => sku.genre === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
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
      <div className="px-6 md:px-8 max-w-[1600px] mx-auto pb-20">
        <TrendingArtists />
      </div>
    </div>
  );
}
