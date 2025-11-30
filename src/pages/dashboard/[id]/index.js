import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useHeader } from '@/context/HeaderProvider';
import { useAuth } from '@/context/authProvider';
import { withAuth } from '@/lib/auth';

// API
import { getDashboardsId } from '@/api/dashboards';
import { getMembers } from '@/api/members';
import { getColumns, postColumns, putColumnsId, deleteColumnsId } from '@/api/columns';
import { getCards, postCards, putCardsId, deleteCardsId } from '@/api/cards';

// Components
import Column from '@/components/column/Column';
import Card from '@/components/card/Card';
import { AddColumnButton } from '@/components/button';

// Modals
import TodoCreateModal from '@/components/modal/TodoCreateModal';
import TodoEditModal from '@/components/modal/TodoEditModal';
import TodoDetailModal from '@/components/modal/TodoDetailModal';
import ColumnCreateModal from '@/components/modal/ColumnCreateModal';
import ColumnManageModal from '@/components/modal/ColumnManageModal';
import Modal from '@/components/modal/Modal';

export default function DashboardDetail() {
  const router = useRouter();
  const id = router.query.id;
  const fixedId = Array.isArray(id) ? id[id.length - 1] : id;
  const dashboardNumericId = fixedId ? Number(fixedId) : null;

  const { setHeaderConfig } = useHeader();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [members, setMembers] = useState([]);
  const [columns, setColumns] = useState([]);

  // 컬럼별 카드 목록/커서/상태
  const [columnCards, setColumnCards] = useState({});
  const [columnCursors, setColumnCursors] = useState({});
  const [columnHasMore, setColumnHasMore] = useState({});
  const [columnLoading, setColumnLoading] = useState({});

  // 모달 상태
  const [modals, setModals] = useState({
    todoCreate: false,
    todoEdit: false,
    todoDetail: false,
    columnCreate: false,
    columnManage: false,
  });

  const [selectedColumn, setSelectedColumn] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Alert 모달 상태
  const [alertState, setAlertState] = useState({ open: false, message: '' });
  const openAlert = (message) => setAlertState({ open: true, message });
  const closeAlert = () => setAlertState({ open: false, message: '' });

  /* ------------------------------------------
   * Header 설정
   ------------------------------------------ */
  useEffect(() => {
    if (!fixedId || !dashboard) return;

    const isOwner = dashboard?.createdByMe || false;

    setHeaderConfig({
      headerType: 'header4',
      dashboardName: dashboard?.title || '대시보드 상세',
      sidemenuShow: true,
      showCrown: isOwner,
      isOwner: isOwner,
      dashboardId: fixedId,
    });
  }, [dashboard, fixedId, setHeaderConfig]);

  /* ------------------------------------------
   * 대시보드 상세 & 구성원 조회
   ------------------------------------------ */
  useEffect(() => {
    if (!router.isReady || !dashboardNumericId) return;

    const fetchData = async () => {
      setLoading(true);

      const res = await getDashboardsId(dashboardNumericId);
      if (res?.id) setDashboard(res);

      const membersRes = await getMembers({ dashboardId: dashboardNumericId, page: 1, size: 50 });
      if (membersRes?.members) setMembers(membersRes.members);

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, dashboardNumericId]);

  /* ------------------------------------------
   * 컬럼 목록 조회
   ------------------------------------------ */
  useEffect(() => {
    if (!dashboardNumericId) return;

    const fetchColumns = async () => {
      const res = await getColumns(dashboardNumericId);
      if (res?.data) {
        setColumns(res.data);
        res.data.forEach((column) => {
          fetchColumnCards(column.id, true);
        });
      }
    };

    fetchColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fixedId]);

  /* ------------------------------------------
   * 컬럼별 카드 조회 (무한 스크롤)
   ------------------------------------------ */
  const fetchColumnCards = useCallback(
    async (columnId, reset = false) => {
      if (!reset && columnLoading[columnId]) return;
      if (!reset && !columnHasMore[columnId]) return;

      setColumnLoading((prev) => ({ ...prev, [columnId]: true }));

      try {
        const res = await getCards({
          columnId,
          size: 10,
          cursorId: reset ? null : columnCursors[columnId],
        });

        if (res?.cards) {
          // 이미지 URL 정규화 (상대경로 -> 절대경로)
          const CDN = 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com';
          const normalizedCards = res.cards.map((card) => ({
            ...card,
            imageUrl:
              card.imageUrl && !/^https?:\/\//.test(card.imageUrl)
                ? `${CDN}${card.imageUrl.startsWith('/') ? '' : '/'}${card.imageUrl}`
                : card.imageUrl,
          }));

          setColumnCards((prev) => ({
            ...prev,
            [columnId]: reset ? normalizedCards : [...(prev[columnId] || []), ...normalizedCards],
          }));
          setColumnCursors((prev) => ({ ...prev, [columnId]: res.cursorId }));
          setColumnHasMore((prev) => ({ ...prev, [columnId]: !!res.cursorId }));
        }
      } catch (error) {
        console.error('카드 조회 실패:', error);
      } finally {
        setColumnLoading((prev) => ({ ...prev, [columnId]: false }));
      }
    },
    [columnLoading, columnHasMore, columnCursors],
  );

  /* ------------------------------------------
   * 모달 제어
   ------------------------------------------ */
  const openModal = (modalName, data = null) => {
    setModals((prev) => ({ ...prev, [modalName]: true }));
    if (modalName === 'todoCreate' || modalName === 'columnManage') {
      setSelectedColumn(data);
    } else if (modalName === 'todoDetail' || modalName === 'todoEdit') {
      setSelectedCard(data);
    }
  };

  const closeModal = (modalName) => {
    setModals((prev) => ({ ...prev, [modalName]: false }));
    if (modalName === 'todoCreate' || modalName === 'columnManage') {
      setSelectedColumn(null);
    } else if (modalName === 'todoDetail' || modalName === 'todoEdit') {
      setSelectedCard(null);
    }
  };

  /* ------------------------------------------
   * 컬럼 CRUD
   ------------------------------------------ */
  const handleCreateColumn = async (columnData) => {
    try {
      const payload = { ...columnData, dashboardId: dashboardNumericId };
      const res = await postColumns(payload);
      if (res?.id) {
        setColumns((prev) => [...prev, res]);
        closeModal('columnCreate');
        fetchColumnCards(res.id, true);
      }
    } catch (error) {
      console.error('컬럼 생성 실패:', error);
      openAlert('컬럼 생성에 실패했습니다.');
    }
  };

  const handleUpdateColumn = async (columnId, newTitle) => {
    try {
      const res = await putColumnsId(columnId, newTitle);
      if (res?.id) {
        setColumns((prev) =>
          prev.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)),
        );
        closeModal('columnManage');
      }
    } catch (error) {
      console.error('컬럼 수정 실패:', error);
      openAlert('컬럼 수정에 실패했습니다.');
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await deleteColumnsId(columnId);
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
      setColumnCards((prev) => {
        const next = { ...prev };
        delete next[columnId];
        return next;
      });
      closeModal('columnManage');
    } catch (error) {
      console.error('컬럼 삭제 실패:', error);
      openAlert('컬럼 삭제에 실패했습니다.');
    }
  };

  /* ------------------------------------------
   * 카드 CRUD
   ------------------------------------------ */
  const handleCreateCard = async (cardData) => {
    try {
      const payload = {
        ...cardData,
        dashboardId: Number(dashboardNumericId),
        columnId: Number(cardData.columnId),
        assigneeUserId: Number(cardData.assigneeUserId),
      };
      console.log('Card payload:', payload); // 디버깅용
      const res = await postCards(payload);
      if (res?.id) {
        fetchColumnCards(payload.columnId, true);
        closeModal('todoCreate');
      }
    } catch (error) {
      console.error('카드 생성 실패:', error);
      openAlert('카드 생성에 실패했습니다.');
    }
  };

  const handleUpdateCard = async (cardId, updatedData) => {
    try {
      const res = await putCardsId(cardId, updatedData);
      if (res?.id) {
        fetchColumnCards(updatedData.columnId, true);
        closeModal('todoEdit');
      }
    } catch (error) {
      console.error('카드 수정 실패:', error);
      openAlert('카드 수정에 실패했습니다.');
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      await deleteCardsId(cardId);
      setColumnCards((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((cid) => {
          next[cid] = (next[cid] || []).filter((card) => card.id !== cardId);
        });
        return next;
      });
    } catch (error) {
      console.error('카드 삭제 실패:', error);
      openAlert('카드 삭제에 실패했습니다.');
    }
  };

  const handleCardClick = (card, column) => {
    setSelectedCard(card);
    setSelectedColumn(column);
    openModal('todoDetail', card);
  };

  const handleEditFromDetail = (card) => {
    // 상세 모달 먼저 닫고 수정 모달 오픈
    closeModal('todoDetail');
    setSelectedCard(card);
    openModal('todoEdit', card);
  };

  /* ------------------------------------------
   * 렌더링
   ------------------------------------------ */

  return (
    <div style={{ padding: '24px' }}>
      {/* 컬럼 영역 */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          overflowX: 'auto',
          paddingTop: 24,
          alignItems: 'flex-start',
        }}
      >
        {columns.map((column, idx) => (
          <div key={column.id} style={{ display: 'flex' }}>
            <Column
              title={column.title}
              cardCount={columnCards[column.id]?.length || 0}
              onAddTodo={() => openModal('todoCreate', column)}
              onManageColumn={() => openModal('columnManage', column)}
              onLoadMore={() => fetchColumnCards(column.id)}
              hasMore={columnHasMore[column.id]}
              loading={columnLoading[column.id]}
            >
              {columnCards[column.id]?.map((card) => (
                <div key={card.id} onClick={() => handleCardClick(card, column)}>
                  <Card
                    imageUrl={card.imageUrl}
                    title={card.title}
                    tags={card.tags}
                    date={card.dueDate}
                    assignee={card.assignee}
                  />
                </div>
              ))}
            </Column>
            {idx < columns.length - 1 && (
              <div
                style={{ width: 1, background: '#E0E0E0', alignSelf: 'stretch', margin: '0 12px' }}
              />
            )}
          </div>
        ))}

        {/* 새로운 컬럼 추가 버튼 */}
        {columns.length < 10 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
              paddingLeft: '24px',
              borderLeft: '1px solid #d9d9d9',
            }}
          >
            <AddColumnButton onClick={() => openModal('columnCreate')}>
              새로운 컬럼 추가하기
            </AddColumnButton>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <TodoCreateModal
        isOpen={modals.todoCreate}
        closeModal={() => closeModal('todoCreate')}
        columnId={selectedColumn?.id}
        dashboardId={dashboardNumericId}
        members={members}
        onSuccess={handleCreateCard}
      />

      <TodoEditModal
        isOpen={modals.todoEdit}
        closeModal={() => closeModal('todoEdit')}
        cardData={selectedCard}
        columnId={selectedColumn?.id}
        dashboardId={dashboardNumericId}
        members={members}
        onSuccess={handleUpdateCard}
      />

      <TodoDetailModal
        isOpen={modals.todoDetail}
        closeModal={() => closeModal('todoDetail')}
        cardData={selectedCard}
        dashboardId={dashboardNumericId}
        columnId={selectedColumn?.id}
        userId={user?.id}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteCard}
      />

      <ColumnCreateModal
        isOpen={modals.columnCreate}
        closeModal={() => closeModal('columnCreate')}
        dashboardId={dashboardNumericId}
        existingColumns={columns}
        onSuccess={handleCreateColumn}
      />

      <ColumnManageModal
        isOpen={modals.columnManage}
        closeModal={() => closeModal('columnManage')}
        columnData={selectedColumn}
        existingColumns={columns}
        onUpdate={handleUpdateColumn}
        onDelete={handleDeleteColumn}
      />

      {/* Alert 모달 */}
      <Modal
        id="dashboardAlert"
        variant="alert"
        isOpen={alertState.open}
        closeModal={closeAlert}
        primaryBtn="확인"
      >
        {alertState.message}
      </Modal>
    </div>
  );
}

export const getServerSideProps = withAuth();
