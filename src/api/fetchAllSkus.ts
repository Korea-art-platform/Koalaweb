import { getSkus } from './sku';
import type { Sku } from './types';

/** 한 번에 받아오는 크기. 서버 페이지네이션 상한과 응답 크기를 함께 고려한 값 */
const PAGE_SIZE = 100;

/**
 * 안전 상한.
 *
 * 서버가 totalPages 를 잘못 주거나 페이지네이션이 어긋나도 무한히 돌지 않게 막는다.
 * 1,000개(= 100 × 10)를 넘어가면 애초에 클라이언트에서 전부 다루면 안 되는 규모다.
 */
const MAX_PAGES = 10;

/**
 * 홈·검색처럼 <b>전체 목록이 필요한 화면</b>에서 상품을 모두 받아온다.
 *
 * <p>예전에는 `getSkus(0, 100)` 한 번으로 끝냈다. 상품이 100개를 넘는 순간
 * 앞 100개만 보이는데, <b>오류도 경고도 나지 않아</b> 누가 상세히 세어 보기 전까지
 * 빠졌다는 사실을 알 수 없었다.
 *
 * <p>스토어(`/store`)는 원래 서버 페이지네이션을 쓰므로 여기 해당하지 않는다.
 */
export async function fetchAllSkus(): Promise<Sku[]> {
  const first = await getSkus(0, PAGE_SIZE);
  const page = first.data.data;

  const items: Sku[] = page?.content ?? [];
  const totalPages: number = page?.totalPages ?? 1;

  if (totalPages <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: Math.min(totalPages, MAX_PAGES) - 1 }, (_, i) =>
      getSkus(i + 1, PAGE_SIZE).then((res) => res.data.data?.content ?? [])
    )
  );

  return items.concat(...rest);
}
