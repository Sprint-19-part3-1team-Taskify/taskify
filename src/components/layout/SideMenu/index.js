'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SideMenu.module.scss';
import DashboardLink from '@/components/layout/SideMenu/DashboardLink';
import { useParams, usePathname } from 'next/navigation';

const menu = [
  { href: '/mydashboard/1', name: '비브리지', color: 'green', owner: true },
  { href: '/mydashboard/2', name: '코드잇', color: 'purple' },
  { href: '/mydashboard/3', name: '3분기 계획', color: 'orange', owner: true },
  { href: '/mydashboard/4', name: '회의록', color: 'blue' },
  { href: '/mydashboard/5', name: '중요 문서함', color: 'pink' },
];

export default function SideMenu() {
  const params = usePathname();
  return (
    <section className={styles.sideMenu}>
      <Link href="/" className={styles.logo}>
        <Image src="/images/logo.svg" width={109} height={33} alt="Taskify" priority />
      </Link>
      <nav className={styles.nav}>
        <h1 className={styles.title}>Dash Boards</h1>
        <button className={styles.btnCreate}>
          <span className="blind">대시보드 생성</span>
        </button>
        <ul className={styles.navList}>
          {menu.map((item) => (
            <li key={item.href}>
              <DashboardLink
                href={item.href}
                name={item.name}
                color={item.color}
                owner={item.owner}
                active={item.href === params}
              />
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
