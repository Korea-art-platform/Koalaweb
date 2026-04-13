import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HomePopularProductsProps {
  skus: any[];
  loading: boolean;
}

export default function HomePopularProducts({ skus, loading }: HomePopularProductsProps) {
  const { t } = useTranslation();

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
    <section className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-black">{t('home.popularProducts.title')}</h2>
            <p className="text-gray-500 font-medium">{t('home.popularProducts.subtitle')}</p>
          </div>
          <Link to="/smart-store" className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-500 transition-all">
            {t('home.popularProducts.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:grid-flow-row-dense gap-4 md:gap-8">
          {skus.map((sku, index) => (
            <Link key={sku.skuCode} to={`/product/${sku.skuCode}`} className={`group flex flex-col ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
              <div className="relative flex-1 rounded-3xl overflow-hidden bg-gray-100 mb-4">
                <img src={sku.primaryImageUrl} alt={sku.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 transition-all">
                    <ArrowRight className="w-6 h-6 text-black" />
                  </div>
                </div>
              </div>
              <div className="px-1">
                <h3 className="text-base md:text-xl font-bold mb-1 group-hover:text-gray-500 transition-colors">{sku.name}</h3>
                <p className="text-sm md:text-lg font-black tracking-tight">₩{(sku.salePrice ?? sku.listPrice).toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}