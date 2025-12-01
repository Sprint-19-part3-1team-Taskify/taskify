import BaseButton from '../basebutton/BaseButton';
import styles from './DashboardButton.module.scss';

export function DashboardButton({
  size = 'large',
  icon,
  arrow,
  children,
  color, // 🔥 color props 추가
  ...props
}) {
  return (
    <BaseButton className={`${styles.dashboardButton} ${styles[size]}`} {...props}>
      <div className={styles.content}>
        {/* indicator */}
        <span
          className={styles.indicator}
          style={{ backgroundColor: color }} // 🔥 여기서 색상 적용
        ></span>

        <span className={styles.text}>{children}</span>

        {icon && <span className={styles.icon}>{icon}</span>}
      </div>

      {arrow && <span className={styles.arrow}>{arrow}</span>}
    </BaseButton>
  );
}
