import instance from './instance';

// 위시리스트 조회
export const getWishlist = (page = 0, size = 20) =>
    instance.get('/api/v1/wishlist', { params: { page, size } });

// 위시리스트 추가
export const addWishlist = (skuCode) =>
    instance.post(`/api/v1/wishlist/${skuCode}`);

// 위시리스트 삭제
export const removeWishlist = (skuCode) =>
    instance.delete(`/api/v1/wishlist/${skuCode}`);

// 위시리스트 여부 확인
export const checkWishlist = (skuCode) =>
    instance.get(`/api/v1/wishlist/${skuCode}/check`);