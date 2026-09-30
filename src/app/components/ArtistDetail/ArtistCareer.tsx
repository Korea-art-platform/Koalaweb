import type { ArtistCareer as ArtistCareerItem } from '@/api/types';
import { useTranslation } from 'react-i18next';

interface ArtistCareerProps {
  items?: ArtistCareerItem[];
}

const CATEGORIES = ['학력', '개인전', '그룹전', '그 외'] as const;

const CATEGORY_KEY: Record<(typeof CATEGORIES)[number], string> = {
  '학력': 'education',
  '개인전': 'solo',
  '그룹전': 'group',
  '그 외': 'other',
};

export function ArtistCareer({ items = [] }: ArtistCareerProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  const grouped = CATEGORIES.reduce<Record<string, ArtistCareerItem[]>>((acc, cat) => {
    acc[cat] = items
      .filter(i => i.category === cat)
      .sort((a, b) => a.sortOrder - b.sortOrder);
    return acc;
  }, {});

  return (
    <section className="mb-16">
      <h3 className="text-lg font-semibold mb-6">{t('artistPage.career.title')}</h3>
      {CATEGORIES.map(cat => {
        const catItems = grouped[cat];
        if (!catItems || catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-8">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-3">
              {t(`artistPage.career.categories.${CATEGORY_KEY[cat]}`)}
            </h4>
            <div className="border-t border-gray-200">
              {catItems.map(item => (
                <div key={item.id} className="flex items-start gap-6 py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-400 w-16 flex-shrink-0">{item.year}</span>
                  <span className="text-sm text-gray-700">{item.content}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
