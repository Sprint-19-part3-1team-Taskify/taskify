import BaseButton from '../BaseButton/BaseButton';
import styles from './DashboardButton.module.scss';

export function DashboardButton({
  size = 'large',
  icon, // 왕관(ico_crown)
  arrow, // 오른쪽 화살표
  children, // "비브리지"
  ...props
}) {
  return (
    <BaseButton className={`${styles.dashboardButton} ${styles[size]}`} {...props}>
      <div className={styles.content}>
        {/* indicator (초록 동그라미) */}
        <span className={styles.indicator}></span>

        {/* text */}
        <span className={styles.text}>{children}</span>

        {/* icon (왕관) */}
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      {/* arrow (>) */}
      {arrow && <span className={styles.arrow}>{arrow}</span>}
    </BaseButton>
  );
}
