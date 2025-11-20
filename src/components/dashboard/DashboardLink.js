import Link from 'next/link';

export default function DashboardLink({ href, name, color, onwer }) {
  return (
    <Link href={href} className={`dashboardLink ${color} ${onwer && 'onwer'}`}>
      <span>{name}</span>
    </Link>
  );
}
