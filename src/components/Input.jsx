import { useState } from 'react';

// datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
