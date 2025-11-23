import styles from './Progress.module.scss';

export default function Progress({ value }) {
  return (
    <div className={styles.progress}>
      <span className={styles.state}>{value}</span>
    </div>
  );
}
