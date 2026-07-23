import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Navigation from '@/app/components/layouts/Header';
import StoreHero from '@/app/components/Hero/StoreHero';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import TrendingArtists from '@/app/components/Artist/TrendingArtists';
import { getSkus, getGenreCounts } from '@/api/sku';
import { getWishlist, addWishlist, removeWishlist } from '@/api/wishlist';
import type { Sku, WishlistItem, PageResponse } from '@/api/types';

const ALL_CATEGORIES = ['All', 'ART_TOY', 'SCULPTURE', 'CERAMIC', 'PAINTING', 'GOODS'];

export default function SmartStore() {
  const queryClient = useQueryClient();
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
  const categories = ALL_CATEGORIES.filter((c) => c === 'All' || (genreCounts[c] ?? 0) > 0);

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

  // 위시리스트 코드 목록
  const { data: wishlistedCodes = new Set<string>() } = useQuery<Set<string>>({
    queryKey: ['wishlist-codes'],
    queryFn: async () => {
      const res = await getWishlist(0, 100);
      const items: WishlistItem[] = res.data?.data?.content ?? [];
      return new Set(items.map((item) => item.skuCode));
    },
    retry: false,
  });

  // 위시리스트 로딩 중인 코드 (낙관적 UI)
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());

  const wishlistMutation = useMutation({
    mutationFn: async ({ skuCode, isWishlisted }: { skuCode: string; isWishlisted: boolean }) => {
      if (isWishlisted) {
        await removeWishlist(skuCode);
      } else {
        await addWishlist(skuCode);
      }
      return { skuCode, isWishlisted };
    },
    onSuccess: ({ skuCode, isWishlisted }) => {
      queryClient.setQueryData<Set<string>>(['wishlist-codes'], (prev = new Set()) => {
        const next = new Set(prev);
        if (isWishlisted) next.delete(skuCode);
        else next.add(skuCode);
        return next;
      });
    },
    onError: (e) => console.error('위시리스트 처리 실패:', e),
    onSettled: (_data, _err, { skuCode }) => {
      setWishlistLoading((prev) => {
        const next = new Set(prev);
        next.delete(skuCode);
        return next;
      });
    },
  });

  const handleWishlist = (e: React.MouseEvent, skuCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading.has(skuCode)) return;
    setWishlistLoading((prev) => new Set(prev).add(skuCode));
    wishlistMutation.mutate({ skuCode, isWishlisted: wishlistedCodes.has(skuCode) });
  };

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
