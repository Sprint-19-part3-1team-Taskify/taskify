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
    return res.data;
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
