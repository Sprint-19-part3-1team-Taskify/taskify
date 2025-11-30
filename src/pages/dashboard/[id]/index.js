import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useHeader } from '@/context/HeaderProvider';
import { useAuth } from '@/context/authProvider';
import { withAuth } from '@/lib/auth';

// API
import { getDashboardsId } from '@/api/dashboards';
import { getMembers } from '@/api/members';
import { getColumns, postColumns, putColumnsId, deleteColumnsId } from '@/api/columns';
import { getCards, postCards, putCardsId, deleteCardsId } from '@/api/cards';

// DnD Kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

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
  const [columnTotalCount, setColumnTotalCount] = useState({}); // 컬럼별 전체 카드 개수

  // useRef로 로딩 상태 추적 (중복 호출 방지)
  const loadingRef = useRef({});
  const hasMoreRef = useRef({});

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

  // DnD 관련 상태
  const [activeCard, setActiveCard] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100, // 100ms 이상 눌러야 드래그 시작
        tolerance: 5, // 5px 이내 움직임은 허용
      },
    }),
  );

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
      members: members,
    });
  }, [dashboard, fixedId, members, setHeaderConfig]);

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
      // 중복 호출 방지
      if (!reset && loadingRef.current[columnId]) {
        return;
      }
      if (!reset && hasMoreRef.current[columnId] === false) {
        return;
      }

      loadingRef.current[columnId] = true;
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

          const hasMore = !!res.cursorId;
          hasMoreRef.current[columnId] = hasMore;
          setColumnHasMore((prev) => ({ ...prev, [columnId]: hasMore }));

          // totalCount 저장 (API 응답에 포함되어 있음)
          if (res.totalCount !== undefined) {
            setColumnTotalCount((prev) => ({ ...prev, [columnId]: res.totalCount }));
          }
        }
      } catch (error) {
        console.error('❌ 카드 조회 실패:', error);
      } finally {
        loadingRef.current[columnId] = false;
        setColumnLoading((prev) => ({ ...prev, [columnId]: false }));
      }
    },
    [columnCursors],
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
        // 컬럼이 변경되었는지 확인
        const originalColumnId = selectedColumn?.id;
        const newColumnId = updatedData.columnId;

        if (originalColumnId !== newColumnId) {
          // 컬럼이 변경된 경우: 원래 컬럼과 새 컬럼 모두 새로고침
          fetchColumnCards(originalColumnId, true);
          fetchColumnCards(newColumnId, true);
        } else {
          // 같은 컬럼 내 수정인 경우: 해당 컬럼만 새로고침
          fetchColumnCards(updatedData.columnId, true);
        }
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
   * DnD 핸들러
   ------------------------------------------ */
  const handleDragStart = (event) => {
    const { active } = event;
    const cardId = active.id;

    // 모든 컬럼에서 해당 카드 찾기
    let foundCard = null;
    for (const columnId in columnCards) {
      const card = columnCards[columnId]?.find((c) => c.id === cardId);
      if (card) {
        foundCard = card;
        break;
      }
    }
    setActiveCard(foundCard);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const cardId = active.id;
    const overId = over.id;

    // 카드의 원래 컬럼 찾기
    let sourceColumnId = null;
    let sourceIndex = -1;
    for (const columnId in columnCards) {
      const index = columnCards[columnId]?.findIndex((c) => c.id === cardId);
      if (index !== -1) {
        sourceColumnId = Number(columnId);
        sourceIndex = index;
        break;
      }
    }

    if (!sourceColumnId || sourceIndex === -1) return;

    const card = columnCards[sourceColumnId][sourceIndex];
    if (!card) return;

    // over가 컬럼인지 카드인지 판단
    let targetColumnId = null;
    let targetIndex = -1;

    // over가 컬럼 ID인 경우
    if (columns.some((col) => col.id === overId)) {
      targetColumnId = overId;
      // 컬럼의 빈 공간(맨 아래)에 드롭하면 맨 아래로 이동
      targetIndex = columnCards[overId]?.length || 0;
    } else {
      // over가 카드 ID인 경우
      for (const columnId in columnCards) {
        const index = columnCards[columnId]?.findIndex((c) => c.id === overId);
        if (index !== -1) {
          targetColumnId = Number(columnId);
          // 같은 칼럼이면 기존 인덱스 로직, 다른 칼럼이면 무조건 맨 아래
          if (targetColumnId !== sourceColumnId) {
            targetIndex = columnCards[targetColumnId]?.length || 0;
          } else {
            targetIndex = index;
          }
          break;
        }
      }
    }

    if (!targetColumnId) return;

    // 같은 컬럼 내에서 순서 변경
    if (sourceColumnId === targetColumnId) {
      if (sourceIndex === targetIndex) return;

      const reorderedCards = arrayMove(columnCards[sourceColumnId], sourceIndex, targetIndex);

      setColumnCards((prev) => ({
        ...prev,
        [sourceColumnId]: reorderedCards,
      }));

      // TODO: API가 카드 순서 변경을 지원하면 여기에 API 호출 추가
      // 현재는 로컬 상태만 변경
      return;
    }

    // 다른 컬럼으로 이동
    try {
      // API 호출하여 카드의 컬럼 변경
      const updatedData = {
        columnId: targetColumnId,
        assigneeUserId: card.assignee?.userId,
        title: card.title,
        description: card.description,
        dueDate: (() => {
          const date = new Date(card.dueDate);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hours}:${minutes}`;
        })(),
        tags: card.tags,
        imageUrl: card.imageUrl || undefined,
      };

      await putCardsId(cardId, updatedData);

      // UI 즉시 업데이트 (낙관적 업데이트)
      const sourceCards = columnCards[sourceColumnId].filter((c) => c.id !== cardId);
      const targetCards = [...(columnCards[targetColumnId] || [])];

      if (targetIndex >= 0 && targetIndex < targetCards.length) {
        targetCards.splice(targetIndex, 0, card);
      } else {
        targetCards.unshift(card);
      }

      setColumnCards((prev) => ({
        ...prev,
        [sourceColumnId]: sourceCards,
        [targetColumnId]: targetCards,
      }));

      // 두 컬럼 모두 새로고침
      fetchColumnCards(sourceColumnId, true);
      fetchColumnCards(targetColumnId, true);
    } catch (error) {
      console.error('카드 이동 실패:', error);
      openAlert('카드 이동에 실패했습니다.');
    }
  };

  /* ------------------------------------------
   * 렌더링
   ------------------------------------------ */

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* 컬럼 영역 */}
      <div style={{ padding: '24px' }}>
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
                columnId={column.id}
                title={column.title}
                cardCount={columnTotalCount[column.id] || 0}
                onAddTodo={() => openModal('todoCreate', column)}
                onManageColumn={() => openModal('columnManage', column)}
                onLoadMore={() => fetchColumnCards(column.id)}
                hasMore={columnHasMore[column.id]}
                loading={columnLoading[column.id]}
              >
                <SortableContext
                  items={(columnCards[column.id] || []).map((card) => card.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columnCards[column.id]?.map((card) => (
                    <Card
                      key={card.id}
                      cardId={card.id}
                      imageUrl={card.imageUrl}
                      title={card.title}
                      tags={card.tags}
                      date={card.dueDate}
                      assignee={card.assignee}
                      onClick={() => handleCardClick(card, column)}
                    />
                  ))}
                </SortableContext>
              </Column>
              {idx < columns.length - 1 && (
                <div
                  style={{
                    width: 1,
                    background: '#E0E0E0',
                    alignSelf: 'stretch',
                    margin: '0 12px',
                  }}
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
      </div>

      {/* DragOverlay: 드래그 중인 카드 표시 */}
      <DragOverlay>
        {activeCard ? (
          <div style={{ opacity: 0.8, cursor: 'grabbing' }}>
            <Card
              imageUrl={activeCard.imageUrl}
              title={activeCard.title}
              tags={activeCard.tags}
              date={activeCard.dueDate}
              assignee={activeCard.assignee}
            />
          </div>
        ) : null}
      </DragOverlay>

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
        columns={columns}
        onSuccess={handleUpdateCard}
      />

      <TodoDetailModal
        isOpen={modals.todoDetail}
        closeModal={() => closeModal('todoDetail')}
        cardData={selectedCard}
        dashboardId={dashboardNumericId}
        columnId={selectedColumn?.id}
        columns={columns}
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
    </DndContext>
  );
}

export const getServerSideProps = withAuth();
