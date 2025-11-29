'use client';

import { useState, useMemo } from 'react';
import styles from './InvitedDashboardCardTable.module.scss';

const InvitedDashboardCardTable = ({
  title = '초대받은 대시보드',
  dashboards = [],
  itemsPerPage = 6,
  onAccept,
  onReject,
  searchPlaceholder = '검색',
  emptyMessage = '아직 초대받은 대시보드가 없어요',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // 안전하게 title, inviter 파싱
  const normalizeTitle = (item) =>
    item.dashboard?.title || item.title || item.name || '(제목 없음)';

  const normalizeInviter = (item) => {
    // DashboardProvider에서 정규화된 데이터 우선
    if (item.inviterName) return item.inviterName;
    if (item.inviterEmail) return item.inviterEmail;

    // fallback
    return '정보 없음';
  };

  // 검색
  const filteredDashboards = useMemo(() => {
    if (!searchTerm) return dashboards;

    return dashboards.filter((d) =>
      normalizeTitle(d).toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [dashboards, searchTerm]);

  const totalPages = Math.ceil(filteredDashboards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDashboards = filteredDashboards.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.searchWrapper}>
        <img src="/images/Vector.svg" alt="search" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>이름</th>
            <th>초대자</th>
            <th>수락 여부</th>
          </tr>
        </thead>

        <tbody>
          {currentDashboards.length > 0 ? (
            currentDashboards.map((item) => {
              const title = normalizeTitle(item);
              const inviter = normalizeInviter(item);

              return (
                <tr key={item.id}>
                  <td className={styles.nameCell}>{title}</td>
                  <td className={styles.inviterCell}>{inviter}</td>
                  <td className={styles.actionCell}>
                    <button
                      className={styles.acceptBtn}
                      onClick={() => onAccept && onAccept(item.id)}
                    >
                      수락
                    </button>
                    <button
                      className={styles.rejectBtn}
                      onClick={() => onReject && onReject(item.id)}
                    >
                      거절
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="3" className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            이전
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitedDashboardCardTable; // ⭐ 이게 핵심!
