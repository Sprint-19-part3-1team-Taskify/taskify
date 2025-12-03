import styles from './Tag.module.scss';

/**
 * Tag Component
 * 태그를 표시하는 컴포넌트
 * 태그 텍스트 기반으로 랜덤(일관된) 색상을 자동 할당합니다.
 *
 * @param {React.ReactNode} props.children
 *   - 태그에 표시될 텍스트 또는 요소
 *
 * @param {number} props.index
 *   - (옵션) 태그의 고유 ID - 미사용시 children 기반으로 색상 결정
 *
 * @returns {JSX.Element} Tag Component
 *
 * @example
 * // 태그 목록 렌더링 (텍스트 기반 랜덤 색상)
 * {tags.map((item, index) => (
 *   <Tag key={index}>
 *     {item}
 *   </Tag>
 * ))}
 *
 * @example
 * // 단일 태그
 * <Tag>디자인</Tag>
 */

// 문자열을 숫자로 변환하는 해시 함수 (같은 문자열은 항상 같은 숫자)
function stringToHash(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export default function Tag({ children, index, onClick }) {
  // children 텍스트 기반으로 해시 생성 → 같은 태그명은 항상 같은 색상
  const tagText = typeof children === 'string' ? children : String(children);
  const colorIndex = stringToHash(tagText) % 4;

  return (
    <span
      className={`${styles.tag} ${styles[`c${colorIndex}`]}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </span>
  );
}
