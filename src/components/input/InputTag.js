import { useState } from 'react';
import Tag from '@/components/common/Tag';
import styles from './InputTag.module.scss';

/**
 * InputTag Component
 * 태그를 생성하고 관리할 수 있는 입력 컴포넌트
 * Enter 키로 태그를 추가할 수 있습니다.
 *
 * @param {Array<string>} props.tags
 *   - 현재 생성된 태그 목록 (문자열 배열)
 *   - 예: ['디자인', '개발', '리액트']
 *
 * @param {Function} props.setTags
 *   - 태그 목록을 업데이트하는 setState 함수
 *   - (tags: string[]) => void
 *
 * @returns {JSX.Element} InputTag Component
 *
 * @example
 * // 기본 사용법
 * const [tags, setTags] = useState([]);
 * <InputTag tags={tags} setTags={setTags} />
 */

export default function InputTag({ tags, setTags }) {
  const [value, setValue] = useState({ tag: '' });
  const handleChange = (e) => {
    const value = e.target.value;
    setValue({
      tag: value,
    });
  };
  const handleCreateTag = (e) => {
    if (e.key === 'Enter') {
      if (value.tag.trim()) {
        setTags((prev) => [...prev, value.tag]);
        setValue({ tag: '' });
      }
    } else if (e.key === 'Backspace') {
      if (value.tag.trim() === '') {
        const newTags = [...tags];
        newTags.pop();
        setTags([...newTags]);
      }
    }
  };
  return (
    <div className={styles.iptBox}>
      <label htmlFor="inputTag" className={styles.label}>
        태그
      </label>
      <div className={styles.iptTagWrap}>
        {tags.length > 0 &&
          tags.map((item, index) => {
            return (
              <Tag key={index} index={index}>
                {item}
              </Tag>
            );
          })}
        <input
          type="text"
          id="inputTag"
          name="tag"
          value={value.tag}
          placeholder="입력 후 Enter"
          onChange={handleChange}
          onKeyDown={handleCreateTag}
        />
      </div>
    </div>
  );
}
