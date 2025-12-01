import React, { useState } from 'react';
import styles from './MemberCardTable.module.scss';
import PaginationPairButton from '../button/paginationpairbutton/PaginationPairButton';
import { DeleteButton } from '../button/deletebutton/DeleteButton';
import User from '@/components/common/User';

const MemberCardTable = ({
  title = '구성원',
  members = [],
  itemsPerPage = 4,
  onDeleteMember,
  onCancelInvite, // 경우에 따라 초대 취소(초대 상태 항목)용
  paginationRightIcon,
  showDelete = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(members.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMembers = members.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);

  const handleAction = (memberId) => {
    if (onCancelInvite) onCancelInvite(memberId);
    else if (onDeleteMember) onDeleteMember(memberId);

    if (currentMembers.length === 1 && currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const safeName = (m) => m?.nickname || m?.name || m?.email || '이름 없음';
  // 기존 아바타 문자 로직은 User 컴포넌트로 대체

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
                <User value={safeName(member)} type="medium" hiddenName={true} />

                <div>
                  <div className={styles.memberName}>{safeName(member)}</div>
                  {member?.email && <div className={styles.memberEmail}>{member.email}</div>}
                </div>
              </div>

              {showDelete && (
                <DeleteButton onClick={() => handleAction(member.id)}>삭제</DeleteButton>
              )}
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
