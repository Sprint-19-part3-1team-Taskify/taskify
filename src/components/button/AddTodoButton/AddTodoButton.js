import Image from 'next/image';
import styles from './AddTodoButton.module.scss';
import { BaseButton } from '..';

export function AddTodoButton({ onClick, type = '1', ...props }) {
  return (
    <BaseButton
      className={`${styles.addTodo} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      <Image
        src="/images/common/btn_chip.svg"
        alt=""
        width={22}
        height={22}
        className={styles.icon}
      />
    </BaseButton>
  );
}
