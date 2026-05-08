import { useQuery } from '@tanstack/react-query';
import { getSkusByArtist } from '@/api/sku';
import type { Sku, PageResponse } from '@/api/types';

export function useArtistSkus(artistCode: string | undefined) {
  const { data: skus = [], isLoading } = useQuery<Sku[]>({
    queryKey: ['skus', 'artist', artistCode],
    queryFn: async () => {
      const res = await getSkusByArtist(artistCode!);
      const page: PageResponse<Sku> = res.data.data;
      return page.content ?? [];
    },
    enabled: !!artistCode,
    retry: false,
  });

  return { skus, isLoading };
}
