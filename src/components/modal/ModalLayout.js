'use client';

import styles from './Modal.module.scss';

export default function ModalLayout({
  isOpen,
  closeModal,
  title,
  children,
  primaryBtn,
  secondaryBtn,
}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {/* 제목 */}
        {title && <h2 className={styles.title}>{title}</h2>}

        {/* 내용 */}
        <div className={styles.content}>{children}</div>

        {/* 버튼 영역 */}
        <div className={styles.buttonGroup}>
          {secondaryBtn && (
            <button onClick={secondaryBtn.onClick} className={styles.secondary}>
              {secondaryBtn.label}
            </button>
          )}

          {primaryBtn && (
            <button onClick={primaryBtn.onClick} className={styles.primary}>
              {primaryBtn.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
