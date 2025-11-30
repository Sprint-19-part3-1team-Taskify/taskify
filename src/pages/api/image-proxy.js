export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // URL 검증 (보안)
  if (!/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error('S3 fetch failed:', response.status, response.statusText, url);
      return res.status(response.status).json({ error: 'Failed to fetch from S3' });
    }

    const contentTypeFromS3 = response.headers.get('content-type') || '';

    // 🔥 S3가 XML/HTML 에러페이지를 반환하는 경우 걸러냄
    if (!contentTypeFromS3.startsWith('image/')) {
      console.error('Invalid content-type from S3:', contentTypeFromS3, 'URL:', url);
      return res
        .status(400)
        .json({ error: 'S3 response is not image data', contentType: contentTypeFromS3 });
    }

    // 이미지 바이너리 가져오기
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Content-Type 확정: S3가 보내준 타입 그대로 사용
    res.setHeader('Content-Type', contentTypeFromS3);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Accept-Ranges', 'none');

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Image proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
