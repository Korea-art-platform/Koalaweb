import axios, { type AxiosRequestConfig } from 'axios';

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

/**
 * 인증 전략: HttpOnly 쿠키
 * - 백엔드가 로그인/회원가입 시 accessToken, refreshToken 을 HttpOnly 쿠키로 설정
 * - withCredentials: true 로 모든 요청에 쿠키 자동 포함
 * - localStorage 에 토큰 저장하지 않음 (XSS 취약점 방지)
 */
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 응답 인터셉터 — 401 시 토큰 자동 재발급
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // refreshToken 쿠키를 withCredentials 로 자동 전송
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL as string}/api/v1/auth/refresh`,
                    null,
                    { withCredentials: true }
                );
                // 재발급 성공 → 원래 요청 재시도 (쿠키가 갱신된 상태)
                return instance(originalRequest);
            } catch {
                // 리프레시도 만료 → 인증 만료 이벤트 발행 (AuthContext가 수신해서 리다이렉트)
                // window.location.href = '/login' 을 쓰면 전체 리로드 → getMyProfile 재호출 → 무한루프
                window.dispatchEvent(new Event('auth:expired'));
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
