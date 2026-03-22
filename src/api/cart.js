import instance from './instance';

// 장바구니 조회
export const getCart = () =>
    instance.get('/api/v1/cart');

// 장바구니 추가
export const addCartItem = (skuCode, quantity) =>
    instance.post('/api/v1/cart/items', { skuCode, quantity });

// 장바구니 수량 변경
export const updateCartItem = (itemId, quantity) =>
    instance.patch(`/api/v1/cart/items/${itemId}`, { quantity });

// 장바구니 삭제
export const removeCartItem = (itemId) =>
    instance.delete(`/api/v1/cart/items/${itemId}`);

// 장바구니 전체 비우기
export const clearCart = () =>
    instance.delete('/api/v1/cart');