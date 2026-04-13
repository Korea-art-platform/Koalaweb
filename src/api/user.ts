import instance from './instance';
import type { UpdateProfileRequest, AddressRequest } from './types';

// 내 정보 조회
export const getMyProfile = () =>
    instance.get('/api/v1/users/me');

// 내 정보 수정
export const updateMyProfile = (data: UpdateProfileRequest) =>
    instance.patch('/api/v1/users/me', data);

// 내 주소 목록 조회
export const getMyAddresses = () =>
    instance.get('/api/v1/users/me/addresses');

// 주소 추가
export const createAddress = (data: AddressRequest) =>
    instance.post('/api/v1/users/me/addresses', data);

// 주소 수정
export const updateAddress = (addressId: number, data: AddressRequest) =>
    instance.put(`/api/v1/users/me/addresses/${addressId}`, data);

// 기본 배송지 설정
export const setDefaultAddress = (addressId: number) =>
    instance.patch(`/api/v1/users/me/addresses/${addressId}/default`);

// 주소 삭제
export const deleteAddress = (addressId: number) =>
    instance.delete(`/api/v1/users/me/addresses/${addressId}`);
