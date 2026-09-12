import { useCategories } from '@/app/hooks/useCategories';

// 분류마다 사진 칸에 까는 옅은 색 — 분류 순서대로 돌려 쓴다
const TINTS = ['#F3E7EA', '#E4EFEC', '#ECE8F4', '#F4EDE1', '#E6ECF4', '#F1EAF1'];

export function useCategoryTint() {
  const { sub } = useCategories();

  return (code?: string) => {
    const i = sub.findIndex((c) => c.code === code);
    return TINTS[(i < 0 ? 0 : i) % TINTS.length];
  };
}
