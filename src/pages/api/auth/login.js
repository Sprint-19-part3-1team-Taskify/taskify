import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    const response = await axios.post('https://sp-taskify-api.vercel.app/19-1/auth/login', {
      email,
      password,
    });

    const { accessToken } = response.data;

    res.setHeader('Set-Cookie', [
      `accessToken=${accessToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=360000`,
    ]);

    return res.status(200).json(response.data);
  } catch (e) {
    const status = e.response?.status || 500;
    const message = e.response?.data?.message || '로그인에 실패했습니다.';
    return res.status(status).json({ message });
  }
}
