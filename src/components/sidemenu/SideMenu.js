'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './SideMenu.module.scss';
import DashboardLink from '@/components/sidemenu/DashboardLink';
import { usePathname } from 'next/navigation';

/**
 * SideMenu Component
 * 애플리케이션의 좌측 메뉴 영역을 구성하는 컴포넌트입니다.
 * 로고, 대시보드 생성 버튼, 대시보드 목록을 포함합니다.
 *
 * @component
 * @returns {JSX.Element} SideMenu Component
 *
 * @example
 * // dashboard 레이아웃에서 사용됩니다.
 * <SideMenu />
 **/

// 임시데이터
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
