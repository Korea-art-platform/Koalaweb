import axios, { type AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    /** 로그인 여부를 확인하는 요청 — 401 이 정상 응답이므로 재발급을 시도하지 않는다 */
    skipAuthRefresh?: boolean;
  }
}

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

/**
 * 로그인한 적이 없다고 확인된 상태.
 *
 * <p>비로그인 방문자에게도 401 은 계속 나온다. 그때마다 재발급을 시도하면
 * 실패가 확정된 요청이 화면 포커스마다 두 배로 늘어난다(조회 1건 + 재발급 1건).
 * 한 번 재발급이 실패하면 로그인에 성공할 때까지 다시 시도하지 않는다.
 */
let sessionKnownAbsent = false;

/** 로그인·회원가입 성공 시 호출 — 다시 재발급을 시도할 수 있게 되돌린다 */
export function markSessionActive() {
    sessionKnownAbsent = false;
}

const REFRESH_URL = '/api/v1/auth/refresh';

// 응답 인터셉터 — 401 시 토큰 자동 재발급
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableRequestConfig;

        const shouldTryRefresh =
            error.response?.status === 401
            && !originalRequest?._retry
            && !originalRequest?.skipAuthRefresh
            && !sessionKnownAbsent
            // 재발급 요청 자신이 401 이면 다시 재발급할 수 없다
            && !originalRequest?.url?.includes(REFRESH_URL);

        if (shouldTryRefresh) {
            originalRequest._retry = true;
            try {
                // refreshToken 쿠키를 withCredentials 로 자동 전송
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL as string}${REFRESH_URL}`,
                    null,
                    { withCredentials: true }
                );
                // 재발급 성공 → 원래 요청 재시도 (쿠키가 갱신된 상태)
                return instance(originalRequest);
            } catch (refreshError) {
                sessionKnownAbsent = true;
                // 리프레시도 만료 → 인증 만료 이벤트 발행 (AuthContext가 수신해서 리다이렉트)
                // window.location.href = '/login' 을 쓰면 전체 리로드 → getMyProfile 재호출 → 무한루프
                window.dispatchEvent(new Event('auth:expired'));
                // 원래 요청의 401 에러 대신 refresh 에러를 전달하면 호출부가 더 정확한 메시지 표시 가능
                return Promise.reject(refreshError ?? error);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
