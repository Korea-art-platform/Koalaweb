import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import StoreHero from '@/app/components/Hero/StoreHero';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreFilterSheet, { type SheetValue } from '@/app/components/store/StoreFilterSheet';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import StoreOriginalShowcase from '@/app/components/store/StoreOriginalShowcase';
import { ALL, isOrder, priceRangeOf } from '@/app/components/store/storeOptions';
import { getSkus, getGenreCounts, getMainCategoryCounts, type SkuFilter } from '@/api/sku';
import { getArtists } from '@/api/artist';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';
import { useCategories } from '@/app/hooks/useCategories';
import { useOriginalCategoryCode } from '@/app/hooks/useOriginalCategory';
import type { Artist, Sku, PageResponse } from '@/api/types';
import PageMeta from '@/app/components/common/PageMeta';

const PAGE_SIZE = 12;

export default function SmartStore() {
  // 조건은 주소에 담는다. 뒤로가기와 링크 공유가 저절로 되고,
  // 홈에서 "전체보기"로 넘어올 때 고른 분류도 그대로 받는다.
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') ?? ALL;
  const selectedMain = searchParams.get('main') ?? ALL;
  const selectedArtist = searchParams.get('artist') ?? ALL;
  const priceBand = searchParams.get('price') ?? ALL;
  const rawOrder = searchParams.get('order');
  const order = isOrder(rawOrder) ? rawOrder : 'RECOMMENDED';

  const [sheetOpen, setSheetOpen] = useState(false);

  // 기본값(전체·추천순)은 주소에서 뺀다
  const update = (changes: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value === ALL || (key === 'order' && value === 'RECOMMENDED')) next.delete(key);
      else next.set(key, value);
    });
    setSearchParams(next, { replace: true });
  };

  const pickArtist = (code: string) => {
    update({ artist: code });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // 작가 목록은 작가 얼굴 줄과 작가 조명이 같이 쓴다
  const { data: artists = [] } = useQuery<Artist[]>({
    queryKey: ['artists', 'trending'],
    queryFn: async () => {
      const res = await getArtists(0, 20);
      const page: PageResponse<Artist> = res.data.data;
      return page.content ?? [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const { sub: subCategories, main: mainList } = useCategories();
  const originalCode = useOriginalCategoryCode();

  // 작품이 하나도 없는 분류는 눌러 봐야 빈 화면이라 아예 내보내지 않는다.
  const categories = [
    ALL,
    ...subCategories.filter((c) => (genreCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];
  const mainCategories = [
    ALL,
    ...mainList.filter((c) => (mainCounts[c.code] ?? 0) > 0).map((c) => c.code),
  ];
  const mainCountMap = { ...mainCounts, [ALL]: mainCounts.ALL };

  // 거르는 일은 서버가 한다. 한 페이지 안에서 걸러 봐야 뒤 페이지 작품을 세지 못한다.
  const filter: SkuFilter = {
    genre: selectedCategory === ALL ? undefined : selectedCategory,
    mainCategory: selectedMain === ALL ? undefined : selectedMain,
    artist: selectedArtist === ALL ? undefined : selectedArtist,
    ...priceRangeOf(priceBand === ALL ? null : priceBand),
    order,
  };

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['skus', 'store', filter],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const res = await getSkus(pageParam, PAGE_SIZE, filter);
      return res.data.data as PageResponse<Sku>;
    },
    // 서버 응답의 쪽 번호 이름(page)이 타입(number)과 달라, 받아 온 쪽 수로 센다
    getNextPageParam: (last, pages) => (pages.length < last.totalPages ? pages.length : undefined),
  });
  const skus = useMemo(() => data?.pages.flatMap((p) => p.content) ?? [], [data]);
  const total = data?.pages[0]?.totalElements ?? 0;

  // 목록 위 원작 줄 — 추천순이고 다른 조건을 안 걸었을 때만(에디션은 전체·원작)
  const showShowcase = order === 'RECOMMENDED' && originalCode != null
    && (selectedMain === ALL || selectedMain === originalCode)
    && selectedCategory === ALL && selectedArtist === ALL && priceBand === ALL;
  const { data: originals = [] } = useQuery<Sku[]>({
    queryKey: ['skus', 'store-originals', originalCode],
    enabled: showShowcase,
    queryFn: async () => {
      const res = await getSkus(0, 12, { mainCategory: originalCode ?? undefined, order: 'RECOMMENDED' });
      return (res.data.data as PageResponse<Sku>).content ?? [];
    },
    staleTime: 1000 * 60,
  });

  // 창이 열려 있는 동안 매번 새 객체를 넘기면 고르던 값이 되돌아간다
  const sheetValue = useMemo<SheetValue>(
    () => ({ category: selectedCategory, price: priceBand, order }),
    [selectedCategory, priceBand, order],
  );
  const sheetCount = [selectedCategory !== ALL, priceBand !== ALL, order !== 'RECOMMENDED'].filter(Boolean).length;

  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  return (
    <div className="min-h-screen">
      <PageMeta title="아티스트 컬렉터블" description="엄선된 아트 상품과 소장 가치 있는 작품을 작가·분류·가격대별로 만나보세요." />
      <StoreHero artistCount={artists.length} total={data ? total : null} />
      <StoreFilter
        artists={artists}
        selectedArtist={selectedArtist}
        onSelectArtist={(code) => update({ artist: code })}
        mainCategories={mainCategories}
        mainCounts={mainCountMap}
        selectedMain={selectedMain}
        onSelectMain={(code) => update({ main: code })}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(code) => update({ category: code })}
        priceBand={priceBand}
        onSelectPrice={(key) => update({ price: key })}
        order={order}
        onSelectOrder={(o) => update({ order: o })}
        onOpenSheet={() => setSheetOpen(true)}
        sheetCount={sheetCount}
      />
      {showShowcase && originals.length > 0 && <StoreOriginalShowcase works={originals} />}
      <StoreProductGrid
        loading={isLoading}
        skus={skus}
        total={total}
        hasMore={Boolean(hasNextPage)}
        loadingMore={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        artists={artists}
        onPickArtist={pickArtist}
        onReset={() => setSearchParams(new URLSearchParams(), { replace: true })}
        wishlistedCodes={wishlistedCodes}
        wishlistLoading={wishlistLoading}
        onWishlistClick={handleWishlist}
      />
      <StoreFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        categories={categories}
        value={sheetValue}
        onApply={(v) => update({ category: v.category, price: v.price, order: v.order })}
      />
    </div>
  );
}
