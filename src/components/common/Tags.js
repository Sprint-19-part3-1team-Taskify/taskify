/* made by Cursor, and modified by cadst */

import Tag from './Tag';

/**
 * Tags Component
 * 태그 배열을 받아서 각각 Tag 컴포넌트로 렌더링하는 컴포넌트
 *
 * @param {Object} props
 * @param {string[]} props.tags
 *   - 렌더링할 태그 문자열 배열 (예: ['태그 1', '태그 2'])
 *
 * @param {Function} [props.onClick]
 *   - 태그 클릭 시 실행될 이벤트 핸들러
 *
 * @returns {JSX.Element} Tags Component
 *
 * @example
 * <Tags tags={['태그 1', '태그 2', '태그 3']} />
 */
export default function Tags({ tags = [], onClick, disabled }) {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <>
      {tags.map((tag, index) => {
        // 인덱스 기반으로 c1, c2, c3, c4 순환
        // 0번째: c1, 1번째: c2, 2번째: c3, 3번째: c4, 4번째: c1, ...
        const colorClass = `c${(index % 4) + 1}`;

        return (
          <Tag
            key={index}
            // key는 React가 리스트 렌더링을 관리하기 위한 것
            className={colorClass}
            disabled={disabled}
            onClick={onClick ? (e) => onClick(e, tag, index) : undefined}
          >
            {tag}
          </Tag>
        );
      })}
    </>
  );
}
