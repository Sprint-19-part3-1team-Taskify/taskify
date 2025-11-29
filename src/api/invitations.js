// /api/invitations.js
import api from '@/lib/api';

/* ------------------------------
   GET /invitations
   내가 받은 초대 목록 조회
------------------------------ */
export async function getInvitations({ size = 10, cursorId, title } = {}) {
  try {
    const res = await api.get('/invitations', {
      params: { size, cursorId, title },
    });
    return res.data;
  } catch (e) {
    return e.response?.data || null;
  }
}

/* ------------------------------
   PUT /invitations/:invitationId
   초대 응답(수락/거절)
   ⚠ Swagger 명세: { inviteAccepted: boolean }
------------------------------ */
export async function putInvitationsId(invitationId, inviteAccepted) {
  try {
    const res = await api.put(`/invitations/${invitationId}`, {
      inviteAccepted,
    });
    return res.data;
  } catch (e) {
    return e.response?.data || null;
  }
}
