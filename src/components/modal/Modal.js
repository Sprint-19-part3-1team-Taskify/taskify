import { useRef, useState } from 'react';
import { ModalCancelButton, ModalConfirmButton } from '@/components/button';
import styles from './Modal.module.scss';
import useModalLock from '@/hook/useModalLock';

/**
 * Modal Component
 * 다양한 형태의 모달을 제공하는 컴포넌트
 *
 * @param {string} props.id - 모달의 고유 ID
 * @param {string} props.variant - 모달 타입 ("default", "type1", "type2", "alert", "confirm")
 *   - alert: 알림 모달 (헤더 없음, 확인 버튼만)
 *   - confirm: 확인 모달 (헤더 없음, 취소/확인 버튼)
 *   - default: 기본 모달 (헤더 + 내용 + 하단 버튼)
 *   - type1: 폼이 많은 모달 (넓이 584px)
 *   - type2: 상세 모달 (우측 상단 X 버튼, 하단 버튼 없음, 넓이 730px)
 * @param {ReactNode} props.children - 모달 내용
 * @param {string} [props.title] - 모달 제목 (alert, confirm 제외)
 * @param {boolean} props.isOpen - 모달 열림 상태
 * @param {Function} props.closeModal - 모달 닫기 함수 (id: string) => void
 * @param {string} [props.secondaryBtn] - 보조 버튼 텍스트 (취소, 삭제 등)
 * @param {string} props.primaryBtn - 주요 버튼 텍스트 (확인, 생성, 수정 등)
 * @param {Function} [props.onClick] - 주요 버튼 클릭 핸들러
 * @param {Function} [props.onSubClick] - 보조 버튼 클릭 핸들러
 *
 * @example
 * // Alert 모달
 * <Modal variant="alert" id="alertModal" isOpen={isOpen} closeModal={closeModal} primaryBtn="확인">
 *   비밀번호가 일치하지 않습니다.
 * </Modal>
 */

const alertType = ['alert', 'confirm'];
export default function Modal({
  id,
  variant,
  children,
  title,
  isOpen,
  closeModal,
  secondaryBtn,
  primaryBtn,
  onClick,
  onSubClick,
  singleButton = false,
  disabled = false,
  onEdit,
  onDelete,
}) {
  const [more, setMore] = useState(false);
  useModalLock(isOpen); // 배경 스크롤 방지
  const modalRef = useRef(); // 배경 클릭시 팝업 close
  const handleModalOverlay = (e) => {
    if (e.target === modalRef.current) closeModal(id);
  };

  if (!isOpen) return null;

  // 보조액션
  const handleSecondary = () => {
    onSubClick?.();
    if (secondaryBtn === '취소') closeModal(id);
  };
  // 주요액션
  const handlePrimary = () => {
    onClick?.();
    if (variant === 'type2' || variant === 'alert') closeModal(id);
  };

  // 수정하기 핸들러
  const handleEdit = () => {
    setMore(false);
    onEdit?.();
  };

  // 삭제하기 핸들러
  const handleDelete = () => {
    setMore(false);
    onDelete?.();
  };

  return (
    <>
      <div className={styles.modalOverlay} ref={modalRef} onClick={handleModalOverlay}>
        <section id={id}>
          <div className={`${styles.modal} ${styles[variant] || ''}`}>
            {/*  modalHeader*/}
            {!alertType.includes(variant) && (
              <div className={styles.modalHeader}>
                <h1 className={styles.modalTitle}>{title}</h1>
                {variant === 'type2' && (
                  <div className={styles.moreMenu}>
                    <div className={styles.btns}>
                      <button className={styles.btnMeun} onClick={() => setMore(!more)}>
                        <span className="blind">버튼 더보기</span>
                      </button>
                      <button className={styles.btnClose} onClick={handlePrimary}>
                        <span className="blind">닫기</span>
                      </button>
                    </div>
                    {more && (
                      <div className={styles.menu}>
                        <button onClick={handleEdit}>수정하기</button>
                        <button onClick={handleDelete}>삭제하기</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {/*  modalContent*/}
            <div className={styles.modalContent}>{children}</div>
            {/*  modalFooter*/}
            {variant !== 'type2' && (
              <div className={styles.modalFooter}>
                {/* ⭐ singleButton 옵션: secondaryBtn 출력 안함 */}
                {!singleButton && secondaryBtn && (
                  <ModalCancelButton size="large" onClick={handleSecondary}>
                    {secondaryBtn}
                  </ModalCancelButton>
                )}

                <ModalConfirmButton
                  size="large"
                  onClick={handlePrimary}
                  className={singleButton ? styles.singleButton : ''}
                  disabled={disabled}
                >
                  {primaryBtn}
                </ModalConfirmButton>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
