'use client';

import { useState, useMemo } from 'react';
import styles from './InvitedDashboardCardTable.module.scss';

const InvitedDashboardCardTable = ({
  title = '초대받은 대시보드',
  dashboards = [],
  itemsPerPage = 5,
  onAccept,
  onReject,
  searchPlaceholder = '검색',
  emptyMessage = '아직 초대받은 대시보드가 없어요',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDashboards = useMemo(() => {
    if (!searchTerm) return dashboards;
    return dashboards.filter((d) => d.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [dashboards, searchTerm]);

  const totalPages = Math.ceil(filteredDashboards.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDashboards = filteredDashboards.slice(startIndex, endIndex);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className={styles.tableContainer}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.searchWrapper}>
        <img src="/images/Vector.svg" alt="add" />
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
            currentDashboards.map((dashboard) => (
              <tr key={dashboard.id}>
                <td className={styles.nameCell}>{dashboard.title}</td>
                <td className={styles.inviterCell}>{dashboard.inviter}</td>
                <td className={styles.actionCell}>
                  <button
                    className={styles.acceptBtn}
                    onClick={() => onAccept && onAccept(dashboard.id)}
                  >
                    수락
                  </button>
                  <button
                    className={styles.rejectBtn}
                    onClick={() => onReject && onReject(dashboard.id)}
                  >
                    거절
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className={styles.emptyState}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            이전
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitedDashboardCardTable;
