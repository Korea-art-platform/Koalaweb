import Navigation from '@/app/components/layouts/Header';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export function ProductNotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 pb-32 px-8 flex flex-col items-center">
        <h1 className="text-3xl mb-8 font-medium">{t('product.detail.notFound.title')}</h1>
        <Link to="/store" className="px-8 py-4 bg-koala-navy text-white rounded-full font-medium">
          {t('product.detail.notFound.backToStore')}
        </Link>
      </div>
    </div>
  );
}
