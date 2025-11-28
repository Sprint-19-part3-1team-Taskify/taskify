'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useHeader } from '@/context/HeaderProvider';
import { useDashboard } from '@/context/DashboardProvider';
import { useModal } from '@/context/modalProvider';

import MemberCardTable from '@/components/cardtable/MemberCardTable';
import InvitationCardTable from '@/components/cardtable/InvitationCardTable';
import DashboardForm from '@/components/dashboard/DashboardForm';

import {
  getDashboardsId,
  putDashboardsId,
  deleteDashboardsId,
  getDashboardsIdInvitations,
  postDashboardsIdInvitations,
  deleteDashboardsIdInvitations,
} from '@/api/dashboards';

import { getMembers, deleteMembersId } from '@/api/members';
import { DashboardDeleteButton } from '@/components/button';
import Modal from '@/components/modal/Modal';

/* --------------------------
   삭제 확인 모달 (이건 유지)
--------------------------- */
function ConfirmDeleteModal({ open, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <p style={{ marginBottom: 16 }}>정말로 대시보드를 삭제하시겠습니까?</p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            style={{
              ...confirmBtn,
              background: '#e5e7eb',
              color: '#111',
            }}
            onClick={onCancel}
          >
            취소
          </button>

          <button style={confirmBtn} onClick={onConfirm}>
            삭제하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------
   스타일 정의
--------------------------- */

const layout = {
  padding: '40px 32px',
  maxWidth: 680,
  margin: '0',
  background: '#fff',
  borderRadius: 16,
  border: '1px solid #eee',
};

const sectionCard = {
  padding: '28px 32px',
  background: '#fafafa',
  borderRadius: 12,
  border: '1px solid #e5e5e5',
  marginTop: 48,
};

const sectionTitle = {
  fontSize: 18,
  fontWeight: 700,
  marginBottom: 24,
};

const backBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 24,
  background: 'none',
  border: 'none',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
};

const saveBtn = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 8,
  border: 'none',
  background: '#5534DA',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  marginTop: 24,
  cursor: 'pointer',
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999,
};

const modalStyle = {
  background: '#fff',
  padding: 24,
  borderRadius: 8,
  maxWidth: 400,
  textAlign: 'center',
};

const confirmBtn = {
  padding: '8px 16px',
  borderRadius: 6,
  border: 'none',
  background: '#5534DA',
  color: '#fff',
  fontWeight: 600,
  cursor: 'pointer',
};

/* --------------------------
   대시보드 수정 페이지
--------------------------- */

