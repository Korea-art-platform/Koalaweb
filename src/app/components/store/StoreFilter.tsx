import { Filter, Grid3x3, LayoutGrid } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StoreFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  viewMode: 'grid' | 'large';
  onViewModeChange: (mode: 'grid' | 'large') => void;
}
export default function StoreFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  viewMode,
  onViewModeChange,
}: StoreFilterProps) {
  const { t } = useTranslation();
  return (
    <section className="px-5 md:px-8 lg:px-12 pb-8 md:pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-1">
            <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onSelectCategory(category)}
                className={`px-4 py-1.5 rounded-full text-xs md:text-sm transition-all whitespace-nowrap border ${
                  selectedCategory === category
                    ? 'bg-koala-navy text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-900'
                }`}>
                {t(`store.categories.${category}`) as string}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'
              }`}>
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('large')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'large' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'
              }`}>
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}