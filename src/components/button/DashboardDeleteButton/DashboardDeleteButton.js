import BaseButton from '../basebutton/BaseButton';
import styles from './DashboardDeleteButton.module.scss';

export const DashboardDeleteButton = ({
  children = '대시보드 삭제하기',
  onClick,
  type = '1',
  ...props
}) => {
  return (
    <BaseButton
      className={`${styles.dashboardDeleteButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
