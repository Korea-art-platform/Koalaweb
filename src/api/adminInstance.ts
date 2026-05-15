import axios from 'axios';

const adminInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 60000, // 파일 업로드를 위해 60초로 설정
  headers: { 'Content-Type': 'application/json' },
  // HttpOnly 쿠키(admin_token)를 자동으로 첨부
  withCredentials: true,
});

adminInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminInstance;
