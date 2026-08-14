import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWishlist, addWishlist, removeWishlist } from '@/api/wishlist';
import { useAuth } from '@/app/context/AuthContext';
import type { WishlistItem } from '@/api/types';

export function useWishlistToggle() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [wishlistLoading, setWishlistLoading] = useState<Set<string>>(new Set());

  const { data: wishlistedCodes = new Set<string>() } = useQuery<Set<string>>({
    queryKey: ['wishlist-codes'],
    queryFn: async () => {
      const res = await getWishlist(0, 100);
      const items: WishlistItem[] = res.data?.data?.content ?? [];
      return new Set(items.map((item) => item.skuCode));
    },
    retry: false,

    enabled: isAuthenticated === true,
  });

  const wishlistMutation = useMutation({
    mutationFn: async ({ skuCode, isWishlisted }: { skuCode: string; isWishlisted: boolean }) => {
      if (isWishlisted) await removeWishlist(skuCode);
      else await addWishlist(skuCode);
      return { skuCode, isWishlisted };
    },
    onSuccess: ({ skuCode, isWishlisted }) => {
      queryClient.setQueryData<Set<string>>(['wishlist-codes'], (prev = new Set()) => {
        const next = new Set(prev);
        if (isWishlisted) next.delete(skuCode);
        else next.add(skuCode);
        return next;
      });
    },
    onError: (e) => console.error('위시리스트 처리 실패:', e),
    onSettled: (_data, _err, { skuCode }) => {
      setWishlistLoading((prev) => {
        const next = new Set(prev);
        next.delete(skuCode);
        return next;
      });
    },
  });

  const handleWishlist = (e: React.MouseEvent, skuCode: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistLoading.has(skuCode)) return;
    setWishlistLoading((prev) => new Set(prev).add(skuCode));
    wishlistMutation.mutate({ skuCode, isWishlisted: wishlistedCodes.has(skuCode) });
  };

  return { wishlistedCodes, wishlistLoading, handleWishlist };
}
