import api from '@/lib/api';

// POST /comments
export async function postComments(commentData) {
  /* commentData: {
    content: string;
    cardId: number;
    columnId: number;
    dashboardId: number;
  }
  */
  try {
    const res = await api.post('/comments', commentData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /comments
export async function getComments({ size = 10, cursorId, cardId }) {
  /* size: number;
  cursorId: number;
  cardId: number;
  */
  if (!cardId) return { error: 'cardId is required' };

  try {
    const res = await api.get('/comments', { params: { size, cursorId, cardId } });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// PUT /comments/:commentId
export async function putCommentsId(commentId, content) {
  /* commentId: number;
  content: string;
  */
  try {
    const res = await api.put(`/comments/${commentId}`, { content });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /comments/:commentId
export async function deleteCommentsId(commentId) {
  /* commentId: number; */
  try {
    const res = await api.delete(`/comments/${commentId}`, { data: {} });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
