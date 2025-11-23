import Image from 'next/image';
import BaseButton from '../BaseButton/BaseButton';
import styles from './DashboardAddButton.module.scss';

export const DashboardAddButton = ({
  children = '새로운 대시보드',
  onClick,
  type = '1',
  disabled = false,
  ...props
}) => {
  return (
    <BaseButton
      className={`${styles.dashboardAddButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      <span className={styles.text}>{children}</span>

      <Image
        src="/images/common/btn_chip.svg"
        alt=""
        width={22}
        height={22}
        className={styles.icon}
      />
    </BaseButton>
  );
};
