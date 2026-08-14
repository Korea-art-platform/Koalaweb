import instance from './instance';

export const getSkus = (page = 0, size = 20) =>
    instance.get('/api/v1/skus', { params: { page, size } });

export const getSkusByArtist = (artistCode: string, page = 0, size = 50) =>
    instance.get(`/api/v1/artists/${artistCode}/skus`, { params: { page, size } });

export const getSku = (skuCode: string) =>
    instance.get(`/api/v1/skus/${skuCode}`);

export const getGenreCounts = () =>
    instance.get('/api/v1/skus/genre-counts');

export const getSkuReviews = (skuCode: string, page = 0, size = 10) =>
    instance.get(`/api/v1/skus/${skuCode}/reviews`, { params: { page, size } });
