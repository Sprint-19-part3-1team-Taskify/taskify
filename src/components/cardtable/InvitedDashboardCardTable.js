import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './InvitedDashboardCardTable.module.scss';

const InvitedDashboardCardTable = ({
  title = '초대받은 대시보드',
  dashboards = [],
  onAccept,
  onReject,
  onLoadMore,
  hasMore,
  loading,
  searchPlaceholder = '검색',
  emptyMessage = '아직 초대받은 대시보드가 없어요',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const observerTarget = useRef(null);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 무한 스크롤
  useEffect(() => {
    if (!onLoadMore || hasMore === false) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [onLoadMore, hasMore, loading]);

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
          {filteredDashboards.length > 0 ? (
            filteredDashboards.map((item) => {
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

      {/* 무한 스크롤 트리거 */}
      {hasMore && <div ref={observerTarget} style={{ height: '20px' }} />}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#787486' }}>로딩 중...</div>
      )}
    </div>
  );
};

export default InvitedDashboardCardTable; // ⭐ 이게 핵심!
