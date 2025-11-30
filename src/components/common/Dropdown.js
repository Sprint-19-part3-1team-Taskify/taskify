import useDropdown from '@/hook/useDropdown';
import Progress from '@/components/common/Progress';
import User from '@/components/common/User';
import styles from './Dropdown.module.scss';

/**
 * Dropdown Component
 * - 안전하게 content(undefined/null) 처리
 * - progress / 기본(User) 타입 렌더링
 * - initValue가 비어 있고 placeholder 제공 시 placeholder 표시
 */
export default function Dropdown({ type, label, content, onChange, initValue = '', placeholder }) {
  const list = Array.isArray(content) ? content : [];
  const { trigger, toggle, onTrigger, onSelect } = useDropdown(initValue);

  const handleValue = (e) => {
    const selected = e.currentTarget.dataset.target;
    onSelect(e);
    onChange?.(selected); // 부모로 값 전달 (옵셔널)
  };

  const isSelected = trigger && list.includes(trigger);
  const displayValue = trigger || placeholder || '';

  const renderTriggerContent = () => {
    if (type === 'progress') return <Progress value={displayValue} />;
    return isSelected ? (
      <User value={displayValue} />
    ) : (
      <span className={styles.default}>{displayValue}</span>
    );
  };

  return (
    <div className={`${styles.dropDownBox} ${styles[type]}`}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.dropDown}>
        <button className={styles.trigger} type="button" onClick={onTrigger}>
          {renderTriggerContent()}
        </button>
        {toggle && (
          <ul className={styles.list}>
            {list.map((item, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  className={`${trigger === item ? styles.on : ''}`}
                  onClick={handleValue}
                  data-target={item}
                >
                  {type === 'progress' ? <Progress value={item} /> : <User value={item} />}
                </button>
              </li>
            ))}
            {list.length === 0 && <li className={styles.empty}>데이터 없음</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
