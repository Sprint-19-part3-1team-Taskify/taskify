import React, { useState } from 'react';
import styles from './InvitationCardTable.module.scss';
import PaginationPairButton from '../button/PaginationPairButton/PaginationPairButton';
import { DeleteButton } from '../button/DeleteButton/DeleteButton';

const InvitationCardTable = ({
  title = '초대 내역',
  invitations = [],
  itemsPerPage = 5,
  onCancelInvitation, // owner 초대 취소
  onRespondInvitation, // 사용자 수락/거절
  onInvite, // 초대하기 버튼
  paginationRightIcon,
  showCancel = true, // owner 화면
  showRespond = false, // 초대받은 사용자 화면
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(invitations.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInvitations = invitations.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  const handleCancel = (invitationId) => {
    onCancelInvitation?.(invitationId);
    if (currentInvitations.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleRespond = (invitationId, accept) => {
    onRespondInvitation?.(invitationId, accept);
    if (currentInvitations.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  /** -----------------------------
   * 초대 대상/초대한 사람 구분 로직
   * ----------------------------- */

  // 초대받은 사람 정보(오너 화면에서 보여줘야 하는 정보)
  const getInviteeEmail = (inv) => inv?.invitee?.email || inv?.receiver?.email || '이메일 없음';

  const getInviteeName = (inv) => inv?.invitee?.nickname || inv?.receiver?.nickname || '이름 없음';

  // 초대한 사람 정보(초대받은 화면에서 보여줘야 하는 정보)
  const getInviterName = (inv) =>
    inv?.inviter?.nickname || inv?.sender?.nickname || '초대한 사람 없음';

  const dashboardTitle = (inv) => inv?.dashboard?.title || '(제목 없음)';

  return (
    <div className={styles.cardTable}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.headerRight}>
          <span className={styles.pageInfo}>
            {totalPages} 페이지 중 {currentPage}
          </span>

          <PaginationPairButton
            size="small"
            prevState={currentPage === 1 ? 'inactive' : 'active'}
            nextState={currentPage === totalPages ? 'inactive' : 'active'}
            prevColorSet={currentPage === 1 ? 'gray' : 'black'}
            nextColorSet={currentPage === totalPages ? 'gray' : 'black'}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />

          {paginationRightIcon ||
            (onInvite && (
              <button onClick={onInvite} className={styles.inviteBtn}>
                <img src="/images/add_box_w.svg" alt="add" />
                초대하기
              </button>
            ))}
        </div>
      </div>

      {/* label 변경: 오너/사용자 위치에 따라 달라짐 */}
      <div className={styles.label}>이메일</div>

      <div className={styles.invitationList}>
        {currentInvitations.length > 0 ? (
          currentInvitations.map((inv) => (
            <div key={inv.id} className={styles.invitationItem}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                {/* 오너 화면: 초대한 대상 표시(invitee) */}
                {showCancel && <div className={styles.email}>{getInviteeEmail(inv)}</div>}

                {/* 초대받은 사용자: 초대한 사람 표시(inviter) */}
                {showRespond && (
                  <div className={styles.email}>
                    <span className={styles.inviter}>{getInviterName(inv)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {/* 초대받은 사용자: 수락/거절 */}
                {showRespond && (
                  <>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => handleRespond(inv.id, true)}
                    >
                      수락
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => handleRespond(inv.id, false)}
                    >
                      거절
                    </button>
                  </>
                )}

                {/* 오너: 초대 취소 */}
                {showCancel && onCancelInvitation && (
                  <DeleteButton onClick={() => handleCancel(inv.id)}>취소</DeleteButton>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>초대 내역이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default InvitationCardTable;
