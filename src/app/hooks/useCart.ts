import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getCart, updateCartItem, removeCartItem, clearCart } from '@/api/cart';
import { useTranslation } from 'react-i18next';

export function useCart() {
  const navigate = useNavigate();
  const { t } = useTranslation('cart'); // 🌟 i18n 적용
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      setCart(res.data.data);
    } catch (e) {
      console.error('장바구니 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      const res = await updateCartItem(itemId, newQty);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('수량 변경 실패:', e);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!window.confirm(t('alerts.removeConfirm'))) return; // 🌟 i18n 적용
    try {
      const res = await removeCartItem(itemId);
      setCart(res.data.data);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('삭제 실패:', e);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm(t('alerts.clearConfirm'))) return; // 🌟 i18n 적용
    try {
      await clearCart();
      setCart(null);
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('장바구니 비우기 실패:', e);
    }
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
    handleClearCart
  };
}