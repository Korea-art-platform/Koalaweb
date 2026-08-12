import { useQuery } from '@tanstack/react-query';
import { getCategories, type Category, type CategoryGroups } from '@/api/category';

const EMPTY: CategoryGroups = { main: [], sub: [] };

/**
 * 상품 카테고리 목록.
 *
 * 상품 응답에는 카테고리 코드만 담겨 있어 화면에서 이름으로 바꿔야 한다.
 * 카테고리는 거의 바뀌지 않으므로 오래 캐시해두고 화면끼리 공유한다.
 */
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
    /** 소분류 코드 → 표시명. 없는 코드는 코드 그대로 (비활성화된 카테고리의 옛 상품) */
    subLabel: (code?: string) => labelOf(data.sub, code),
    mainLabel: (code?: string) => labelOf(data.main, code),
  };
}

function labelOf(list: Category[], code?: string) {
  if (!code) return '';
  return list.find((c) => c.code === code)?.name ?? code;
}
