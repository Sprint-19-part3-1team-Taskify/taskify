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
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id || data.commentId,
      content: data.content,
      createdAt: data.createdAt,
      cardId: data.cardId,
      author: data.author
        ? {
            id: data.author.id || data.author.userId,
            nickname: data.author.nickname,
            email: data.author.email,
            profileImageUrl: data.author.profileImageUrl,
          }
        : null,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to create comment' };
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
    const data = res.data;

    // 필요한 필드만 추출
    const comments = Array.isArray(data?.comments)
      ? data.comments
      : Array.isArray(data)
        ? data
        : [];
    return {
      comments: comments.map((comment) => ({
        id: comment.id || comment.commentId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        cardId: comment.cardId,
        author: comment.author
          ? {
              id: comment.author.id || comment.author.userId,
              nickname: comment.author.nickname,
              email: comment.author.email,
              profileImageUrl: comment.author.profileImageUrl,
            }
          : null,
      })),
      cursorId: data?.cursorId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch comments' };
  }
}

// PUT /comments/:commentId
export async function putCommentsId(commentId, content) {
  /* commentId: number;
  content: string;
  */
  try {
    const res = await api.put(`/comments/${commentId}`, { content });
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id || data.commentId,
      content: data.content,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      cardId: data.cardId,
      author: data.author
        ? {
            id: data.author.id || data.author.userId,
            nickname: data.author.nickname,
            email: data.author.email,
            profileImageUrl: data.author.profileImageUrl,
          }
        : null,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to update comment' };
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
