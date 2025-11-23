import { useState } from 'react';
import Image from 'next/image';
import styles from './styles/user-menu.module.scss';

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    alert('로그아웃 실행');
  };

  return (
    <div className={styles.userMenu}>
      <button className={styles.userButton} onClick={() => setOpen((prev) => !prev)}>
        <Image
          src="/images/profile.png"
          width={32}
          height={32}
          alt="User Profile"
          className={styles.avatar}
        />
        <span className={styles.username}>Soda</span>
        <span className={styles.arrow}>▼</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          <button className={styles.item}>My Page</button>
          <button className={styles.item}>Settings</button>
          <button className={styles.item} onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
