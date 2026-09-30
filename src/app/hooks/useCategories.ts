import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { getCategories, type Category, type CategoryGroups } from '@/api/category';

const EMPTY: CategoryGroups = { main: [], sub: [] };

const MARK_KEYS: Record<string, string> = {
  '원작': 'common.marks.original',
  '한정판': 'common.marks.limited',
  '오픈에디션': 'common.marks.openEdition',
};

export function useCategories() {
  const { t, i18n } = useTranslation();
  const english = Boolean(i18n.language?.startsWith('en'));
  const { data = EMPTY, isLoading } = useQuery<CategoryGroups>({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 30,
    retry: false,
  });

  return {
    main: data.main,
    sub: data.sub,
    isLoading,

    subLabel: (code?: string) => labelOf(data.sub, code, english, t),
    mainLabel: (code?: string) => labelOf(data.main, code, english, t),
  };
}

function titleCase(v: string) {
  if (v !== v.toUpperCase()) return v;
  return v.toLowerCase().replace(/(^|[\s/-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase());
}

export function categoryName(c: Category, english: boolean, t: TFunction) {
  if (!english) return c.name;
  if (c.nameEn?.trim()) return titleCase(c.nameEn.trim());
  const key = MARK_KEYS[c.name.trim()];
  return key ? t(key) : c.name;
}

function labelOf(list: Category[], code: string | undefined, english: boolean, t: TFunction) {
  if (!code) return '';
  const found = list.find((c) => c.code === code);
  return found ? categoryName(found, english, t) : code;
}
