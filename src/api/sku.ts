import instance from './instance';

export type SkuOrder = 'RECOMMENDED' | 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC';

export interface SkuFilter {
    /** 소분류 코드 (조각·아트토이…) */
    genre?: string;
    /** 대분류 코드 (원작·한정판…) */
    mainCategory?: string;
    /** 작가 코드 */
    artist?: string;
    /** 화면 금액(부가세 포함) 기준 */
    minPrice?: number;
    maxPrice?: number;
    order?: SkuOrder;
}

export const getSkus = (page = 0, size = 20, filter: SkuFilter = {}) =>
    instance.get('/api/v1/skus', {
        params: {
            page, size,
            genre: filter.genre, mainCategory: filter.mainCategory, artist: filter.artist,
            minPrice: filter.minPrice, maxPrice: filter.maxPrice, order: filter.order,
        },
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
