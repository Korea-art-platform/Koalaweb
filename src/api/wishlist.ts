import instance from './instance';

export const getWishlist = (page = 0, size = 20) =>
    instance.get('/api/v1/wishlist', { params: { page, size } });

export const addWishlist = (skuCode: string) =>
    instance.post(`/api/v1/wishlist/${skuCode}`);

export const removeWishlist = (skuCode: string) =>
    instance.delete(`/api/v1/wishlist/${skuCode}`);

export const checkWishlist = (skuCode: string) =>
    instance.get(`/api/v1/wishlist/${skuCode}/check`);
