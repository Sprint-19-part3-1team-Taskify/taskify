import Image from 'next/image';
import styles from './ImageCard.module.scss';
import TextCard from './TextCard';

export default function ImageCard({ imageUrl, title, tags, date }) {
  return (
    <div className={styles.imageCard}>
      {imageUrl && <div className={styles.image} style={{ backgroundImage: `url(${imageUrl})` }} />}
      <TextCard imageUrl={!!imageUrl} title={title} tags={tags} date={date} />
    </div>
  );
}
