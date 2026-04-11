import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 — JWT 토큰 자동 첨부
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 응답 인터셉터 — 토큰 만료 처리
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 에러 && 재시도 안 한 경우 → 토큰 재발급
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // localStorage 토큰(일반 로그인)과 HttpOnly 쿠키(소셜 로그인) 모두 지원
                const refreshToken = localStorage.getItem('refreshToken');
                const res = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`,
                    null,
                    {
                        withCredentials: true,
                        ...(refreshToken && { headers: { 'X-Refresh-Token': refreshToken } }),
                    }
                );
                const newAccessToken = res.data.data.accessToken;
                if (newAccessToken) {
                    localStorage.setItem('accessToken', newAccessToken);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return instance(originalRequest);
            } catch (e) {
                // 리프레시 토큰도 만료 → 로그아웃
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
