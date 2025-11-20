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
