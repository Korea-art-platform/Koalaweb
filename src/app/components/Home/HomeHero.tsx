import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HomeHeroProps {
  banner: any;
}

export default function HomeHero({ banner }: HomeHeroProps) {
  const { t } = useTranslation();

  return (
    <section data-hero="dark" className="relative h-[80vh] min-h-[600px] md:h-[85vh] overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={banner?.imageUrl ?? 'https://i.ytimg.com/vi/fNfC7KZ10og/hq720.jpg'}
          alt={banner?.title ?? 'Korean Art Gallery'}
          className="w-full h-full object-cover object-top md:object-center"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="relative h-full flex items-center px-6 md:px-12">
        <div className="max-w-[1800px] mx-auto w-full">
          <div className="max-w-2xl text-white">
            <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md text-[10px] md:text-xs tracking-widest uppercase rounded-full mb-6 border border-white/20">
              {t('home.hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl mb-6 font-bold tracking-tighter leading-[1.1]">
              {banner?.title ?? t('home.hero.defaultTitle')}<br />
              {banner?.subtitle ?? t('home.hero.defaultSubtitle')}
            </h1>
            <p className="text-base md:text-xl text-gray-200 mb-8 max-w-lg break-keep opacity-90">
              {t('home.hero.description')}
            </p>
            <Link
              to={banner?.linkUrl ?? '/store'}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all font-bold group"
            >
              {t('home.hero.shopNow')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}