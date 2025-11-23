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
    return res.data;
  } catch (e) {
    return e.response.data;
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
    return res.data;
  } catch (e) {
    return e.response.data;
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
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /cards/:cardId
export async function getCardsId(cardId) {
  /* cardId: number; */
  try {
    const res = await api.get(`/cards/${cardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /cards/:cardId
export async function deleteCardsId(cardId) {
  /* cardId: number; */
  try {
    const res = await api.delete(`/cards/${cardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
