import Image from 'next/image';
import styles from './AddColumnButton.module.scss';
import { BaseButton } from '..';

export function AddColumnButton({ children, onClick, type = '1', ...props }) {
  return (
    <BaseButton
      className={`${styles.addColumn} ${styles[`type${type}`]}`}
      onClick={onClick}
      {...props}
    >
      {children && <span className={styles.text}>{children}</span>}

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
