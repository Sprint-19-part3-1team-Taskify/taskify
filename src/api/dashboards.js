import api from '@/lib/api';

// POST /dashboards
export async function postDashboards(dashboardData) {
  try {
    const res = await api.post('/dashboards', dashboardData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /dashboards
export async function getDashboards({ navigationMethod, cursorId, page = 1, size = 10 }) {
  try {
    const res = await api.get('/dashboards', {
      params: { navigationMethod, cursorId, page, size },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /dashboards/:dashboardId
export async function getDashboardsId(dashboardId) {
  try {
    const res = await api.get(`/dashboards/${dashboardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// PUT /dashboards/:dashboardId *대시보드 생성자만 수정 가능
export async function putDashboardsId(dashboardId, dashboardData) {
  try {
    const res = await api.put(`/dashboards/${dashboardId}`, dashboardData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /dashboards/:dashboardId *대시보드 생성자만 삭제 가능
export async function deleteDashboardsId(dashboardId) {
  try {
    const res = await api.delete(`/dashboards/${dashboardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// POST /dashboards/:dashboardId/invitations *대시보드 생성자만 초대 가능
export async function postDashboardsIdInvitations(dashboardId, email) {
  try {
    const res = await api.post(`/dashboards/${dashboardId}/invitations`, { email });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /dashboards/:dashboardId/invitations
export async function getDashboardsIdInvitations(dashboardId, { page = 1, size = 10 }) {
  try {
    const res = await api.get(`/dashboards/${dashboardId}/invitations`, {
      params: { page, size },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /dashboards/:dashboardId/invitations/:invitationId
export async function deleteDashboardsIdInvitations(dashboardId, invitationId) {
  try {
    const res = await api.delete(`/dashboards/${dashboardId}/invitations/${invitationId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
