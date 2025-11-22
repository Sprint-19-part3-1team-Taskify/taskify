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
    return e.response.data;
  }
}

// GET /users/me
export async function getUsersMe() {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (e) {
    return e.response.data;
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
    return e.response.data;
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
    return e.response.data;
  }
}
