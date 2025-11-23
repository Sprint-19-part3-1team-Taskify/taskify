/**
 * Tag Component
 * 클릭 가능한 태그를 표시하는 컴포넌트 (주로 삭제용으로 사용)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 *   - 태그에 표시될 텍스트 또는 요소
 *
 * @param {string} [props.className]
 *   - 태그의 색상 클래스 (예: c0, c1, c2, c3)
 *
 * @param {Function} [props.onClick]
 *   - 태그 클릭 시 실행될 이벤트 핸들러 (주로 삭제 동작)
 *
 * @param {boolean} [props.disabled=false]
 *   - 태그 비활성화 여부
 *
 * @returns {JSX.Element} Tag Component
 *
 * @example
 * // 태그 목록 렌더링 (삭제 가능)
 * {tags.map((tag) => (
 *   <Tag
 *     key={tag.id}
 *     className={tag.colorClass}
 *     onClick={(e) => handleDeleteTag(e, tag)}
 *   >
 *     {tag.txt}
 *   </Tag>
 * ))}
 */

export default function Tag({ children, className, onClick, disabled }) {
  const handleDelete = (e) => {
    onClick(e);
  };
  return (
    <button className={`tag ${className}`} onClick={handleDelete} disabled={disabled}>
      {children}
    </button>
  );
}
