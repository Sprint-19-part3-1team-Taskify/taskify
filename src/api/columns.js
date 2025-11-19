import api from '@/lib/api';

// POST /columns
export async function postColumns(columnsData) {
  try {
    const res = await api.post('/columns', columnsData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /columns
export async function getColumns(dashboardId) {
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
  try {
    const res = await api.put(`/columns/${columnId}`, { title });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /columns/:columnId
export async function deleteColumnsId(columnId) {
  try {
    const res = await api.delete(`/columns/${columnId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// POST /columns/:columnId/card-image
export async function postColumnsIdCardImage(columnId, image) {
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
