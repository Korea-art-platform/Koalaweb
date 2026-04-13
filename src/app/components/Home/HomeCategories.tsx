import { useRef } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HomeCategoriesProps {
  categories: any[];
}

export default function HomeCategories({ categories }: HomeCategoriesProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{t('home.categories.title')}</h2>
            <p className="text-gray-400 text-sm md:text-base font-medium">{t('home.categories.subtitle')}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full border border-gray-100 hover:bg-gray-50 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((category) => (
            <Link key={category.id} to={`/smart-store?category=${category.id}`} className="flex-shrink-0 group">
              <div className="px-8 py-6 bg-gray-50 rounded-2xl border border-transparent group-hover:border-black group-hover:bg-white transition-all duration-300 min-w-[200px]">
                <h3 className="text-lg font-bold mb-1">{t(`home.categories.list.${category.id}`)}</h3>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{category.count} {t('home.categories.items')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}