/**
 * Textarea Component
 * 여러 줄 텍스트 입력을 제공하는 컴포넌트
 *
 * @param {Object} props
 * @param {string} props.label
 *   - textarea 상단에 표시되는 레이블
 *
 * @param {string} props.id
 *   - textarea의 고유 ID (label의 htmlFor와 연결)
 *
 * @param {boolean} [props.required=false]
 *   - 필수 입력 여부 (true시 레이블에 required 클래스 추가)
 *
 * @param {Function} [props.onClick]
 *   - 입력 버튼 클릭 이벤트 핸들러
 *   - 존재시: 입력 버튼이 표시되고 기본 크기로 렌더링
 *   - 미존재시: 입력 버튼 없이 큰 크기(lg)로 렌더링
 *
 * @param {Object} [props.rest]
 *   - 그 외 textarea 요소에 전달될 추가 속성들 (name, value, onChange, placeholder 등)
 *
 * @returns {JSX.Element} Textarea Component
 *
 * @example
 * // 입력 버튼이 있는 댓글 작성
 * <Textarea
 *   label="댓글"
 *   id="comment"
 *   name="comment"
 *   value={value.comment}
 *   placeholder="댓글 작성하기"
 *   onChange={handleChange}
 *   onClick={handleTextSubmit}
 * />
 */

export default function Textarea({ label, id, required, onClick, ...rest }) {
  return (
    <div className="iptBox">
      <label htmlFor={id} className={required ? 'required' : ''}>
        {label}
      </label>
      <div className={`textarea ${!onClick ? 'lg' : ''}`}>
        <textarea id={id} required={required} {...rest} />
        {onClick && (
          //@공통컴퍼넌트 변경예정
          <button className="button" onClick={onClick}>
            입력
          </button>
        )}
      </div>
    </div>
  );
}
