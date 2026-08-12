import instance from './instance';

/**
 * 상품 카테고리.
 *
 * 대분류(MAIN)와 소분류(SUB)는 계층이 아니라 독립 2축이다.
 * 대분류 = 판매 형태(한정판/일반), 소분류 = 장르(조각/아트토이/…).
 */
export interface Category {
  id: number;
  type: 'MAIN' | 'SUB';
  /** 상품에 저장되는 값 */
  code: string;
  /** 화면 표시명 */
  name: string;
  sortOrder: number;
  isActive: boolean;
  /** 이 카테고리를 쓰는 상품 수 — 어드민 목록에서만 채워진다 */
  usedCount?: number;
}

export interface CategoryGroups {
  main: Category[];
  sub: Category[];
}

/**
 * 활성 카테고리 목록.
 *
 * 상품 응답에는 카테고리 '이름'이 없고 code 만 있다.
 * 화면에서 이 목록을 한 번 받아 code → name 으로 바꿔 쓴다.
 */
export async function getCategories(): Promise<CategoryGroups> {
  const res = await instance.get<{ data: CategoryGroups }>('/api/v1/categories');
  return res.data.data;
}
