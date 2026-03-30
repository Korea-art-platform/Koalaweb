import instance from './instance';

// 회원가입
export const signup = (data) =>
    instance.post('/api/v1/auth/signup', data);

// 로그인
export const login = (data) =>
    instance.post('/api/v1/auth/login', data);

// 로그아웃
export const logout = () =>
    instance.post('/api/v1/auth/logout');

// 토큰 재발급
export const refresh = (refreshToken) =>
    instance.post('/api/v1/auth/refresh', null, {
        headers: { 'X-Refresh-Token': refreshToken },
    });

// 비밀번호 재설정 — 인증코드 발송
export const sendPasswordResetCode = (email) =>
    instance.post('/api/v1/auth/password-reset/send', { email });

// 비밀번호 재설정 — 인증코드 확인
export const verifyPasswordResetCode = (email, token) =>
    instance.post('/api/v1/auth/password-reset/verify', { email, token });

// 비밀번호 재설정 — 새 비밀번호 설정
export const resetPassword = (email, token, newPassword) =>
    instance.post('/api/v1/auth/password-reset/reset', { email, token, newPassword });

// 카카오 소셜 로그인
export const loginWithKakao = () => {
    window.location.href = import.meta.env.VITE_OAUTH_KAKAO_URL;
};

// 네이버 소셜 로그인
export const loginWithNaver = () => {
    window.location.href = import.meta.env.VITE_OAUTH_NAVER_URL;
};
