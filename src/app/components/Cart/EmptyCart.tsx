import { Link } from 'react-router';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function EmptyCart() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <ShoppingBag className="w-16 h-16 mx-auto text-gray-200 mb-4" />
      <h2 className="text-2xl mb-2">{t('cart.emptyState.title')}</h2>
      <p className="text-gray-500 mb-8">{t('cart.emptyState.description')}</p>
      <Link
        to="/store"
        className="inline-flex items-center gap-2 px-8 py-4 bg-koala-navy text-white rounded-full hover:bg-koala-navy-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('cart.emptyState.continueShopping')}
      </Link>
    </div>
  );
}
