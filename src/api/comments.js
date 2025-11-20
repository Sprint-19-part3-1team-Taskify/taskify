import api from '@/lib/api';

// POST /comments
export async function postComments(commentData) {
  try {
    const res = await api.post('/comments', commentData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /comments
export async function getComments({ size = 10, cursorId, cardId }) {
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
  try {
    const res = await api.put(`/comments/${commentId}`, { content });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /comments/:commentId
export async function deleteCommentsId(commentId) {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
