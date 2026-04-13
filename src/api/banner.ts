import instance from './instance';
import type { BannerType } from './types';

// 배너 목록 조회
export const getBanners = (bannerType: BannerType = 'MAIN') =>
    instance.get('/api/v1/banners', { params: { bannerType } });
