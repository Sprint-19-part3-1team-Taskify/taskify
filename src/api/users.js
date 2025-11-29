import api from '@/lib/api';

// POST /users
export async function postUsers(userData) {
  /* userData: {
    email: string;
    nickname: string;
    password: string;
  }
  */
  try {
    const res = await api.post('/users', userData);
    return res.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message;
    throw new Error(errorMessage);
  }
}

// GET /users/me
export async function getUsersMe() {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (e) {
    // ⭐ 401 Unauthorized 에러는 null 반환 (로그인 안 한 상태)
    if (e.response?.status === 401) {
      return null;
    }
    const errorMessage = e.response?.data?.message || '사용자 정보를 불러올 수 없습니다.';
    throw new Error(errorMessage);
  }
}

// PUT /users/me
export async function putUsersMe(userData) {
  /* userData: {
    nickname: string;
    profileImageUrl: File;
  }
  */
  try {
    const res = await api.put('/users/me', userData);
    return res.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message;
    throw new Error(errorMessage);
  }
}

// POST /users/me/image
export async function postUsersMeImage(image) {
  /* image: File; */
  const formData = new FormData();
  formData.append('image', image);
  try {
    const res = await api.post('/users/me/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    const errorMessage = e.response?.data?.message;
    throw new Error(errorMessage);
  }
}
