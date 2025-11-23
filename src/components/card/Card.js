import styles from './Card.module.scss';
import TextCard from './TextCard';

export default function Card({ imageUrl, title, tags, date }) {
  if (!imageUrl) {
    return <TextCard title={title} tags={tags} date={date} />;
  }

  return (
    <div className={styles.imageCard}>
      <div className={styles.image} style={{ backgroundImage: `url(${imageUrl})` }} />
      <TextCard imageUrl={imageUrl} title={title} tags={tags} date={date} />
    </div>
  );
}
