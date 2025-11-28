'use client';

import { useState } from 'react';
import { postDashboardsIdInvitations } from '@/api/dashboards';
import { useModal } from '@/context/modalProvider';
import { useHeader } from '@/context/HeaderProvider';
import Modal from '@/components/modal/Modal';

export default function InviteModalContainer() {
  const { isOpen, closeModal, showMessage } = useModal(); // ✅ showMessage 추가
  const { dashboardId } = useHeader();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const modalOpen = isOpen('inviteModal');

  const handleInvite = async () => {
    // ✅ validation - setMessage 방식으로 변경
    if (!email.trim()) {
      showMessage('이메일을 입력해주세요.');
      return;
    }

    if (!email.includes('@')) {
      showMessage('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const res = await postDashboardsIdInvitations(dashboardId, { email: email.trim() });

      if (res?.id) {
        setEmail('');
        closeModal('inviteModal');
        showMessage('초대가 전송되었습니다!'); // ✅ 모달 닫힌 후 메시지
      } else {
        showMessage(res?.message || '초대에 실패했습니다.');
      }
    } catch (err) {
      console.error('초대 에러:', err);
      showMessage('초대에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    closeModal('inviteModal');
  };

  return (
    <Modal
      id="inviteModal"
      variant="type1"
      title="초대하기"
      isOpen={modalOpen}
      closeModal={handleClose}
      secondaryBtn="취소"
      primaryBtn={loading ? '보내는 중...' : '초대하기'}
      onClick={handleInvite}
      onSubClick={handleClose}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontWeight: 600 }}>이메일 주소</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@email.com"
          disabled={loading}
          style={{
            padding: '12px 14px',
            borderRadius: 8,
            border: '1px solid #d1d5db',
            fontSize: 14,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !loading) {
              e.preventDefault();
              handleInvite();
            }
          }}
        />
      </div>
    </Modal>
  );
}
