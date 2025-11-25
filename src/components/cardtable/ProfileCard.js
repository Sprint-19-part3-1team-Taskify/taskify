'use client';

import { useState } from 'react';
import styles from './ProfileCard.module.scss';

export default function ProfileCard() {
  const [preview, setPreview] = useState(null);
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageURL = URL.createObjectURL(file);
    setPreview(imageURL);
  };

  return (
    <div className={styles.profileCard}>
      <h2 className={styles.title}>프로필</h2>

      <div className={styles.profileTop}>
        <label className={styles.imageUpload}>
          {preview ? (
            <img src={preview} className={styles.preview} />
          ) : (
            <span className={styles.plus}>
              <img src="/images/common/btn_img_add.svg" alt="add" />
            </span>
          )}
          <input type="file" onChange={handleImageUpload} />
        </label>

        <div className={styles.fields}>
          <div className={styles.field}>
            <label>이메일</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className={styles.field}>
            <label>닉네임</label>
            <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>

          <button className={styles.saveButton}>저장</button>
        </div>
      </div>
    </div>
  );
}
