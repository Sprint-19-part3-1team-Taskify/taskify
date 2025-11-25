// src/components/cardtable/MemberCardTable.jsx
'use client';

import React, { useState } from 'react';
import styles from './MemberCardTable.module.scss';
import { DeleteButton } from '../../components/button/DeleteButton/DeleteButton';
import PaginationPairButton from '../../components/button/PaginationPairButton/PaginationPairButton';

const MemberCardTable = ({
  title = '구성원',
  members = [],
  itemsPerPage = 4,
  onDeleteMember,
  onCancelInvite,
  paginationRightIcon,
  isInvited = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(members.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = members.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleAction = (memberId) => {
    if (isInvited && onCancelInvite) {
      onCancelInvite(memberId);
    } else if (onDeleteMember) {
      onDeleteMember(memberId);
    }

    if (currentMembers.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

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
            nextState={currentPage >= totalPages ? 'inactive' : 'active'}
            prevColorSet={currentPage === 1 ? 'gray' : 'black'}
            nextColorSet={currentPage >= totalPages ? 'gray' : 'black'}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />
          {paginationRightIcon && (
            <div className={styles.paginationRightIcon}>{paginationRightIcon}</div>
          )}
        </div>
      </div>

      <div className={styles.label}>이름</div>

      <div className={styles.memberList}>
        {currentMembers.length > 0 ? (
          currentMembers.map((member) => (
            <div key={member.id} className={styles.memberItem}>
              <div className={styles.memberInfo}>
                <div className={styles.avatar} style={{ backgroundColor: member.color }}>
                  {member.avatar || member.name.charAt(0)}
                </div>
                <span className={styles.memberName}>{member.name}</span>
              </div>
              <DeleteButton onClick={() => handleAction(member.id)}>
                {isInvited ? '취소' : '삭제'}
              </DeleteButton>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>멤버가 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default MemberCardTable;
