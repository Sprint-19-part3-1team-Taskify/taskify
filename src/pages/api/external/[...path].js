import axios from 'axios';
import formidable from 'formidable';
import FormData from 'form-data';

const BASE_URL = 'https://sp-taskify-api.vercel.app/19-1';

// Next.js API Route에서 bodyParser 비활성화를 위한 설정
export const config = {
  api: {
    bodyParser: false,
  },
};

// multipart/form-data 파싱 함수
async function parseMultipartForm(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      // FormData 객체 생성
      const formData = new FormData();

      // fields 추가
      Object.keys(fields).forEach((key) => {
        const value = fields[key];
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });

      // files 추가
      Object.keys(files).forEach((key) => {
        const file = files[key];
        if (Array.isArray(file)) {
          file.forEach((f) => {
            formData.append(key, require('fs').createReadStream(f.filepath), {
              filename: f.originalFilename || f.newFilename,
              contentType: f.mimetype || 'application/octet-stream',
            });
          });
        } else {
          formData.append(key, require('fs').createReadStream(file.filepath), {
            filename: file.originalFilename || file.newFilename,
            contentType: file.mimetype || 'application/octet-stream',
          });
        }
      });

      resolve(formData);
    });
  });
}

export default async function handler(req, res) {
  const { path, ...queryParams } = req.query;
  const { method } = req;

  // URL 경로 구성
  const apiPath = Array.isArray(path) ? path.join('/') : path || '';
  const url = `${BASE_URL}/${apiPath}`;

  // 쿠키에서 accessToken 추출
  const cookies = req.cookies || {};
  const token = cookies.accessToken;

  // Content-Type 확인
  const contentType = req.headers['content-type'] || '';
  const isMultipart = contentType.includes('multipart/form-data');

  // 요청 헤더 구성
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // multipart/form-data가 아닌 경우에만 Content-Type 설정
  // multipart/form-data는 FormData가 boundary를 자동으로 설정함
  if (!isMultipart) {
    headers['Content-Type'] = contentType || 'application/json';
  }

  try {
    let requestData = null;

    // bodyParser가 false이므로 모든 body를 수동으로 파싱
    if (method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE') {
      if (isMultipart) {
        // multipart/form-data인 경우 formidable로 파싱
        requestData = await parseMultipartForm(req);
        // FormData의 headers를 axios config에 포함
        Object.assign(headers, requestData.getHeaders());
      } else {
        // JSON 또는 다른 형식의 데이터 파싱
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString();
        });
        await new Promise((resolve) => {
          req.on('end', () => {
            if (body) {
              if (contentType.includes('application/json')) {
                try {
                  requestData = JSON.parse(body);
                } catch (e) {
                  requestData = body;
                }
              } else {
                requestData = body;
              }
            } else {
              requestData = {};
            }
            resolve();
          });
        });
      }
    }

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
        response = await axios.post(url, requestData, config);
        break;
      case 'PUT':
        response = await axios.put(url, requestData, config);
        break;
      case 'PATCH':
        response = await axios.patch(url, requestData, config);
        break;
      case 'DELETE':
        response = await axios.delete(url, { ...config, data: requestData });
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
