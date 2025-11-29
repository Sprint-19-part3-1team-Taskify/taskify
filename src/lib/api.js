// /api/api.js
import axios from 'axios';

// 브라우저에서는 /api/external을 통해 자동으로 프록시됨
const api = axios.create({
  baseURL: '/api/external',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔥 모든 외부 API 요청마다 accessToken 자동 추가
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 내부 Next.js API 라우트용 (로그인 등)
export const authApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
