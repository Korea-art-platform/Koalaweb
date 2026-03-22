import instance from './instance';

// 아티스트 목록
export const getArtists = (page = 0, size = 20) =>
    instance.get('/api/v1/artists', { params: { page, size } });

// 아티스트 상세
export const getArtist = (artistCode) =>
    instance.get(`/api/v1/artists/${artistCode}`);