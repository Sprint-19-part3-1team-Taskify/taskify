import Link from 'next/link';
import styles from './DashboardLink.module.scss';

export default function DashboardLink({ href, name, color, owner, active }) {
  return (
    <Link
      href={href}
      className={[
        styles.dashboardLink,
        color ? styles[color] : '',
        owner ? styles.owner : '',
        active ? styles.active : '',
      ].join(' ')}
    >
      <span>{name}</span>
    </Link>
  );
}
