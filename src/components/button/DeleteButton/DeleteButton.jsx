import { BaseButton } from '..';
import styles from './DeleteButton.module.scss';

export const DeleteButton = ({ children = '삭제', onClick, type = '1', ...props }) => {
  return (
    <BaseButton
      className={`${styles.deleteButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
