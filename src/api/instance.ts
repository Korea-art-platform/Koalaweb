import axios, { type AxiosRequestConfig } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuthRefresh?: boolean;
  }
}

interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let sessionKnownAbsent = false;

export function markSessionActive() {
    sessionKnownAbsent = false;
}

const REFRESH_URL = '/api/v1/auth/refresh';

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as RetryableRequestConfig;

        const shouldTryRefresh =
            error.response?.status === 401
            && !originalRequest?._retry
            && !originalRequest?.skipAuthRefresh
            && !sessionKnownAbsent

            && !originalRequest?.url?.includes(REFRESH_URL);

        if (shouldTryRefresh) {
            originalRequest._retry = true;
            try {
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL as string}${REFRESH_URL}`,
                    null,
                    { withCredentials: true }
                );

                return instance(originalRequest);
            } catch (refreshError) {
                sessionKnownAbsent = true;

                window.dispatchEvent(new Event('auth:expired'));

                return Promise.reject(refreshError ?? error);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
