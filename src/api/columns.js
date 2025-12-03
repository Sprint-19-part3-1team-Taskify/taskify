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
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id,
      title: data.title,
      dashboardId: data.dashboardId,
      teamId: data.teamId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to create column' };
  }
}

// GET /columns
export async function getColumns(dashboardId) {
  /* dashboardId: number; */
  if (!dashboardId) return { error: 'dashboardId is required' };

  try {
    const res = await api.get('/columns', { params: { dashboardId } });
    const data = res.data;

    // 필요한 필드만 추출
    const columns = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
    return {
      data: columns.map((col) => ({
        id: col.id,
        title: col.title,
        dashboardId: col.dashboardId,
        teamId: col.teamId,
      })),
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch columns' };
  }
}

// PUT /columns/:columnId
export async function putColumnsId(columnId, title) {
  /* columnId: number;
  title: string;
  */
  try {
    const res = await api.put(`/columns/${columnId}`, { title });
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id,
      title: data.title,
      dashboardId: data.dashboardId,
      teamId: data.teamId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to update column' };
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
    const data = res.data;

    // 필요한 필드만 추출
    return {
      imageUrl: data.imageUrl || data.url,
    };
  } catch (e) {
    return e.response?.data || { error: 'Image upload failed' };
  }
}
