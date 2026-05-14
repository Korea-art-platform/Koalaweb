import instance from './instance';

// SKU 목록
export const getSkus = (page = 0, size = 20) =>
    instance.get('/api/v1/skus', { params: { page, size } });

// 작가별 SKU 목록
export const getSkusByArtist = (artistCode: string, page = 0, size = 50) =>
    instance.get(`/api/v1/artists/${artistCode}/skus`, { params: { page, size } });

// SKU 상세
export const getSku = (skuCode: string) =>
    instance.get(`/api/v1/skus/${skuCode}`);

// 장르별 상품 수
export const getGenreCounts = () =>
    instance.get('/api/v1/skus/genre-counts');

// SKU 리뷰 목록
export const getSkuReviews = (skuCode: string, page = 0, size = 10) =>
    instance.get(`/api/v1/skus/${skuCode}/reviews`, { params: { page, size } });
