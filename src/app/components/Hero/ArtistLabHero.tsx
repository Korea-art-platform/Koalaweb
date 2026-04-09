import { useTranslation } from 'react-i18next';

export default function ArtistLabHero() {
  const { t } = useTranslation();

  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 md:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="max-w-2xl">
          <div className="text-[10px] md:text-sm text-gray-400 tracking-[0.2em] mb-3 md:mb-4 uppercase font-bold">
            {t('artistLab.hero.badge') as string}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl mb-2 md:mb-4 tracking-tight font-bold leading-[1.2]">
            {t('artistLab.hero.title1') as string}
          </h1>
          <h1 className="text-3xl sm:text-4xl md:text-6xl mb-6 tracking-tight font-bold leading-[1.2]">
            {t('artistLab.hero.title2') as string}
          </h1>
          <p className="text-sm md:text-xl text-gray-500 leading-relaxed max-w-lg break-keep">
            {t('artistLab.hero.description') as string}
          </p>
        </div>
      </div>
    </section>
  );
}