'use client';

import { useState } from 'react';
import ModalConfirmButton from '@/components/button/ModalButton/ModalButton';
import styles from './ChangePasswordCard.module.scss';

export default function ChangePasswordCard() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPwCheck, setNewPwCheck] = useState('');

  return (
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
      <ModalConfirmButton size="large" className={styles.saveButton}>
        변경
      </ModalConfirmButton>
    </div>
  );
}
