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
        return (
          <Tag key={index} index={index}>
            {tag}
          </Tag>
        );
      })}
    </>
  );
}
