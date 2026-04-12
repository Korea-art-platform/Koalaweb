import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="pt-20 md:pt-24 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="relative bg-gray-900 rounded-2xl md:rounded-3xl overflow-hidden group">

          {/* Aspect Ratio Container: 모바일에서는 4:5 정도, PC에서는 21:9 */}
          <div
            className="relative w-full min-h-[500px] md:min-h-0"
            style={{ paddingBottom: 'clamp(125%, 42.857%, 42.857%)' }}
          >
            <div className="absolute inset-0 w-full h-full">
              <img
                src="https://cdn.iusm.co.kr/news/photo/202501/1048414_600697_3834.jpg"
                alt="Featured Art"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 md:bg-black/40" />
            </div>

            {/* Content Layer */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6 md:px-16">
              <div className="max-w-3xl z-10 text-white">
                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-white text-black text-[10px] md:text-xs font-bold tracking-wider uppercase rounded-full mb-4 md:mb-6">
                  {t('home.hero.badge')}
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-4 md:mb-6 tracking-tight font-bold leading-[1.2] md:leading-tight">
                  {t('home.hero.defaultTitle')}
                  <br />
                  <span className="inline-block mt-1 md:mt-0">{t('home.hero.defaultSubtitle')}</span>
                </h1>

                <p className="text-base md:text-xl text-gray-200 leading-relaxed mb-6 md:mb-8 opacity-90 max-w-md md:max-w-2xl mx-auto break-keep">
                  {t('home.hero.description')}
                </p>

                <Link
                  to="/smart-store"
                  className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 bg-white text-black rounded-full hover:bg-gray-100 transition-all duration-300 hover:gap-4 font-semibold text-sm md:text-base"
                >
                  {t('home.hero.shopNow')}
                  <ArrowRight className="w-4 h-4 md:w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;