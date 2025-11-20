import Link from 'next/link';
import Image from 'next/image';
import DashboardLink from '@/components/dashboard/DashboardLink';

export default function SideMenu() {
  return (
    <section className="sideMenu">
      <Link href="/" className="logo">
        <Image src="/images/logo.svg" width={109} height={33} alt="Taskify" priority />
      </Link>
      <nav className="nav">
        <h1 className="title">Dash Boards</h1>
        <button className="btnCreate">
          <span className="blind">대시보드 생성</span>
        </button>
        <ul>
          <li>
            <DashboardLink href="/" name="비브리지" color="green" onwer />
          </li>
          <li>
            <DashboardLink href="/" name="코드잇" color="purple" />
          </li>
          <li>
            <DashboardLink href="/" name="3분기 계획" color="orange" onwer />
          </li>
          <li>
            <DashboardLink href="/" name="회의록" color="blue" />
          </li>
          <li>
            <DashboardLink href="/" name="중요 문서함" color="pink" />
          </li>
        </ul>
      </nav>
    </section>
  );
}
