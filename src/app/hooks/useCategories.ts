import { useQuery } from '@tanstack/react-query';
import { getCategories, type Category, type CategoryGroups } from '@/api/category';

const EMPTY: CategoryGroups = { main: [], sub: [] };

export function useCategories() {
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

    subLabel: (code?: string) => labelOf(data.sub, code),
    mainLabel: (code?: string) => labelOf(data.main, code),
  };
}

function labelOf(list: Category[], code?: string) {
  if (!code) return '';
  return list.find((c) => c.code === code)?.name ?? code;
}
