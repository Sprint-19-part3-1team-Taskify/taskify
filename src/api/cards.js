import api from '@/lib/api';

// POST /cards
export async function postCards(cardData) {
  try {
    const res = await api.post('/cards', cardData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /cards
export async function getCards({ size, cursorId, columnId }) {
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
  try {
    const res = await api.put(`/cards/${cardId}`, cardData);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// GET /cards/:cardId
export async function getCardsId(cardId) {
  try {
    const res = await api.get(`/cards/${cardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}

// DELETE /cards/:cardId
export async function deleteCardsId(cardId) {
  try {
    const res = await api.delete(`/cards/${cardId}`);
    return res.data;
  } catch (e) {
    return e.response.data;
  }
}
