import instance from './instance';

interface SkuFilter {
    /** 소분류 코드 (조각·아트토이…) */
    genre?: string;
    /** 대분류 코드 (원작·한정판…) */
    mainCategory?: string;
}

export const getSkus = (page = 0, size = 20, filter: SkuFilter = {}) =>
    instance.get('/api/v1/skus', {
        params: { page, size, genre: filter.genre, mainCategory: filter.mainCategory },
    });

export const getSkusByArtist = (artistCode: string, page = 0, size = 50) =>
    instance.get(`/api/v1/artists/${artistCode}/skus`, { params: { page, size } });

export const getSku = (skuCode: string) =>
    instance.get(`/api/v1/skus/${skuCode}`);

export const getGenreCounts = () =>
    instance.get('/api/v1/skus/genre-counts');

export const getMainCategoryCounts = () =>
    instance.get('/api/v1/skus/main-category-counts');

export const getSkuReviews = (skuCode: string, page = 0, size = 10) =>
    instance.get(`/api/v1/skus/${skuCode}/reviews`, { params: { page, size } });
