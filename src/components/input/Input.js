import { useState } from 'react';

// datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

/**
 * Input Component
 * 다양한 타입의 입력 필드를 제공하는 컴포넌트
 *
 * @param {"text" | "email" | "password" | "date" | "search"} [props.type="text"]
 *   - text: 기본 텍스트 입력
 *   - email: 이메일 입력
 *   - password: 비밀번호 입력 (표시/숨김 토글 버튼 포함)
 *   - date: 날짜 선택 (DatePicker 사용)
 *   - search: 검색 입력
 *
 * @param {string} [props.label]
 *   - 입력 필드 상단에 표시되는 레이블
 *
 * @param {string} props.id
 *   - 입력 필드의 고유 ID (label의 htmlFor와 연결)
 *
 * @param {string} [props.error]
 *   - 에러 메시지 (존재시 입력 필드에 error 스타일 적용)
 *
 * @param {boolean} [props.required=false]
 *   - 필수 입력 여부 (true시 레이블에 required 클래스 추가)
 *
 * @param {Date} [props.startDate]
 *   - type="date"일 때 사용되는 선택된 날짜 값
 *
 * @param {string} [props.value]
 *   - 입력 필드의 현재 값
 *
 * @param {Function} props.onChange
 *   - type="date": (date) => void - 선택된 날짜를 파라미터로 받음
 *   - 그 외: (event) => void - 표준 input onChange 이벤트
 *
 * @param {Object} [props.rest]
 *   - 그 외 input 요소에 전달될 추가 속성들 (placeholder, name, onKeyDown 등)
 *
 * @returns {JSX.Element} Input Component
 *
 * @example
 * // 기본 텍스트/이메일/비밀번호 입력
 * <Input
 *   label="제목"
 *   type="text"
 *   id="title"
 *   name="title"
 *   placeholder="제목을 입력해주세요"
 *   onChange={handleChange}
 *   value={value.title}
 *   required
 * />
 */

export default function Input({
  type = 'text',
  label,
  id,
  error,
  required,
  startDate,
  value,
  onChange,
  ...rest
}) {
  const [pwToggle, setPwToggle] = useState(false);
  const [pwType, setPwType] = useState('password');

  // 비밀번호 숨김/표시
  const handlePassword = () => {
    setPwToggle(!pwToggle);
    setPwType((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  return (
    <div className="iptBox">
      {label && (
        <label htmlFor={id} className={required ? 'required' : ''}>
          {label}
        </label>
      )}
      <div
        className={`ipt${error ? ' error' : ''}${type === 'date' ? ' date' : ''}${type === 'search' ? ' search' : ''}`}
      >
        {type === 'date' ? (
          <DatePicker
            selected={startDate}
            onChange={onChange}
            placeholderText="날짜를 선택해 주세요"
            dateFormat="yyyy. MM. dd. HH:mm"
            popperPlacement="bottom-start"
            id="date"
            autoComplete="off"
            showTimeSelect
          />
        ) : (
          <input
            type={type === 'password' ? pwType : type}
            id={id}
            onChange={onChange}
            value={value}
            required={required}
            {...rest}
          />
        )}
        {type === 'password' && (
          <button className={`btnPwToggle ${pwToggle ? '' : 'on'}`} onClick={handlePassword}>
            <span className="blind">비밀번호 숨김</span>
          </button>
        )}
      </div>
      {error && <div className="errorMsg">{error}</div>}
    </div>
  );
}
