import instance from './instance';
import type { BannerType } from './types';

export const getBanners = (bannerType: BannerType = 'MAIN') =>
    instance.get('/api/v1/banners', { params: { bannerType } });
