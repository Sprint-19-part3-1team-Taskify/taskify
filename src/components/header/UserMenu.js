import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/context/authProvider';
import User from '@/components/common/User';
import styles from './UserMenu.module.scss';

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className={styles.userMenu}>
      <button className={styles.userButton} onClick={() => setOpen((prev) => !prev)}>
        <User value={user?.nickname} profileImageUrl={user?.profileImageUrl} type="large" />
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button className={styles.item} onClick={handleLogout}>
            로그아웃
          </button>
          <Link href="/mypage" className={styles.item}>
            내 정보
          </Link>
          <Link href="/mydashboard" className={styles.item}>
            내 대시보드
          </Link>
        </div>
      )}
    </div>
  );
}
