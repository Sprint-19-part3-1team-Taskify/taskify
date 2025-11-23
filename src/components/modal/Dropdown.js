import useDropdown from '@/hook/useDropdown';
import Progress from '@/components/common/Progress';
import User from '@/components/common/User';
import styles from './Dropdown.module.scss';

export default function Dropdown({ type, label, content, onChange, initValue }) {
  const { trigger, toggle, onTrigger, onSelect } = useDropdown(initValue);
  const handleValue = (e) => {
    const selected = e.currentTarget.dataset.target;
    onSelect(e);
    onChange(selected); // 부모로 값 전달
  };

  // content 배열에 있는 값인지 확인 (실제 선택된 값인지)
  const isSelected = content.includes(trigger);

  // trigger 버튼에 표시할 내용
  const renderTriggerContent = () => {
    if (type === 'progress') {
      return <Progress value={trigger} />;
    }
    // manager: 선택된 경우만 User, 아니면 텍스트
    return isSelected ? (
      <User value={trigger} />
    ) : (
      <span className={styles.default}>{trigger}</span>
    );
  };

  return (
    <div className={`${styles.dropDownBox} ${styles[type]}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.dropDown}>
        <button className={styles.trigger} onClick={onTrigger}>
          {renderTriggerContent()}
        </button>
        {toggle && (
          <ul className={styles.list}>
            {content.length > 0 &&
              content.map((item, idx) => {
                return (
                  <li key={idx}>
                    <button
                      className={`${trigger === item ? styles.on : ''}`}
                      onClick={handleValue}
                      data-target={item}
                    >
                      {type === 'progress' ? <Progress value={item} /> : <User value={item} />}
                    </button>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}
