import styles from './BaseButton.module.scss';

export default function BaseButton({
  children,
  size = 'large', // large | small
  state = 'active', // active | inactive (로그인/기본 버튼용)
  variant, // modalCancel | modalConfirm (모달 전용)
  ...props
}) {
  const className = [
    styles.button,
    styles[size],
    variant ? styles[variant] : styles[state], // variant가 있으면 우선 적용
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
