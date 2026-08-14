import instance from './instance';

export const getArtists = (page = 0, size = 20) =>
    instance.get('/api/v1/artists', { params: { page, size } });

export const getArtist = (artistCode: string) =>
    instance.get(`/api/v1/artists/${artistCode}`);

export const followArtist = (artistCode: string) =>
    instance.post(`/api/v1/artists/${artistCode}/follow`);

export const unfollowArtist = (artistCode: string) =>
    instance.delete(`/api/v1/artists/${artistCode}/follow`);

export const getArtistFollowStatus = (artistCode: string) =>
    instance.get<{data: boolean}>(`/api/v1/artists/${artistCode}/following`);
