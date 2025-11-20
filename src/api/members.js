import api from '@/lib/api';

// GET /members
export async function getMembers({ page = 1, size = 20, dashboardId }) {
  if (!dashboardId) return { error: 'dashboardId is required' };

  try {
    const res = await api.get('/members', {
      params: { page, size, dashboardId },
    });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /members/:memberId
export async function deleteMembersId(memberId) {
  try {
    const res = await api.delete(`/members/${memberId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
