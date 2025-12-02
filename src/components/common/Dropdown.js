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

  // content가 객체 배열인지 문자열 배열인지 확인
  const isObjectArray = list.length > 0 && typeof list[0] === 'object' && list[0] !== null;

  // 객체 배열인 경우 nickname 또는 email을 키로 사용
  const getItemKey = (item) => {
    if (isObjectArray) {
      return item?.nickname || item?.email || item?.value || String(item);
    }
    return String(item);
  };

  // 객체 배열인 경우 display value 추출
  const getDisplayValue = (item) => {
    if (isObjectArray) {
      return item?.nickname || item?.email || item?.value || '';
    }
    return String(item);
  };

  // 객체 배열인 경우 profileImageUrl 추출
  const getProfileImageUrl = (item) => {
    if (isObjectArray) {
      return item?.profileImageUrl || null;
    }
    return null;
  };

  const handleValue = (e) => {
    const selected = e.currentTarget.dataset.target;
    onSelect(e);
    onChange?.(selected); // 부모로 값 전달 (옵셔널)
  };

  // trigger와 일치하는 항목 찾기
  const selectedItem = isObjectArray
    ? list.find((item) => getItemKey(item) === trigger)
    : list.find((item) => String(item) === trigger);

  const isSelected = !!selectedItem;
  const displayValue = isSelected ? getDisplayValue(selectedItem) : trigger || placeholder || '';

  const renderTriggerContent = () => {
    if (type === 'progress') return <Progress value={displayValue} />;
    return isSelected ? (
      <User value={displayValue} profileImageUrl={getProfileImageUrl(selectedItem)} />
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
            {list.map((item, idx) => {
              const itemKey = getItemKey(item);
              const itemDisplayValue = getDisplayValue(item);
              const itemProfileImageUrl = getProfileImageUrl(item);

              return (
                <li key={idx}>
                  <button
                    type="button"
                    className={`${trigger === itemKey ? styles.on : ''}`}
                    onClick={handleValue}
                    data-target={itemKey}
                  >
                    {type === 'progress' ? (
                      <Progress value={itemDisplayValue} />
                    ) : (
                      <User value={itemDisplayValue} profileImageUrl={itemProfileImageUrl} />
                    )}
                  </button>
                </li>
              );
            })}
            {list.length === 0 && <li className={styles.empty}>데이터 없음</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
