import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './nav-tabs-top.module.scss';

const tabs = [{ name: '내 대시보드', path: '/my-dashboard' }];

const NavTabsTop = () => {
  const pathname = useRouter().pathname;

  return (
    <nav className={styles.navTabsTop}>
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          href={tab.path}
          className={`${styles.tab} ${pathname === tab.path ? styles.active : ''}`}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
};

export default NavTabsTop;
