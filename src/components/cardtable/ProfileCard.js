import { useEffect, useState, useRef } from 'react';
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
  const selectedFileRef = useRef(null);

  // 사용자 정보 변경 시 상태 초기화
  useEffect(() => {
    if (user) {
      setPreview(user.profileImageUrl);
      setNickname(user.nickname);
      selectedFileRef.current = null; // 사용자 변경 시 선택된 파일 초기화
    }
  }, [user]);

  // 컴포넌트 언마운트 시 blob URL 정리
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (isLoading || !user) {
    return null; // 로딩 중이거나 user가 없으면 렌더링 안 함
  }

  // 파일 선택 시 미리보기만 표시 (API 호출 안 함)
  const handleImageSelect = (e) => {
    const file = e.target.files[0];

    // 이전 blob URL 정리
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    if (!file) {
      // 파일 선택 취소 시 원래 이미지로 복원
      setPreview(user?.profileImageUrl || '');
      selectedFileRef.current = null;
      return;
    }

    // 로컬 미리보기 URL 생성
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // 파일 객체 저장 (나중에 저장 시 업로드용)
    selectedFileRef.current = file;
  };

  const handleProfileSave = async () => {
    try {
      let profileImageUrl = preview;

      // 새 파일이 선택된 경우에만 이미지 업로드
      if (selectedFileRef.current) {
        try {
          const imageResult = await postUsersMeImage(selectedFileRef.current);
          profileImageUrl = imageResult.profileImageUrl;

          // 업로드 성공 후 로컬 미리보기 URL 정리
          if (preview && preview.startsWith('blob:')) {
            URL.revokeObjectURL(preview);
          }

          // 업로드된 이미지 URL로 미리보기 업데이트
          setPreview(profileImageUrl);
          selectedFileRef.current = null; // 업로드 완료 후 초기화
        } catch (error) {
          console.error('이미지 업로드 실패:', error);
          setApiError('이미지 업로드에 실패했습니다.');
          openModal('profileErrorModal');
          return;
        }
      }

      // 프로필 업데이트
      const updateData = {
        nickname: nickname.trim(),
        profileImageUrl: profileImageUrl,
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
            <input type="file" accept="image/*" onChange={handleImageSelect} />
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
