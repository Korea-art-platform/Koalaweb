import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/app/components/products/ProductCard';
import { useWishlistToggle } from '@/app/hooks/useWishlistToggle';

interface HomePopularProductsProps {
  skus: any[];
  loading: boolean;
}

export default function HomePopularProducts({ skus, loading }: HomePopularProductsProps) {
  const { t } = useTranslation();
  const { wishlistedCodes, wishlistLoading, handleWishlist } = useWishlistToggle();

  if (loading) {
    return (
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-[1800px] mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-3xl mb-4" />
              <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (skus.length === 0) {
    return (
      <div className="text-center py-20 bg-white">
        <p className="text-gray-400 text-lg">{t('home.popularProducts.noData.title')}</p>
      </div>
    );
  }

  return (
    <section className="py-10 md:py-20 px-4 md:px-12 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-end justify-between mb-6 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-5xl font-bold tracking-tight mb-1 md:mb-4 text-black">{t('home.popularProducts.title')}</h2>
            <p className="text-gray-500 text-xs md:text-base font-medium">{t('home.popularProducts.subtitle')}</p>
          </div>
          <Link to="/smart-store" className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-500 transition-all">
            {t('home.popularProducts.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {skus.map((sku) => (
            <ProductCard
              key={sku.skuCode}
              sku={sku}
              viewMode="grid"
              isWishlisted={wishlistedCodes.has(sku.skuCode)}
              isWishlistLoading={wishlistLoading.has(sku.skuCode)}
              onWishlistClick={handleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
