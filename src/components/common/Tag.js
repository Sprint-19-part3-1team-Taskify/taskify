import styles from './Tag.module.scss';

/**
 * Tag Component
 * 태그를 표시하는 컴포넌트
 * ID 기반으로 일관된 색상을 자동 할당합니다.
 *
 * @param {React.ReactNode} props.children
 *   - 태그에 표시될 텍스트 또는 요소
 *
 * @param {number} props.index
 *   - 태그의 고유 ID (색상 결정에 사용)
 *   - 4개 색상이 반복됩니다.
 *
 * @returns {JSX.Element} Tag Component
 *
 * @example
 * // 태그 목록 렌더링
 * {tags.map((item, index) => (
 *   <Tag key={index} index={index}>
 *     {item}
 *   </Tag>
 * ))}
 *
 * @example
 * // 단일 태그
 * <Tag index={1}>디자인</Tag>
 */

export default function Tag({ children, index }) {
  const colorIndex = index % 4;
  return <span className={`${styles.tag} ${styles[`c${colorIndex}`]}`}>{children}</span>;
}