export default function DashboardEdit() {
  const router = useRouter();

  const { myDashboards, setMyDashboards, currentDashboard, setCurrentDashboard } = useDashboard();
  const { showMessage } = useModal();
  const id = router.query.id;
  const fixedId = Array.isArray(id) ? id[id.length - 1] : id;

  const { setHeaderConfig } = useHeader();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#7ac555');

  const [members, setMembers] = useState([]);
  const [invitedMembers, setInvitedMembers] = useState([]);

  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  /* ⭐ 초대 모달 상태 */
  const [isInviteOpen, setInviteOpen] = useState(false);
  const openInviteModal = () => setInviteOpen(true);
  const closeInviteModal = () => setInviteOpen(false);

  /* 헤더 설정 */
  useEffect(() => {
    if (!fixedId) return;

    setHeaderConfig({
      headerType: 'header4',
      dashboardName: dashboard?.title || '대시보드 수정',
      sidemenuShow: true,
      showCrown: false,
      dashboardId: fixedId,
    });
  }, [dashboard, fixedId]);

  /* 헤더 padding 조정 */
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) header.style.paddingLeft = '300px';
    return () => {
      if (header) header.style.paddingLeft = '';
    };
  }, []);

  /* 데이터 로딩 */
  useEffect(() => {
    if (!router.isReady || !fixedId) return;

    const fetchData = async () => {
      setLoading(true);

      const data = await getDashboardsId(fixedId);

      if (data?.id) {
        setDashboard(data);
        setTitle(data.title);
        setColor(data.color);

        const exists = myDashboards?.find((d) => d.id === data.id);
        if (exists) {
          setCurrentDashboard({
            ...exists,
            title: data.title,
            color: data.color,
          });
        }
      }

      const membersRes = await getMembers({
        dashboardId: fixedId,
        page: 1,
        size: 20,
      });

      if (membersRes?.members) {
        setMembers(membersRes.members);
      }

      const invitationsRes = await getDashboardsIdInvitations(fixedId, {
        page: 1,
        size: 20,
      });

      if (invitationsRes?.invitations) {
        setInvitedMembers(invitationsRes.invitations);
      }

      setLoading(false);
    };

    fetchData();
  }, [router.isReady, fixedId]);

  /* 구성원 삭제 */
  const handleDeleteMember = async (memberId) => {
    const res = await deleteMembersId(memberId);

    if (res?.message) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      showMessage('구성원이 삭제되었습니다!');
    } else {
      showMessage('삭제 중 오류가 발생했습니다.');
    }
  };

  /* 대시보드 수정 저장 */
  const handleSave = async () => {
    if (!dashboard) return;

    const result = await putDashboardsId(dashboard.id, { title, color });

    if (result?.id) {
      setMyDashboards((prev) =>
        prev.map((d) => (d.id === dashboard.id ? { ...d, title, color } : d)),
      );

      setCurrentDashboard((prev) => (prev?.id === dashboard.id ? { ...prev, title, color } : prev));

      setDashboard((prev) => ({ ...prev, title, color }));

      showMessage('대시보드 수정 완료!');
    } else {
      showMessage('수정 중 오류가 발생했습니다.');
    }
  };

  /* 초대 취소 */
  const handleCancelInvitation = async (invitationId) => {
    const res = await deleteDashboardsIdInvitations(fixedId, invitationId);

    if (res?.message) {
      setInvitedMembers((prev) => prev.filter((m) => m.id !== invitationId));
      showMessage('초대가 취소되었습니다.');
    } else {
      showMessage('취소 중 오류가 발생했습니다.');
    }
  };

  /* ⭐ 초대하기 */
  const handleInviteSubmit = async () => {
    if (!newInviteEmail.trim()) {
      showMessage('이메일을 입력해주세요.');
      return;
    }

    if (!newInviteEmail.includes('@')) {
      showMessage('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    const res = await postDashboardsIdInvitations(fixedId, { email: newInviteEmail.trim() });

    if (res?.id) {
      setInvitedMembers((prev) => [...prev, res]);
      setNewInviteEmail('');
      closeInviteModal();
      showMessage('초대가 전송되었습니다!');
    } else {
      showMessage(res?.message || '초대에 실패했습니다.');
    }
  };

  /* 대시보드 삭제 */
  const handleDeleteDashboard = () => {
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!dashboard) return;

    const res = await deleteDashboardsId(dashboard.id);
    const success = res?.message !== 'error';

    if (success) {
      setMyDashboards((prev) => prev.filter((d) => d.id !== dashboard.id));
      setCurrentDashboard(null);

      setConfirmDeleteOpen(false);
      showMessage('대시보드가 삭제되었습니다!');

      setTimeout(() => {
        router.push('/mydashboard');
      }, 700);
    } else {
      setConfirmDeleteOpen(false);
      showMessage('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <>로딩중...</>;
  if (!dashboard) return <>대시보드를 찾을 수 없습니다.</>;

  return (
    <div style={layout}>
      {/* 뒤로가기 */}
      <button onClick={() => router.push(`/dashboard/${dashboard.id}`)} style={backBtn}>
        <Image src="/images/common/btn_chevron_left.svg" alt="뒤로가기" width={16} height={16} />
        대시보드로 돌아가기
      </button>

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 20 }}>
        {dashboard?.title || '대시보드 수정'}
      </h1>

      {/* 대시보드 정보 */}
      <div style={sectionCard}>
        <h2 style={sectionTitle}>대시보드 정보</h2>

        <DashboardForm title={title} setTitle={setTitle} color={color} setColor={setColor} />

        <button style={saveBtn} onClick={handleSave}>
          변경
        </button>
      </div>

      {/* 구성원 목록 */}
      <div style={{ marginTop: 48 }}>
        <MemberCardTable members={members} itemsPerPage={4} onDeleteMember={handleDeleteMember} />
      </div>

      {/* 초대 목록 */}
      <div style={{ marginTop: 48 }}>
        <InvitationCardTable
          invitations={invitedMembers}
          itemsPerPage={4}
          isInvited={true}
          onInvite={openInviteModal}
          onCancelInvitation={handleCancelInvitation}
        />
      </div>

      {/* 대시보드 삭제 */}
      <div style={{ marginTop: 48 }}>
        <DashboardDeleteButton type="1" onClick={handleDeleteDashboard}>
          대시보드 삭제하기
        </DashboardDeleteButton>
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmDeleteModal
        open={confirmDeleteOpen}
        onCancel={() => setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* ⭐ 초대 모달 */}
      <Modal
        id="inviteModal"
        variant="type1"
        title="초대하기"
        isOpen={isInviteOpen}
        closeModal={closeInviteModal}
        secondaryBtn="취소"
        primaryBtn="초대하기"
        onClick={handleInviteSubmit}
        onSubClick={closeInviteModal}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ fontWeight: 600 }}>이메일 주소</label>
          <input
            type="email"
            value={newInviteEmail}
            onChange={(e) => setNewInviteEmail(e.target.value)}
            placeholder="example@email.com"
            style={{
              padding: '12px 14px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontSize: 14,
            }}
          />
        </div>
      </Modal>
    </div>
  );
}
