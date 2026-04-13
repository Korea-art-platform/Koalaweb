import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

export default function HomePlatformIntro() {
  const { t } = useTranslation();

  return (
    <section className="py-24 px-6 md:px-12 bg-gray-50 border-y border-gray-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="order-2 lg:order-1">
          <div className="text-[10px] md:text-xs text-indigo-500 font-black tracking-[0.2em] mb-4 uppercase">
            {t('home.intro.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tighter">
            {t('home.intro.title')}
          </h2>
          <p className="text-base md:text-lg text-gray-500 leading-relaxed mb-10">
            {t('home.intro.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/artist-lab" className="px-8 py-4 bg-black text-white rounded-full font-bold hover:bg-gray-800 text-center">
              {t('home.intro.exploreArtist')}
            </Link>
            <Link to="/ar-view" className="px-8 py-4 border-2 border-black rounded-full font-bold hover:bg-black hover:text-white text-center">
              {t('home.intro.tryAR')}
            </Link>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ0hzEOYPkyRA1dh4RzFqNE3Zs80bd6jZMDA&s" alt="Vision" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}