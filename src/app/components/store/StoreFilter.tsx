import { Grid3x3, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCategories } from '@/app/hooks/useCategories';

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
  const { subLabel } = useCategories();

  // 'All' 만 번역 리소스를 쓴다. 나머지는 관리자가 붙인 이름이라 서버에서 온다
  const labelOf = (category: string) =>
    category === 'All' ? (t('store.categories.All') as string) : subLabel(category);

  return (
    <section className="px-5 md:px-8 lg:px-12 pb-8 md:pb-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between gap-6 pb-6 border-b border-gray-100">
          {/* 카테고리 — 텍스트 필터 (선택 항목에 미끄러지는 하이라이트) */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onSelectCategory(category)}
                  className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                    active ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="store-filter-pill"
                      className="absolute inset-0 bg-koala-navy rounded-full"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10">{labelOf(category)}</span>
                </button>
              );
            })}
          </div>

          {/* 보기 방식 (그리드/크게) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              aria-label="그리드 보기"
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'
              }`}>
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onViewModeChange('large')}
              aria-label="크게 보기"
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
