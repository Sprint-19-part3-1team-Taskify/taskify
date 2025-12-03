import styles from './Color.module.scss';
/**
 * Color Component
 * 색상을 선택할 수 있는 라디오 버튼 컴포넌트
 *
 * @param {string} props.color - 색상 스타일 클래스명 ("green", "purple", "orange", "blue", "pink")
 * @param {string} props.name - 라디오 버튼 그룹명 (같은 그룹은 하나만 선택 가능)
 * @param {string} props.value - 이 칩의 색상 값 (예: "#7ac555")
 * @param {Function} props.onChange - 선택 시 실행되는 콜백 함수 (value: string) => void
 * @param {string} props.selected - 현재 선택된 색상 값 (value === selected 일 때 체크됨)
 *
 */

export default function Color({ color, name, value, onChange, selected }) {
  return (
    <label className={`${styles.Color} ${styles[color]}`}>
      <input
        type="radio"
        id={color}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        checked={value === selected}
      />
      <span></span>
    </label>
  );
}
