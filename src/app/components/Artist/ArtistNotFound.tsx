import { Link } from 'react-router';
import Navigation from '@/app/components/layouts/Header';
import { useTranslation } from 'react-i18next';

export function ArtistNotFound() {
  const { t } = useTranslation('artistLab'); 

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="pt-32 pb-32 px-6 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">{t('detail.notFound.title')}</h1>
          <Link to="/artist-lab" className="text-sm underline text-gray-500">
            {t('detail.notFound.backToList')}
          </Link>
        </div>
      </div>
    </div>
  );
}