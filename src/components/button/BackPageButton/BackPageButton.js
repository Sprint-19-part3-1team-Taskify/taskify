

import { useRouter } from 'next/router';
import styles from './BackPageButton.module.scss';
export default function BackPageButton () {
  const router = useRouter();
  return (
    <div className={styles.backPage}>
      <button className={styles.btn} onClick={() => {router.back()}}>돌아가기</button>
    </div>
  )
}