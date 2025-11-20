import axios from 'axios';

const BASE_URL = 'https://sp-taskify-api.vercel.app/19-1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
