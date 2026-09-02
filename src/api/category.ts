import instance from './instance';

export interface Category {
  id: number;
  type: 'MAIN' | 'SUB';

  code: string;

  name: string;
  sortOrder: number;
  isActive: boolean;

  /** 면세 분류 — 참이면 부가세를 붙이지 않는다(원작) */
  taxExempt?: boolean;

  usedCount?: number;
}

export interface CategoryGroups {
  main: Category[];
  sub: Category[];
}

export async function getCategories(): Promise<CategoryGroups> {
  const res = await instance.get<{ data: CategoryGroups }>('/api/v1/categories');
  return res.data.data;
}
