import instance from './instance';

// SKU 목록
export const getSkus = (page = 0, size = 20) =>
    instance.get('/api/v1/skus', { params: { page, size } });

// SKU 상세
export const getSku = (skuCode) =>
    instance.get(`/api/v1/skus/${skuCode}`);

// SKU 리뷰 목록
export const getSkuReviews = (skuCode, page = 0, size = 10) =>
    instance.get(`/api/v1/skus/${skuCode}/reviews`, { params: { page, size } });