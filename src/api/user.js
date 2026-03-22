import instance from './instance';

// 내 정보 조회
export const getMyProfile = () =>
    instance.get('/api/v1/users/me');

// 내 정보 수정
export const updateMyProfile = (data) =>
    instance.patch('/api/v1/users/me', data);