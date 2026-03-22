import instance from './instance';

export const getBanners = (bannerType = 'MAIN') =>
    instance.get('/api/v1/banners', { params: { bannerType } });