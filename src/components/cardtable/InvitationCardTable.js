'use client';

import React, { useState } from 'react';
import styles from './InvitationCardTable.module.scss';
import PaginationPairButton from '../../components/button/PaginationPairButton/PaginationPairButton';
import { DeleteButton } from '../../components/button/DeleteButton/DeleteButton';

const InvitationCardTable = ({
  title = '초대 내역',
  invitations = [],
  itemsPerPage = 5,
  onCancelInvitation,
  onInvite, // ← 모달을 열기 위한 콜백
  isInvited = false,
  paginationRightIcon,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // 페이지네이션 계산
  const totalPages = Math.ceil(invitations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvitations = invitations.slice(startIndex, endIndex);

  // 페이지 변경 핸들러
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // 취소 버튼 클릭
  const handleCancel = (invitationId) => {
    if (onCancelInvitation) onCancelInvitation(invitationId);

    // 현재 페이지가 비어있으면 이전 페이지로 이동
    if (currentInvitations.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={styles.cardTable}>
      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.headerRight}>
          <span className={styles.pageInfo}>
            {totalPages} 페이지 중 {currentPage}
          </span>

          <PaginationPairButton
            size="small"
            prevState={currentPage === 1 ? 'inactive' : 'active'}
            nextState={currentPage >= totalPages ? 'inactive' : 'active'}
            prevColorSet={currentPage === 1 ? 'gray' : 'black'}
            nextColorSet={currentPage >= totalPages ? 'gray' : 'black'}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />

          {paginationRightIcon ? (
            <div className={styles.paginationRightIcon}>{paginationRightIcon}</div>
          ) : (
            onInvite && (
              <button onClick={onInvite} className={styles.inviteBtn}>
                <img src="/images/add_box_w.svg" alt="add" />
                초대하기
              </button>
            )
          )}
        </div>
      </div>

      {/* 이메일 라벨 */}
      <div className={styles.label}>이메일</div>

      {/* 초대 내역 리스트 */}
      <div className={styles.invitationList}>
        {currentInvitations.length > 0 ? (
          currentInvitations.map((invitation) => (
            <div key={invitation.id} className={styles.invitationItem}>
              <span className={styles.email}>{invitation.email}</span>
              {isInvited && (
                <DeleteButton onClick={() => handleCancel(invitation.id)}>취소</DeleteButton>
              )}
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
