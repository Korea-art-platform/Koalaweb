import instance from './instance';
import type { SignupRequest, LoginRequest } from './types';

// 회원가입
export const signup = (data: SignupRequest) =>
    instance.post('/api/v1/auth/signup', data);

// 로그인
export const login = (data: LoginRequest) =>
    instance.post('/api/v1/auth/login', data);

// 로그아웃
export const logout = () =>
    instance.post('/api/v1/auth/logout');

// 토큰 재발급
export const refresh = (refreshToken: string) =>
    instance.post('/api/v1/auth/refresh', null, {
        headers: { 'X-Refresh-Token': refreshToken },
    });

// 비밀번호 재설정 — 인증코드 발송
export const sendPasswordResetCode = (email: string) =>
    instance.post('/api/v1/auth/password-reset/send', { email });

// 비밀번호 재설정 — 인증코드 확인
export const verifyPasswordResetCode = (email: string, token: string) =>
    instance.post('/api/v1/auth/password-reset/verify', { email, token });

// 비밀번호 재설정 — 새 비밀번호 설정
export const resetPassword = (email: string, token: string, newPassword: string) =>
    instance.post('/api/v1/auth/password-reset/reset', { email, token, newPassword });

// 카카오 소셜 로그인
export const loginWithKakao = (): void => {
    window.location.href = import.meta.env.VITE_OAUTH_KAKAO_URL as string;
};

// 네이버 소셜 로그인
export const loginWithNaver = (): void => {
    window.location.href = import.meta.env.VITE_OAUTH_NAVER_URL as string;
};

// 토스 로그인 (앱인토스 환경 전용)
export const loginWithToss = async (): Promise<void> => {
    const { appLogin } = await import('@apps-in-toss/web-framework');
    const { authorizationCode, referrer } = await appLogin();
    // 백엔드에서 JWT 쿠키를 Set-Cookie로 설정
    await instance.post('/api/v1/auth/toss/login', { authorizationCode, referrer });
};
