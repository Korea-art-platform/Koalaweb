import { useCategories } from './useCategories';

/**
 * 원작 대분류의 코드를 찾는다.
 *
 * 어드민에서 만든 대분류의 코드는 이름을 아스키로 옮길 수 없으면 MAIN_1, MAIN_2 처럼
 * 순번으로 붙는다. 그래서 코드를 화면에 박아 두면 카테고리를 지웠다 다시 만드는 순간
 * 원작 섹션이 통째로 빈다. 이름으로 찾아 그때그때 코드를 얻는다.
 */
const ORIGINAL_NAME = '원작';
const ORIGINAL_FALLBACK = 'ORIGINAL';

export function useOriginalCategoryCode(): string | null {
  const { main } = useCategories();
  const found = main.find((c) => c.name.trim() === ORIGINAL_NAME);
  if (found) return found.code;
  return main.some((c) => c.code === ORIGINAL_FALLBACK) ? ORIGINAL_FALLBACK : null;
}
