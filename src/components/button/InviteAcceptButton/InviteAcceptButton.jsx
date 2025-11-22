import { BaseButton } from '..';
import styles from './InviteAcceptButton.module.scss';

export const InviteAcceptButton = ({ children = '수락', onClick, type = '1', ...props }) => {
  return (
    <BaseButton
      className={`${styles.inviteAcceptButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
