import { useTranslation } from 'react-i18next';
import ProductCard from '@/app/components/products/ProductCard';

interface StoreProductGridProps {
  loading: boolean;
  skus: any[];
  viewMode: 'grid' | 'large';
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  wishlistedCodes: Set<string>;
  wishlistLoading: Set<string>;
  onWishlistClick: (e: React.MouseEvent, skuCode: string) => void;
}

export default function StoreProductGrid({
  loading,
  skus,
  viewMode,
  page,
  totalPages,
  onPageChange,
  wishlistedCodes,
  wishlistLoading,
  onWishlistClick,
}: StoreProductGridProps) {
  const { t } = useTranslation();

  return (
    <section className="px-5 md:px-8 lg:px-12 pb-32">
      <div className="max-w-[1600px] mx-auto">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-2xl mb-4" />
                <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : skus.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 px-8 py-20 text-center">
            <h2 className="text-xl mb-2 font-medium">{t('store.emptyState.title') as string}</h2>
            <p className="text-sm text-gray-400">{t('store.emptyState.description') as string}</p>
          </div>
        ) : (
          <>
            <div
              className={`grid ${
                viewMode === 'grid'
                  ? 'grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-8 lg:gap-12'
                  : 'grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12'
              }`}
            >
              {skus.map((sku) => (
                <ProductCard
                  key={sku.skuCode}
                  sku={sku}
                  viewMode={viewMode}
                  isWishlisted={wishlistedCodes.has(sku.skuCode)}
                  isWishlistLoading={wishlistLoading.has(sku.skuCode)}
                  onWishlistClick={onWishlistClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-16">
                <button
                  onClick={() => onPageChange(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                >
                  {t('common.prev') as string}
                </button>
                <span className="px-6 py-2 text-sm text-gray-500">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="px-6 py-2 rounded-full border border-gray-200 text-sm disabled:opacity-30 hover:border-black transition-colors"
                >
                  {t('common.next') as string}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
