import { getSkus } from './sku';
import type { Sku } from './types';

const PAGE_SIZE = 100;

const MAX_PAGES = 10;

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
