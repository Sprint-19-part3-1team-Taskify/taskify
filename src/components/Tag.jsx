export default function Tag({ children, className, onClick, disabled }) {
  const handleDelete = (e) => {
    onClick(e);
  };
  return (
    <button className={`tag ${className}`} onClick={handleDelete} disabled={disabled}>
      {children}
    </button>
  );
}
