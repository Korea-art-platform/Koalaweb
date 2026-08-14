import { useTranslation } from 'react-i18next';

export default function StoreHero() {
  const { t } = useTranslation();

  return (
    <section data-hero="light" className="pt-24 md:pt-32 pb-8 md:pb-12 px-5 md:px-8 lg:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-2xl">
          <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.2em] mb-3 md:mb-4 uppercase font-bold">
            {t('store.hero.badge')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl mb-4 md:mb-6 tracking-tight font-bold leading-[1.1]">
            {t('store.hero.title')}
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-500 leading-relaxed max-w-lg break-keep">
            {t('store.hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
