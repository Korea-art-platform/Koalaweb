import axios from 'axios';

const adminInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },

  withCredentials: true,
});

adminInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminInstance;
