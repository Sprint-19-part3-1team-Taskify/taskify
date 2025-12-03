import api from '@/lib/api';

// POST /dashboards
export async function postDashboards(dashboardData) {
  /* dashboardData: {
    title: string;
    color: string;
  }
  */
  try {
    const res = await api.post('/dashboards', dashboardData);
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id || data.dashboardId,
      title: data.title,
      color: data.color,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdByMe: data.createdByMe,
      userId: data.userId || data.createdBy?.id || data.ownerId || data.createdById,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to create dashboard' };
  }
}

// GET /dashboards
export async function getDashboards({ navigationMethod, cursorId, page = 1, size = 10 }) {
  /* navigationMethod: 'infiniteScroll', 'pagination'
  cursorId: number;
  page: number;
  size: number;
  */
  try {
    const res = await api.get('/dashboards', {
      params: { navigationMethod, cursorId, page, size },
    });
    const data = res.data;

    // 필요한 필드만 추출
    const dashboards = Array.isArray(data?.dashboards)
      ? data.dashboards
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    return {
      dashboards: dashboards.map((d) => ({
        id: d.id || d.dashboardId,
        title: d.title,
        color: d.color,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        createdByMe: d.createdByMe,
        userId: d.userId || d.createdBy?.id || d.ownerId || d.createdById,
      })),
      cursorId: data?.cursorId,
    };
  } catch (e) {
    const errorMessage = e.response?.data?.message || '대시보드를 불러올 수 없습니다.';
    throw new Error(errorMessage);
  }
}

// GET /dashboards/:dashboardId
export async function getDashboardsId(dashboardId) {
  /* dashboardId: number; */
  try {
    const res = await api.get(`/dashboards/${dashboardId}`);
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id || data.dashboardId,
      title: data.title,
      color: data.color,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdByMe: data.createdByMe,
      userId: data.userId || data.createdBy?.id || data.ownerId || data.createdById,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch dashboard' };
  }
}

// PUT /dashboards/:dashboardId *대시보드 생성자만 수정 가능
export async function putDashboardsId(dashboardId, dashboardData) {
  /* dashboardId: number;
  dashboardData: {
    title: string;
    color: string;
  }
  */
  try {
    const res = await api.put(`/dashboards/${dashboardId}`, dashboardData);
    return res.data;
  } catch (e) {
    return e.response?.data;
  }
}

// DELETE /dashboards/:dashboardId *대시보드 생성자만 삭제 가능
export async function deleteDashboardsId(dashboardId) {
  /* dashboardId: number; */
  try {
    const res = await api.delete(`/dashboards/${dashboardId}`, { data: {} });
    return res.data;
  } catch (e) {
    return e.response?.data;
  }
}

// POST /dashboards/:dashboardId/invitations *대시보드 생성자만 초대 가능
export async function postDashboardsIdInvitations(dashboardId, emailData) {
  /* dashboardId: number;
  emailData: { email: string }
  */
  try {
    const res = await api.post(`/dashboards/${dashboardId}/invitations`, emailData);
    return res.data;
  } catch (e) {
    return e.response?.data || { message: '초대에 실패했습니다.' };
  }
}

// GET /dashboards/:dashboardId/invitations
export async function getDashboardsIdInvitations(dashboardId, { page = 1, size = 10 }) {
  /* dashboardId: number;
  page: number;
  size: number;
  */
  try {
    const res = await api.get(`/dashboards/${dashboardId}/invitations`);
    return res.data;
  } catch (e) {
    return e.response?.data;
  }
}

// DELETE /dashboards/:dashboardId/invitations/:invitationId
export async function deleteDashboardsIdInvitations(dashboardId, invitationId) {
  try {
    const res = await api.delete(`/dashboards/${dashboardId}/invitations/${invitationId}`, {
      data: {},
    });
    return res.data;
  } catch (e) {
    return e.response?.data;
  }
}
