import api from '@/lib/api';

// POST /auth/login
export async function postAuthLogin({ email, password }) {
  /* email: string;
  password: string;
  */
  try {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    return res.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message;
    throw new Error(errorMessage);
  }
}

// PUT /auth/password
export async function putAuthPassword({ password, newPassword }) {
  /* password: string;
  newPassword: string;
  */
  try {
    const res = await api.put('/auth/password', { password, newPassword });
    return res.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message;
    throw new Error(errorMessage);
  }
}
