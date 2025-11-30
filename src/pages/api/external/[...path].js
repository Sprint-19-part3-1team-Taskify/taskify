import axios from 'axios';

const BASE_URL = 'https://sp-taskify-api.vercel.app/19-1';

export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  const { method, body } = req;

  // URL 경로 구성
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';
  const url = `${BASE_URL}/${apiPath}`;

  // 쿠키에서 accessToken 추출
  const cookies = req.cookies || {};
  const token = cookies.accessToken;

  // 요청 헤더 구성
  const headers = {
    'Content-Type': req.headers['content-type'] || 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    let response;

    const config = {
      headers,
      params: queryParams,
    };

    switch (method) {
      case 'GET':
        response = await axios.get(url, config);
        break;
      case 'POST':
        response = await axios.post(url, body, config);
        break;
      case 'PUT':
        response = await axios.put(url, body, config);
        break;
      case 'PATCH':
        response = await axios.patch(url, body, config);
        break;
      case 'DELETE':
        response = await axios.delete(url, { ...config, data: body });
        break;
      default:
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    return res.status(response.status).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data || { message: 'Proxy request failed' };
    return res.status(status).json(data);
  }
}
