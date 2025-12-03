import React from 'react';
import styles from './EmptyInvitedDashboard.module.scss';

export default function EmptyInvitedDashboard({ icon }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>초대받은 대시보드</h2>

      <div className={styles.emptyArea}>
        <div className={styles.icon}>{icon}</div>
        <img src="/images/empty.svg" alt="empty" />
        <p className={styles.description}>아직 초대받은 대시보드가 없어요</p>
      </div>
    </div>
  );
}
