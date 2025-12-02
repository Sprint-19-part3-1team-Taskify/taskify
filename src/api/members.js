import api from '@/lib/api';

// GET /members
export async function getMembers({ page = 1, size = 20, dashboardId }) {
  /* page: number;
  size: number;
  dashboardId: number;
  */
  if (!dashboardId) return { error: 'dashboardId is required' };

  try {
    const res = await api.get('/members', {
      params: { page, size, dashboardId },
    });
    const data = res.data;

    // 필요한 필드만 추출
    const members = Array.isArray(data?.members) ? data.members : Array.isArray(data) ? data : [];
    return {
      members: members.map((member) => ({
        userId: member.userId || member.id,
        nickname: member.nickname,
        email: member.email,
        profileImageUrl: member.profileImageUrl,
        isOwner: member.isOwner,
      })),
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch members' };
  }
}

// DELETE /members/:memberId
export async function deleteMembersId(memberId) {
  /* memberId: number; */
  try {
    const res = await api.delete(`/members/${memberId}`, { data: {} });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
