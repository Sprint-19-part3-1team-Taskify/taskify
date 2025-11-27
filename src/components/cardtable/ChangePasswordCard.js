import { useState } from 'react';
import { putAuthPassword } from '@/api/auth';
import ModalConfirmButton from '@/components/button/ModalButton/ModalButton';
import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import styles from './ChangePasswordCard.module.scss';

export default function ChangePasswordCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');
  const [apiError, setApiError] = useState('');
  
  const handlePasswordSave = async () => {
    if(newPw !== newPwCheck) {
      openModal('passwordMismatch');
      return null;
    }
    try {
      await putAuthPassword({
        password: currentPw?.trim(),
        newPassword: newPwCheck?.trim(),
      });
      openModal('passwordSave');
    } catch (error) {
      setApiError(error.message);
      openModal('errorModal');
    }
  }

  return (
    <>
      <div className={styles.card}>
        <h2 className={styles.title}>비밀번호 변경</h2>

        <div className={styles.field}>
          <label>현재 비밀번호</label>
          <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>새 비밀번호</label>
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
        </div>

        <div className={styles.field}>
          <label>새 비밀번호 확인</label>
          <input type="password" value={newPwCheck} onChange={(e) => setNewPwCheck(e.target.value)} />
        </div>

        {/*  모달에서 쓰던 버튼 그대로 재사용 */}
        <ModalConfirmButton size="large" className={styles.saveButton} onClick={handlePasswordSave}>
          변경
        </ModalConfirmButton>
      </div>

      {/* 모달 */}
      <Modal
        variant="alert"
        id="passwordSave"
        isOpen={isOpen('passwordSave')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        비밀번호 변경이 완료되었습니다.
      </Modal>
      <Modal
        variant="alert"
        id="errorModal"
        isOpen={isOpen('errorModal')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        {apiError}
      </Modal>
      <Modal
        variant="alert"
        id="passwordMismatch"
        isOpen={isOpen('passwordMismatch')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        비밀번호가 일치하지 않습니다.
      </Modal>
    </>
  );
}
