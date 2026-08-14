import instance from './instance';
import type { SignupRequest, LoginRequest } from './types';

export const signup = (data: SignupRequest) =>
    instance.post('/api/v1/auth/signup', data);

export const login = (data: LoginRequest) =>
    instance.post('/api/v1/auth/login', data);

export const logout = () =>
    instance.post('/api/v1/auth/logout');

export const withdraw = () =>
    instance.delete('/api/v1/users/me');

export const refresh = (refreshToken: string) =>
    instance.post('/api/v1/auth/refresh', null, {
        headers: { 'X-Refresh-Token': refreshToken },
    });

export const sendPasswordResetCode = (email: string) =>
    instance.post('/api/v1/auth/password-reset/send', { email });

export const verifyPasswordResetCode = (email: string, token: string) =>
    instance.post('/api/v1/auth/password-reset/verify', { email, token });

export const resetPassword = (email: string, token: string, newPassword: string) =>
    instance.post('/api/v1/auth/password-reset/reset', { email, token, newPassword });

export const loginWithKakao = (): void => {
    window.location.href = import.meta.env.VITE_OAUTH_KAKAO_URL as string;
};

export const loginWithNaver = (): void => {
    window.location.href = import.meta.env.VITE_OAUTH_NAVER_URL as string;
};
