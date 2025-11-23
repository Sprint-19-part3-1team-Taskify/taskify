import { BaseButton } from '..';
import styles from './InviteRejectButton.module.scss';

export const InviteRejectButton = ({ children = '거절', onClick, type = '1', ...props }) => {
  return (
    <BaseButton
      className={`${styles.inviteRejectButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
