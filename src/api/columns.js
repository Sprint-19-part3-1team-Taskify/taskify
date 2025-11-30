import api from '@/lib/api';

// POST /columns
export async function postColumns(columnsData) {
  /* columnsData: {
    title: string;
    dashboardId: number;
  }
  */
  try {
    const res = await api.post('/columns', columnsData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /columns
export async function getColumns(dashboardId) {
  /* dashboardId: number; */
  if (!dashboardId) return { error: 'dashboardId is required' };

  try {
    const res = await api.get('/columns', { params: { dashboardId } });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// PUT /columns/:columnId
export async function putColumnsId(columnId, title) {
  /* columnId: number;
  title: string;
  */
  try {
    const res = await api.put(`/columns/${columnId}`, { title });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /columns/:columnId
export async function deleteColumnsId(columnId) {
  /* columnId: number; */
  try {
    const res = await api.delete(`/columns/${columnId}`, { data: {} });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// POST /columns/:columnId/card-image
export async function postColumnsIdCardImage(columnId, image) {
  /* columnId: number;
  image: File;
  */
  try {
    const formData = new FormData();
    formData.append('image', image);
    const res = await api.post(`/columns/${columnId}/card-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
