import PaginationButton from '../PaginationButton/PaginationButton';
import styles from './PaginationPairButton.module.scss';

export default function PaginationPairButton({
  size = 'large',
  prevColorSet = 'black', // prev 버튼 색상
  nextColorSet = 'black', // next 버튼 색상
  onPrev,
  onNext,
}) {
  return (
    <div className={styles.wrapper}>
      <PaginationButton direction="prev" colorSet={prevColorSet} size={size} onClick={onPrev} />

      <PaginationButton direction="next" colorSet={nextColorSet} size={size} onClick={onNext} />
    </div>
  );
}
