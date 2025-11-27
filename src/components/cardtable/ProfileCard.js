import { useEffect, useState } from 'react';
import styles from './ProfileCard.module.scss';
import { postUsersMeImage } from '@/api/users';
import { useAuth } from '@/context/authProvider';
import { useModal } from '@/context/modalProvider';
import Modal from '../modal/Modal';

export default function ProfileCard() {
  const { user, updateMe, isLoading } = useAuth(true);
  const { isOpen, openModal, closeModal } = useModal();
  const [preview, setPreview] = useState('');
  const [nickname, setNickname] = useState('');
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (user) {
      setPreview(user.profileImageUrl);
      setNickname(user.nickname);
    }
  }, [user]);

  if (isLoading || !user) {
    return null; // 로딩 중이거나 user가 없으면 렌더링 안 함
  }
  


  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageURL = await postUsersMeImage(file);
      setPreview(imageURL.profileImageUrl);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };
  const handleProfileSave = async () => {
    try {
      const updateData = {
        nickname: nickname.trim(),
        profileImageUrl: preview,
      };
      await updateMe(updateData);
      openModal('saveComplete');
    } catch (error) {
      setApiError(error.message);
      openModal('profileErrorModal');
    }
  };

  return (
    <>
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
              <input type="text" value={user.email} readOnly />
            </div>

            <div className={styles.field}>
              <label>닉네임</label>
              <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>

            <button className={styles.saveButton} onClick={handleProfileSave}>
              저장
            </button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Modal
        variant="alert"
        id="saveComplete"
        isOpen={isOpen('saveComplete')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        프로필 저장이 완료되었습니다.
      </Modal>
      <Modal
        variant="alert"
        id="profileErrorModal"
        isOpen={isOpen('profileErrorModal')}
        closeModal={closeModal}
        primaryBtn="확인"
      >
        {apiError}
      </Modal>
    </>
  );
}
