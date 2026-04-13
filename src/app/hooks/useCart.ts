import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getCart, updateCartItem, removeCartItem, clearCart } from '@/api/cart';
import type { Cart } from '@/api/types';

export const CART_QUERY_KEY = ['cart'] as const;

async function fetchCart(): Promise<Cart | null> {
  const res = await getCart();
  return res.data.data ?? null;
}

export function useCart() {
  const { t } = useTranslation('cart');
  const queryClient = useQueryClient();

  const { data: cart, isLoading: loading } = useQuery<Cart | null>({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    retry: false,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data.data);
    },
    onError: (e) => console.error('수량 변경 실패:', e),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: (res) => {
      queryClient.setQueryData(CART_QUERY_KEY, res.data.data);
    },
    onError: (e) => console.error('삭제 실패:', e),
  });

  const clearMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.setQueryData(CART_QUERY_KEY, null);
    },
    onError: (e) => console.error('장바구니 비우기 실패:', e),
  });

  const handleUpdateQuantity = (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    updateMutation.mutate({ itemId, quantity: newQty });
  };

  const handleRemoveItem = (itemId: number) => {
    if (!window.confirm(t('alerts.removeConfirm'))) return;
    removeMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    if (!window.confirm(t('alerts.clearConfirm'))) return;
    clearMutation.mutate();
  };

  const cartItems = cart?.items ?? [];
  const subtotal = cart?.subtotalAmount ?? 0;
  const shipping = cartItems.length > 0 ? (subtotal >= 50000 ? 0 : 3000) : 0;
  const total = subtotal + shipping;

  return {
    loading,
    cartItems,
    subtotal,
    shipping,
    total,
    handleUpdateQuantity,
    handleRemoveItem,
    handleClearCart,
  };
}
