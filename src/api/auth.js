import api from '@/lib/api';

// POST /auth/login
export async function postAuthLogin({ email, password }) {
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// PUT /auth/password
export async function putAuthPassword({ password, newPassword }) {
  try {
    const res = await api.put('/auth/password', { password, newPassword });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
