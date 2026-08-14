import instance from './instance';

export const getCart = () =>
    instance.get('/api/v1/cart');

export const addCartItem = (skuCode: string, quantity: number) =>
    instance.post('/api/v1/cart/items', { skuCode, quantity });

export const updateCartItem = (itemId: number, quantity: number) =>
    instance.patch(`/api/v1/cart/items/${itemId}`, { quantity });

export const removeCartItem = (itemId: number) =>
    instance.delete(`/api/v1/cart/items/${itemId}`);

export const clearCart = () =>
    instance.delete('/api/v1/cart');
