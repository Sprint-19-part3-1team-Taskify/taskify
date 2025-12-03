import Image from 'next/image';
import styles from './PaginationButton.module.scss';
import { BaseButton } from '..';

export default function PaginationButton({
  direction = 'prev',
  colorSet = 'gray', // black | gray
  state = 'inactive', // active | inactive
  size = 'large',
  ...props
}) {
  const iconSrc =
    direction === 'prev'
      ? '/images/common/btn_chevron_left.svg'
      : '/images/common/btn_chevron_right.svg';

  return (
    <BaseButton className={`${styles.button} ${styles[size]} ${styles[state]}`} {...props}>
      <Image
        src={iconSrc}
        alt=""
        width={20}
        height={20}
        className={`${styles.icon} ${styles[colorSet]}`}
      />
    </BaseButton>
  );
}
