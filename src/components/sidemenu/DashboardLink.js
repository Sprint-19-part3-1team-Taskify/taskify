import Link from 'next/link';
import styles from './DashboardLink.module.scss';
/**
 * Dashboard Link Component
 *
 * 대시보드 목록에서 사용되는 링크 컴포넌트입니다.
 * 색상, 소유자 여부, 활성화 상태에 따라 다른 스타일이 적용됩니다.
 *
 * @param {string} props.href - 링크 URL (예: "/mydashboard/123")
 * @param {string} props.name - 대시보드 이름
 * @param {string} [props.color] - 대시보드 색상 테마 (styles에 정의된 색상 클래스명)
 * @param {boolean} [props.owner] - 소유자 여부 (true일 경우 소유자 스타일 적용)
 * @param {boolean} [props.active] - 현재 활성화된 대시보드 여부 (true일 경우 활성 스타일 적용)
 *
 * @returns {JSX.Element} Dashboard Link Component
 *
 * @example
 * <DashboardLink
 *   href="/mydashboard/1"
 *   name="프로젝트 A"
 * />
 */
export default function DashboardLink({ href, name, color, owner, active }) {
  color = color.slice(1, 7);
  return (
    <Link
      href={href}
      className={[
        styles.dashboardLink,
        color ? styles[`color${color}`] : '',
        owner ? styles.owner : '',
        active ? styles.active : '',
      ].join(' ')}
    >
      <span>{name}</span>
    </Link>
  );
}
