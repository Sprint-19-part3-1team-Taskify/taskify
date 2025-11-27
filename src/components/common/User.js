import styles from './User.module.scss';

/**
 * User Component
 * 사용자 이름의 첫 글자를 아바타로 표시하는 컴포넌트
 * 이름 기반으로 일관된 배경색을 자동 할당합니다.
 *
 * @param {string} props.value
 *   - 사용자 이름
 *   - 첫 글자가 아바타로 표시되며, 이름 기반으로 색상이 결정됩니다
 *
 * @param {string} [props.type]
 *   - 사용자 컴포넌트의 스타일 타입
 *   - SCSS 모듈의 클래스명과 매칭됩니다
 *   - 예: 'large, medium, comment'
 *
 * @param {boolean} [props.hiddenName=false]
 *   - true: 첫 글자 아바타만 표시
 *   - false: 첫 글자 아바타 + 전체 이름 표시
 *
 * @returns {JSX.Element} User Component
 *
 * @example
 * // 기본 사용법
 * <User value="홍길동" />
 * // 아바타만 표시
 * <User value="김철수" hiddenName={true} />
 * // 타입 지정
 * <User value="이영희" type="medium" />
 *
 */

const colors = ['#FFC85A', '#FDD446', '#9DD7ED', '#C4B1A2', '#F4D7DA', '#A3C4A2'];
export default function User({ value, type, hiddenName }) {

  if (!value)  return null; 

  const first = value.slice(0, 1);
  const colorIndex = value.charCodeAt(0) % colors.length;

  return (
    <div className={`${styles.user} ${styles[type]}`}>
      <span className={styles.first} style={{ backgroundColor: colors[colorIndex] }}>
        {first}
      </span>
      {!hiddenName && <span className={styles.name}>{value}</span>}
    </div>
  );
}
