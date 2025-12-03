// /api/invitations.js
import api from '@/lib/api';

// GET /invitations
export async function getInvitations({ size = 10, cursorId, title } = {}) {
  /* size: number;
  cursorId: number;
  title: string;
  */
  try {
    const res = await api.get('/invitations', {
      params: { size, cursorId, title },
    });
    const data = res.data;

    // 필요한 필드만 추출
    const invitations = Array.isArray(data?.invitations)
      ? data.invitations
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
          ? data
          : [];

    return {
      invitations: invitations.map((item) => ({
        id: item.id || item.invitationId,
        dashboardId: item.dashboard?.id || item.dashboardId,
        dashboardTitle: item.dashboard?.title || item.dashboardTitle,
        inviter: item.inviter
          ? {
              id: item.inviter.id || item.inviter.userId,
              nickname: item.inviter.nickname,
              email: item.inviter.email,
            }
          : item.invitedBy
            ? {
                id: item.invitedBy.id || item.invitedBy.userId,
                nickname: item.invitedBy.nickname || item.invitedBy.name,
                email: item.invitedBy.email,
              }
            : null,
        status: item.status || item.invitationStatus,
      })),
      cursorId: data?.cursorId,
    };
  } catch (e) {
    return e.response?.data || null;
  }
}

// PUT /invitations/:invitationId
export async function putInvitationsId(invitationId, inviteAccepted) {
  /* invitationId: number;
  inviteAccepted: boolean;
  */
  try {
    const res = await api.put(`/invitations/${invitationId}`, {
      inviteAccepted,
    });
    return res.data;
  } catch (e) {
    return e.response?.data || null;
  }
}
