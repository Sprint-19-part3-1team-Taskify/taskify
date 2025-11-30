export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // HttpOnly 쿠키 삭제 (Max-Age=0으로 즉시 만료)
  res.setHeader('Set-Cookie', ['accessToken=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0']);

  return res.status(200).json({ message: '로그아웃되었습니다.' });
}
