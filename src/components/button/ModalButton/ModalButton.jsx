import styles from './ModalButton.module.scss';

/**
 * 공통 모달 버튼 Base
 */
function ModalButton({ children, size = 'large', type = 'primary', ...props }) {
  return (
    <button className={`${styles.button} ${styles[size]} ${styles[type]}`} {...props}>
      {children}
    </button>
  );
}

/**
 * 취소 버튼 (secondary)
 */
export function ModalCancelButton({ children = '취소', size = 'large', ...props }) {
  return (
    <ModalButton type="secondary" size={size} {...props}>
      {children}
    </ModalButton>
  );
}

/**
 * 확인 버튼 (primary)
 */
export function ModalConfirmButton({ children = '확인', size = 'large', ...props }) {
  return (
    <ModalButton type="primary" size={size} {...props}>
      {children}
    </ModalButton>
  );
}

export default ModalButton;
