import api from '@/lib/api';

// POST /cards
export async function postCards(cardData) {
  /*
  cardData: {
    assigneeUserId: number;
    dashboardId: number;
    columnId: number;
    title: string;
    description: string;
    dueDate: string;
    tags: string[];
    imageUrl: string;
  }
  */
  try {
    const res = await api.post('/cards', cardData);
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      assignee: data.assignee
        ? {
            userId: data.assignee.userId || data.assignee.id,
            nickname: data.assignee.nickname,
            email: data.assignee.email,
            profileImageUrl: data.assignee.profileImageUrl,
          }
        : null,
      columnId: data.columnId,
      dashboardId: data.dashboardId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to create card' };
  }
}

// GET /cards
export async function getCards({ size = 10, cursorId, columnId }) {
  /* size: number;
  cursorId: number;
  columnId: number;
  */
  if (!columnId) return { error: 'columnId is required' };

  try {
    const res = await api.get('/cards', { params: { size, cursorId, columnId } });
    const data = res.data;

    // 필요한 필드만 추출
    return {
      cards: (data?.cards || []).map((card) => ({
        id: card.id,
        title: card.title,
        description: card.description,
        dueDate: card.dueDate,
        tags: card.tags || [],
        imageUrl: card.imageUrl,
        assignee: card.assignee
          ? {
              userId: card.assignee.userId || card.assignee.id,
              nickname: card.assignee.nickname,
              email: card.assignee.email,
              profileImageUrl: card.assignee.profileImageUrl,
            }
          : null,
        columnId: card.columnId,
        dashboardId: card.dashboardId,
      })),
      cursorId: data?.cursorId,
      totalCount: data?.totalCount,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch cards' };
  }
}

// PUT /cards/:cardId
export async function putCardsId(cardId, cardData) {
  /* 
  cardId: number;
  cardData: {
    columnId: number;
    assigneeUserId: number;
    title: string;
    description: string;
    dueDate: string;
    tags: string[];
    imageUrl: string;
  }
  */
  try {
    const res = await api.put(`/cards/${cardId}`, cardData);
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      assignee: data.assignee
        ? {
            userId: data.assignee.userId || data.assignee.id,
            nickname: data.assignee.nickname,
            email: data.assignee.email,
            profileImageUrl: data.assignee.profileImageUrl,
          }
        : null,
      columnId: data.columnId,
      dashboardId: data.dashboardId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to update card' };
  }
}

// GET /cards/:cardId
export async function getCardsId(cardId) {
  /* cardId: number; */
  try {
    const res = await api.get(`/cards/${cardId}`);
    const data = res.data;

    // 필요한 필드만 추출
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      assignee: data.assignee
        ? {
            userId: data.assignee.userId || data.assignee.id,
            nickname: data.assignee.nickname,
            email: data.assignee.email,
            profileImageUrl: data.assignee.profileImageUrl,
          }
        : null,
      columnId: data.columnId,
      dashboardId: data.dashboardId,
    };
  } catch (e) {
    return e.response?.data || { error: 'Failed to fetch card' };
  }
}

// DELETE /cards/:cardId
export async function deleteCardsId(cardId) {
  /* cardId: number; */
  try {
    const res = await api.delete(`/cards/${cardId}`, { data: {} });
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
