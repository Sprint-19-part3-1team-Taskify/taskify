'use client';

import { useState } from 'react';
import MemberCardTable from '../../components/cardtable/MemberCardTable';
import InvitationCardTable from '../../components/cardtable/InvitationCardTable';
import EmptyDashboard from '../../components/cardtable/EmptyInvitedDashboard';
import ProfileCard from '../../components/cardtable/ProfileCard';
import ChangePasswordCard from '../../components/cardtable/ChangePasswordCard';
import { ModalConfirmButton } from '@/components/button/ModalButton/ModalButton';

export default function MemberCardTableDemoPage() {
  const [members, setMembers] = useState([
    { id: 1, name: '정만철', avatar: null, color: '#A3C4A2' },
    { id: 2, name: '김태순', avatar: null, color: '#76A6EA' },
    { id: 3, name: '최주현', avatar: null, color: '#FFC85A' },
    { id: 4, name: '윤지현', avatar: null, color: '#FDD446' },
    { id: 5, name: '박민수', avatar: null, color: '#E876EA' },
    { id: 6, name: '이서연', avatar: null, color: '#9DD7ED' },
    { id: 7, name: '강동훈', avatar: null, color: '#C4B5FD' },
    { id: 8, name: '송미란', avatar: null, color: '#FCA5A5' },
  ]);

  const [invitedMembers, setInvitedMembers] = useState([
    { id: 101, email: 'ccdeitA@codeit.com', avatar: null, color: '#10B981' },
    { id: 102, email: 'ccdeitB@codeit.com', avatar: null, color: '#664c1fff' },
    { id: 103, email: 'ccdeitC@codeit.com', avatar: null, color: '#EF4444' },
    { id: 104, email: 'ccdeitD@codeit.com', avatar: null, color: '#8B5CF6' },
    { id: 105, email: 'ccdeitE@codeit.com', avatar: null, color: '#EC4899' },
  ]);

  const [invitedDashboards, setInvitedDashboards] = useState([
    { id: 1, title: '프로젝트 대시보드', inviter: '김철수', color: '#5534DA' },
    { id: 2, title: '마케팅 현황판', inviter: '이영희', color: '#76A6EA' },
    { id: 3, title: '개발팀 대시보드', inviter: '박민수', color: '#10B981' },
    { id: 4, title: 'Q4 목표 추적', inviter: '정수연', color: '#F59E0B' },
    { id: 5, title: '고객 피드백', inviter: '최동훈', color: '#EF4444' },
  ]);

  const handleDeleteMember = (memberId) => {
    setMembers(members.filter((m) => m.id !== memberId));
    console.log(`구성원 ${memberId} 삭제됨`);
  };

  const handleCancelInvite = (inviteId) => {
    setInvitedMembers(invitedMembers.filter((m) => m.id !== inviteId));
    console.log(`초대 ${inviteId} 취소됨`);
  };

  const handleAcceptDashboard = (dashboardId) => {
    console.log(`대시보드 ${dashboardId} 수락됨`);
    setInvitedDashboards(invitedDashboards.filter((d) => d.id !== dashboardId));
  };

  const handleRejectDashboard = (dashboardId) => {
    console.log(`대시보드 ${dashboardId} 거절됨`);
    setInvitedDashboards(invitedDashboards.filter((d) => d.id !== dashboardId));
  };

  const handleAddMember = () => {
    const newMember = {
      id: Date.now(),
      name: `새 멤버 ${members.length + 1}`,
      avatar: null,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    setMembers([...members, newMember]);
  };

  const handleAddInvite = () => {
    const newInvite = {
      id: Date.now(),
      email: `newuser${invitedMembers.length + 1}@codeit.com`,
      avatar: null,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    };
    setInvitedMembers([...invitedMembers, newInvite]);
  };

  const handleInvite = () => {
    console.log('초대하기 버튼 클릭됨');
    alert('초대 모달을 열거나 초대 페이지로 이동합니다.');
  };

  const handleCreateDashboard = () => {
    console.log('새로운 대시보드 만들기 버튼 클릭됨');
    alert('새 대시보드 생성 페이지 또는 모달로 이동합니다.');
  };

  return (
    <div>
      <div>
        <header>
          <h1>CardTable 컴포넌트 데모</h1>
          <p>구성원, 초대 내역, 대시보드를 관리하는 카드 테이블 컴포넌트입니다.</p>
        </header>

        {/* --- SECTION 1: MemberCardTable --- */}

        <section>
          <h2>1. MemberCardTable - 구성원 관리</h2>

          <div>
            <MemberCardTable
              title="구성원"
              members={members}
              itemsPerPage={4}
              onDeleteMember={handleDeleteMember}
            />
            <MemberCardTable
              title="구성원 (2개씩)"
              members={members}
              itemsPerPage={2}
              onDeleteMember={handleDeleteMember}
            />
          </div>

          <button onClick={handleAddMember}>+ 멤버 추가 (테스트용)</button>
        </section>

        {/* --- SECTION 2: InvitationCardTable --- */}

        <section>
          <h2>2. InvitationCardTable - 초대 내역</h2>

          <div>
            <InvitationCardTable
              title="초대 내역"
              invitations={invitedMembers}
              itemsPerPage={4}
              onCancelInvitation={handleCancelInvite}
              isInvited={true}
              onInvite={handleInvite}
            />
          </div>

          <button onClick={handleAddInvite}>+ 초대 추가 (테스트용)</button>
        </section>

        {/* --- SECTION 5: 빈 상태 테스트 --- */}

        <section>
          <h2>5. 빈 상태 예시 (CardTable)</h2>

          <div>
            <MemberCardTable title="구성원 (빈 상태)" members={[]} itemsPerPage={4} />
            <InvitationCardTable
              title="초대 내역 (빈 상태)"
              invitations={[]}
              itemsPerPage={4}
              isInvited={true}
            />
          </div>
        </section>

        {/* --- SECTION 6: EmptyDashboard 컴포넌트 테스트 --- */}

        <section>
          <h2>6. 빈 대시보드 UI 테스트 (EmptyDashboard)</h2>
          <div>
            <EmptyDashboard
              title="나의 대시보드"
              message="아직 대시보드를 만들지 않으셨군요!"
              buttonText="새로운 대시보드 만들기"
              onClick={handleCreateDashboard}
            />
          </div>{' '}
          <p>
            💡 이 섹션은 대시보드 목록 페이지 전체가 빈 상태일 때 표시되는 UI
            컴포넌트(EmptyDashboard)의 예시를 보여줍니다.
          </p>
        </section>

        {/* --- SECTION 7: ProfileCard 테스트 --- */}

        <section>
          <h2>7. ProfileCard - 프로필 카드 UI 테스트</h2>

          <div>
            <ProfileCard />
          </div>

          <p>💡 프로필 이미지 업로드, 이메일, 닉네임 입력 UI를 테스트할 수 있습니다.</p>
        </section>

        {/* --- SECTION 8: ChangePasswordCard 테스트 --- */}

        <section>
          <h2>8. ChangePasswordCard - 비밀번호 변경 UI 테스트</h2>

          <div>
            <ChangePasswordCard />
          </div>

          <p>💡 기존 비밀번호 → 새 비밀번호 → 새 비밀번호 확인 UI를 테스트할 수 있습니다.</p>
        </section>
      </div>
    </div>
  );
}

MemberCardTableDemoPage.headerType = 'none';
MemberCardTableDemoPage.dashboardName = '';
