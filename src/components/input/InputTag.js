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
 * @param {Function} [props.setTags]
 *   - (deprecated) 태그 목록을 업데이트하는 setState 함수
 *   - (tags: string[]) => void
 *
 * @param {Function} [props.onAddTag]
 *   - 태그를 추가하는 콜백 함수
 *   - (newTag: string) => void
 *
 * @param {Function} [props.onRemoveTag]
 *   - 태그를 삭제하는 콜백 함수
 *   - (tagToRemove: string) => void
 *
 * @param {string} [props.label]
 *   - 라벨 텍스트 (기본값: '태그')
 *
 * @returns {JSX.Element} InputTag Component
 *
 * @example
 * // 새로운 사용법 (권장)
 * <InputTag tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
 *
 * // 기존 사용법 (호환)
 * const [tags, setTags] = useState([]);
 * <InputTag tags={tags} setTags={setTags} />
 */

export default function InputTag({ tags = [], setTags, onAddTag, onRemoveTag, label = '태그' }) {
  const [value, setValue] = useState({ tag: '' });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setValue({
      tag: value,
    });
  };

  const handleCreateTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();

      // 중복 실행 방지
      if (isProcessing) return;
      if (!value.tag.trim()) return;

      setIsProcessing(true);

      const trimmedTag = value.tag.trim();

      // 중복 태그 체크
      if (tags.includes(trimmedTag)) {
        setIsProcessing(false);
        return;
      }

      // onAddTag 우선, 없으면 setTags 사용 (호환)
      if (onAddTag) {
        onAddTag(trimmedTag);
      } else if (setTags) {
        setTags((prev) => [...prev, trimmedTag]);
      }

      setValue({ tag: '' });

      // 다음 이벤트를 위해 약간의 지연 후 플래그 해제
      setTimeout(() => {
        setIsProcessing(false);
      }, 100);
    } else if (e.key === 'Backspace') {
      if (value.tag.trim() === '') {
        if (tags.length > 0) {
          const lastTag = tags[tags.length - 1];
          if (onRemoveTag) {
            onRemoveTag(lastTag);
          } else if (setTags) {
            const newTags = [...tags];
            newTags.pop();
            setTags([...newTags]);
          }
        }
      }
    }
  };
  return (
    <div className={styles.iptBox}>
      <label htmlFor="inputTag" className={styles.label}>
        {label}
      </label>
      <div className={styles.iptTagWrap}>
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
      {tags.length > 0 && (
        <div className={styles.tagList}>
          {tags.map((item, index) => {
            const handleRemove = () => {
              if (onRemoveTag) {
                onRemoveTag(item);
              } else if (setTags) {
                setTags((prev) => prev.filter((t) => t !== item));
              }
            };
            return (
              <Tag key={index} index={index} onClick={handleRemove}>
                {item}
              </Tag>
            );
          })}
        </div>
      )}
    </div>
  );
}
