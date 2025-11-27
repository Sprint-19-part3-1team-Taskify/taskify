import axios from 'axios';

// 브라우저에서는 /api/external을 통해 자동으로 프록시됨
const api = axios.create({
  baseURL: '/api/external',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 내부 Next.js API 라우트용 (로그인 등)
export const authApi = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
