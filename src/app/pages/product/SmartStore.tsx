import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navigation from '@/app/components/layouts/Header';
import StoreHero from '@/app/components/Hero/StoreHero';
import StoreFilter from '@/app/components/store/StoreFilter';
import StoreProductGrid from '@/app/components/store/StoreProductGrid';
import { getSkus } from '@/api/sku';
import { getWishlist, addWishlist, removeWishlist } from '@/api/wishlist';

const categories = ['All', 'ART_TOY', 'SCULPTURE', 'CERAMIC', 'PAINTING', 'GOODS'];

export default function SmartStore() {
  const navigate = useNavigate();
  
  const [skus, setSkus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'large'>('grid');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [wishlistedCodes, setWishlistedCodes] = useState<Set<string>>(new Set());
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSkus = async () => {
      setLoading(true);
      try {
        const res = await getSkus(page, 12);
        const data = res.data.data;
        setSkus(data.content ?? []);
        setTotalPages(data.totalPages ?? 0);
      } catch (e) {
        console.error('SKU 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchSkus();
  }, [page]);
  useEffect(() => {
    getWishlist(0, 100)
      .then((res: any) => {
        const items = res.data?.data?.content ?? [];
        setWishlistedCodes(new Set(items.map((item: any) => item.skuCode)));
      })
      .catch(() => {});
  }, []);
  const handleWishlist = async (e: React.MouseEvent, skuCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading.has(skuCode)) return;
    setWishlistLoading((prev) => new Set(prev).add(skuCode));
    try {
      if (wishlistedCodes.has(skuCode)) {
        await removeWishlist(skuCode);
        setWishlistedCodes((prev) => {
          const next = new Set(prev);
          next.delete(skuCode);
          return next;
        });
      } else {
        await addWishlist(skuCode);
        setWishlistedCodes((prev) => new Set(prev).add(skuCode));
      }
    } catch (err) {
      console.error('위시리스트 처리 실패:', err);
    } finally {
      setWishlistLoading((prev) => {
        const next = new Set(prev);
        next.delete(skuCode);
        return next;
      });
    }
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
    </div>
  );
}