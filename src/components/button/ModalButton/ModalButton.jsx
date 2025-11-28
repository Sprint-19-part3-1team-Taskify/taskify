import styles from './ModalButton.module.scss';

/**
 * 공통 모달 버튼 Base
 */
function ModalButton({ children, size = 'large', type = 'primary', className = '', ...props }) {
  return (
    <button className={`${styles.button} ${styles[size]} ${styles[type]} ${className}`} {...props}>
      {children}
    </button>
  );
}

/**
 * 취소 버튼 (secondary)
 */
export function ModalCancelButton({ children = '취소', size = 'large', className = '', ...props }) {
  return (
    <ModalButton type="secondary" size={size} className={className} {...props}>
      {children}
    </ModalButton>
  );
}

/**
 * 확인 버튼 (primary)
 */
export function ModalConfirmButton({
  children = '확인',
  size = 'large',
  className = '',
  ...props
}) {
  return (
    <ModalButton type="primary" size={size} className={className} {...props}>
      {children}
    </ModalButton>
  );
}

export default ModalButton;
