import { BaseButton } from '..';
import styles from './InputSubmitButton.module.scss';

export const InputSubmitButton = ({ children = '입력', onClick, type = '1', ...props }) => {
  return (
    <BaseButton
      className={`${styles.inputSubmitButton} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </BaseButton>
  );
};
