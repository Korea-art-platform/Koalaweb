import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import type { Banner } from '@/api/types';

interface HomePlatformIntroProps {
  banner: Banner | null;
}

export default function HomePlatformIntro({ banner }: HomePlatformIntroProps) {
  const { t } = useTranslation();

  const title       = banner?.title    || t('home.intro.title');
  const description = banner?.subtitle || t('home.intro.description');
  const primaryLink = banner?.linkUrl  || '/artist-lab';
  const imageUrl    = banner?.imageUrl ?? null;

  return (
    <section className="py-12 md:py-24 px-4 md:px-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="text-[10px] md:text-xs text-indigo-500 font-black tracking-[0.2em] mb-3 md:mb-4 uppercase">
            {t('home.intro.badge')}
          </div>
          <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tighter break-keep">
            {title}
          </h2>
          <p className="text-sm md:text-lg text-gray-500 leading-relaxed mb-6 md:mb-10 break-keep">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to={primaryLink} className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 text-center">
              {t('home.intro.exploreArtist')}
            </Link>
            {/* AR 뷰어 준비 중
            <Link to="/ar-view" className="px-8 py-4 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white text-center">
              {t('home.intro.tryAR')}
            </Link>
            */}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="aspect-[3/2] md:aspect-[4/5] rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl md:rotate-2 hover:rotate-0 transition-transform bg-gray-200">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
