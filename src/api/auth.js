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
//refresh token
export const refresh = (refreshToken) =>
    instance.post('/api/v1/auth/refresh', { refreshToken });


// 카카오 소셜 로그인
export const loginWithKakao = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
};

// 네이버 소셜 로그인
export const loginWithNaver = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
};