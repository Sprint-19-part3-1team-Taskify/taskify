import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Modal from './Modal';
import User from '@/components/common/User';
import Tag from '@/components/common/Tag';
import Progress from '@/components/common/Progress';
import Textarea from '@/components/input/Textarea';
import styles from './Modal.module.scss';
import { getComments, postComments, putCommentsId, deleteCommentsId } from '@/api/comments';

/**
 * 할 일 카드 상세 모달
 * - /guide/modal 페이지의 할일 상세 모달 UI 참고하여 재작성
 * - 만들어진 카드 정보 표시
 * - 댓글 CRUD 기능
 * - 댓글 무한 스크롤
 * - 수정/삭제 드롭다운 메뉴
 */
export default function TodoDetailModal({
  isOpen,
  closeModal,
  cardData,
  dashboardId,
  columnId,
  columns = [],
  userId,
  onEdit,
  onDelete,
  onUpdate,
}) {
  // 컬럼 이름 찾기
  const columnName = columns.find((col) => col.id === columnId)?.title || '컬럼';
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null); // unique key (id or index)
  const [editingContent, setEditingContent] = useState('');
  const [cursorId, setCursorId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const observerTarget = useRef(null);

  // 댓글 목록 조회
  const fetchComments = useCallback(
    async (reset = false) => {
      if (!cardData?.id || loading) return;

      setLoading(true);
      try {
        const res = await getComments({
          cardId: cardData.id,
          size: 10,
          cursorId: reset ? null : cursorId,
        });

        if (res?.comments) {
          setComments((prev) => (reset ? res.comments : [...prev, ...res.comments]));
          setCursorId(res.cursorId);
          setHasMore(!!res.cursorId);
        }
      } catch (error) {
        console.error('댓글 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    },
    [cardData?.id, cursorId, loading],
  );

  // 모달 열릴 때 댓글 초기 로드
  useEffect(() => {
    if (isOpen && cardData?.id) {
      setComments([]);
      setCursorId(null);
      setHasMore(true);
      fetchComments(true);
    }
    // fetchComments는 useCallback으로 메모이제이션되어 있음
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, cardData?.id]);

  // 무한 스크롤 옵저버
  useEffect(() => {
    // hasMore가 명시적으로 false일 때만 중단 (undefined는 허용)
    if (hasMore === false || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchComments();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [hasMore, loading, fetchComments]);

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    try {
      const res = await postComments({
        content: commentInput,
        cardId: cardData.id,
        columnId: columnId,
        dashboardId: dashboardId,
      });

      if (res?.id) setComments((prev) => [res, ...prev]);
      setCommentInput('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // 댓글 수정 시작
  const startEditComment = (comment, key) => {
    const safeKey = key;
    setEditingCommentId(safeKey);
    setEditingContent(comment.content || '');
  };

  // 댓글 수정 저장
  const saveEditComment = async (commentKey) => {
    if (!editingContent.trim()) return;

    try {
      // 원본 댓글 id 찾기
      const target = comments.find(
        (c, idx) => (c.id ?? c.commentId ?? c._id ?? idx) === commentKey,
      );
      if (!target) return;
      const apiId = target.id; // API 업데이트용 id
      const res = await putCommentsId(apiId, editingContent);
      if (res?.id) {
        setComments((prev) =>
          prev.map((c, idx) => {
            const key = c.id ?? c.commentId ?? c._id ?? idx;
            return key === commentKey ? { ...c, content: editingContent } : c;
          }),
        );
        setEditingCommentId(null);
        setEditingContent('');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    }
  };

  // 댓글 수정 취소
  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditingContent('');
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteCommentsId(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  // 카드 삭제
  const handleCardDelete = async () => {
    if (onDelete) {
      onDelete(cardData.id);
      setShowDeleteConfirm(false);
      closeModal('todoDetailModal');
    }
  };

  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  // 카드 수정 모달 열기
  const handleCardEdit = () => {
    if (onEdit) {
      onEdit(cardData);
    }
  };

  if (!cardData) return null;

  const CDN = 'https://sprint-fe-project.s3.ap-northeast-2.amazonaws.com';
  const normalizeUrl = (url) =>
    url && !/^https?:\/\//.test(url) ? `${CDN}${url.startsWith('/') ? '' : '/'}${url}` : url;

  // 마감일 포맷터: TZ 표기가 있는 경우만 로컬 변환, 없는 경우 로컬로 그대로 처리
  const formatDueDate = (raw) => {
    if (!raw) return '미정';
    try {
      if (typeof raw === 'string') {
        const hasTZ = /[zZ]|[+-]\d{2}:?\d{2}/.test(raw);
        const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
        if (isDateOnly) {
          const [y, m, d] = raw.split('-').map((v) => parseInt(v, 10));
          const localDate = new Date(y, m - 1, d, 0, 0, 0);
          return localDate.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });
        }
        const date = new Date(raw);
        // TZ가 붙어있지 않으면 브라우저 로컬로 해석된 값을 그대로 사용 (추가 보정 없음)
        // TZ가 붙어있으면 로컬로 표시
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      } else {
        const date = new Date(raw);
        return date.toLocaleString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    } catch (e) {
      return '미정';
    }
  };

  return (
    <>
      <Modal
        id="todoDetailModal"
        variant="type2"
        title={cardData.title}
        isOpen={isOpen}
        closeModal={closeModal}
        onEdit={handleCardEdit}
        onDelete={openDeleteConfirm}
      >
        <div className={styles.todoDetail}>
          {/* 담당자 & 마감일 정보 박스 */}
          <ul className={styles.infoBox}>
            <li>
              <em className={styles.tit}>담당자</em>
              <span className={styles.data}>
                <User
                  value={cardData.assignee?.nickname || cardData.assignee?.email || '담당자 없음'}
                  profileImageUrl={cardData.assignee?.profileImageUrl}
                  type="medium"
                />
              </span>
            </li>
            <li>
              <em className={styles.tit}>마감일</em>
              <span className={styles.data} title={formatDueDate(cardData.dueDate)}>
                {formatDueDate(cardData.dueDate)}
              </span>
            </li>
          </ul>

          {/* 상세 내용 */}
          <div className={styles.detail}>
            {/* 상태 및 태그 */}
            <div className={styles.state}>
              <div className={styles.todoProgress}>
                <Progress value={columnName} />
              </div>
              {cardData.tags && cardData.tags.length > 0 && (
                <div className={styles.todoTag}>
                  {cardData.tags.map((item, index) => (
                    <Tag key={index} index={index}>
                      {item}
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            {/* 설명 */}
            <div className={styles.content}>{cardData.description}</div>

            {/* 이미지 */}
            {normalizeUrl(cardData.imageUrl) && (
              <div className={styles.image}>
                <Image src={normalizeUrl(cardData.imageUrl)} fill alt="카드 이미지" unoptimized />
              </div>
            )}

            {/* 댓글 박스 */}
            <div className={styles.commnetBox}>
              <Textarea
                label="댓글"
                id="commnet"
                name="commnet"
                value={commentInput}
                placeholder="댓글 작성하기"
                onChange={(e) => setCommentInput(e.target.value)}
                onClick={handleCommentSubmit}
              />
              <ul className={styles.commnetList}>
                {comments.map((comment, idx) => {
                  const commentKey = comment.id ?? comment.commentId ?? comment._id ?? idx;
                  return (
                    <li key={commentKey}>
                      <div className={styles.info}>
                        <User
                          value={comment.author?.nickname || comment.author?.email || '익명'}
                          profileImageUrl={comment.author?.profileImageUrl}
                          type="comment"
                        />
                        <p className={styles.date}>
                          {(() => {
                            const c = new Date(comment.createdAt);
                            const corrected = new Date(c.getTime() - 9 * 60 * 60 * 1000);
                            return corrected.toLocaleString('ko-KR');
                          })()}
                        </p>
                      </div>
                      {editingCommentId === commentKey ? (
                        <div className={styles.commnet}>
                          <div className={styles.editWrapper}>
                            <Textarea
                              label=""
                              id={`edit-${commentKey}`}
                              name={`edit-${commentKey}`}
                              value={editingContent}
                              placeholder="댓글 수정하기"
                              onChange={(e) => setEditingContent(e.target.value)}
                              onClick={() => saveEditComment(commentKey)}
                            />
                            <div className={styles.editActions}>
                              <button onClick={() => saveEditComment(commentKey)}>저장</button>
                              <button onClick={cancelEditComment}>취소</button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.commnet}>{comment.content}</div>
                      )}
                      {comment.author?.id === userId && editingCommentId !== commentKey && (
                        <div className={styles.btns}>
                          <button onClick={() => startEditComment(comment, commentKey)}>
                            수정
                          </button>
                          <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
                        </div>
                      )}
                    </li>
                  );
                })}

                {/* 무한 스크롤 트리거 */}
                {hasMore && <div ref={observerTarget} style={{ height: '20px' }} />}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
      {/* 삭제 확인 모달 */}
      <Modal
        id="todoDeleteConfirm"
        variant="confirm"
        isOpen={showDeleteConfirm}
        closeModal={closeDeleteConfirm}
        secondaryBtn="취소"
        primaryBtn="삭제"
        onClick={handleCardDelete}
        onSubClick={closeDeleteConfirm}
      >
        할 일을 삭제하시겠습니까?
      </Modal>
    </>
  );
}
