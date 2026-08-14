import instance from './instance';
import type { UpdateProfileRequest, AddressRequest } from './types';

export const getMyProfile = () =>
    instance.get('/api/v1/users/me', { skipAuthRefresh: true });

export const updateMyProfile = (data: UpdateProfileRequest) =>
    instance.patch('/api/v1/users/me', data);

export const getMyAddresses = () =>
    instance.get('/api/v1/users/me/addresses');

export const createAddress = (data: AddressRequest) =>
    instance.post('/api/v1/users/me/addresses', data);

export const updateAddress = (addressId: number, data: AddressRequest) =>
    instance.put(`/api/v1/users/me/addresses/${addressId}`, data);

export const setDefaultAddress = (addressId: number) =>
    instance.patch(`/api/v1/users/me/addresses/${addressId}/default`);

export const deleteAddress = (addressId: number) =>
    instance.delete(`/api/v1/users/me/addresses/${addressId}`);
