import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Share2 } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/fallback/ImageWithFallback';
import { useTranslation } from 'react-i18next';

interface ArtistHeroProps {
  artist: any;
}

export function ArtistHero({ artist }: ArtistHeroProps) {
  const navigate = useNavigate();
  const { t } = useTranslation('artistLab'); // 🌟 네임스페이스 지정

  return (
    <>
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 py-2 text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{t('detail.back')}</span>
        </button>
        <button className="p-2 text-gray-500 md:hidden">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 mb-20 md:mb-32">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gray-50 aspect-[3/4] shadow-xl">
          <ImageWithFallback
            src={artist.profileImageUrl ?? 'https://via.placeholder.com/400'}
            alt={artist.name}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
          />
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-8 md:mb-10">
            <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.3em] uppercase mb-4 font-bold">
              {t('detail.labels.artist')}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 tracking-tighter leading-none">
              {artist.name}
            </h1>
            <p className="text-base md:text-xl text-gray-600 leading-relaxed break-keep">
              {artist.description ?? t('detail.emptyDescription')}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/smart-store"
              className="flex-1 py-4 md:py-5 bg-black text-white rounded-full font-bold text-sm md:text-base hover:bg-gray-800 transition-all active:scale-95 text-center"
            >
              {t('detail.viewWorks')}
            </Link>
            <button className="px-10 py-4 md:py-5 border border-gray-200 rounded-full font-bold text-sm md:text-base hover:bg-gray-50 transition-all hidden sm:block">
              {t('detail.share')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}