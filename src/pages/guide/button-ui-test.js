'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import {
  LoginButton,
  DashboardButton,
  AddColumnButton,
  AddTodoButton,
  DashboardAddButton,
  ModalCancelButton,
  ModalConfirmButton,
  DashboardDeleteButton,
  InviteAcceptButton,
  InviteRejectButton,
  DeleteButton,
  InputSubmitButton,
  PaginationPairButton,
} from '@/components/button';

const Section = ({ title, children }) => (
  <div className="mb-10 p-4 border rounded-xl">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <div className="flex gap-4 flex-wrap">{children}</div>
  </div>
);

export default function ButtonTestPage() {
  const [log, setLog] = useState('');

  const handleClick = (msg) => {
    setLog(msg);
    console.log(msg);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Button Test Page</h1>

      {/* 클릭 로그 표시 */}
      {log && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-lg font-medium border">✔ {log}</div>
      )}

      {/* ---------------------- 로그인 버튼 ---------------------- */}
      <Section title="로그인 버튼 (LoginButton)">
        <LoginButton size="large" active onClick={() => handleClick('로그인 large active')}>
          로그인
        </LoginButton>

        <LoginButton
          size="large"
          active={false}
          onClick={() => handleClick('로그인 large inactive')}
        >
          로그인
        </LoginButton>

        <LoginButton size="small" active onClick={() => handleClick('로그인 small active')}>
          로그인
        </LoginButton>

        <LoginButton
          size="small"
          active={false}
          onClick={() => handleClick('로그인 small inactive')}
        >
          로그인
        </LoginButton>
      </Section>

      {/* ---------------------- 모달 버튼 ---------------------- */}
      <Section title="모달 버튼 (ModalConfirm / ModalCancel)">
        <ModalConfirmButton size="large" onClick={() => handleClick('모달 확인 large')}>
          확인
        </ModalConfirmButton>

        <ModalConfirmButton size="small" onClick={() => handleClick('모달 확인 small')}>
          확인
        </ModalConfirmButton>

        <ModalCancelButton size="large" onClick={() => handleClick('모달 취소 large')}>
          취소
        </ModalCancelButton>

        <ModalCancelButton size="small" onClick={() => handleClick('모달 취소 small')}>
          취소
        </ModalCancelButton>
      </Section>

      {/* ---------------------- Pagination ---------------------- */}
      <Section title="페이지 네이션 버튼 (PaginationPairButton)">
        {/* active + black */}
        <PaginationPairButton
          size="large"
          prevState="active"
          nextState="active"
          prevColorSet="black"
          nextColorSet="black"
          onPrev={() => handleClick('prev large active black')}
          onNext={() => handleClick('next large active black')}
        />

        <PaginationPairButton
          size="small"
          prevState="active"
          nextState="active"
          prevColorSet="black"
          nextColorSet="black"
          onPrev={() => handleClick('prev small active black')}
          onNext={() => handleClick('next small active black')}
        />

        {/* inactive + gray */}
        <PaginationPairButton
          size="large"
          prevState="inactive"
          nextState="inactive"
          prevColorSet="gray"
          nextColorSet="gray"
          onPrev={() => handleClick('prev large inactive gray')}
          onNext={() => handleClick('next large inactive gray')}
        />

        <PaginationPairButton
          size="small"
          prevState="inactive"
          nextState="inactive"
          prevColorSet="gray"
          nextColorSet="gray"
          onPrev={() => handleClick('prev small inactive gray')}
          onNext={() => handleClick('next small inactive gray')}
        />
      </Section>

      {/* ---------------------- 컬럼 추가 버튼 ---------------------- */}
      <Section title="컬럼 추가 버튼 (AddColumnButton)">
        <AddColumnButton type="1" onClick={() => handleClick('컬럼 추가 type1')}>
          새로운 컬럼 추가하기
        </AddColumnButton>

        <AddColumnButton type="2" onClick={() => handleClick('컬럼 추가 type2')}>
          새로운 컬럼 추가하기
        </AddColumnButton>

        <AddColumnButton type="3" onClick={() => handleClick('컬럼 추가 type3')}>
          새로운 컬럼 추가하기
        </AddColumnButton>
      </Section>

      {/* ---------------------- 투두 추가 버튼 ---------------------- */}
      <Section title="투두 추가 버튼 (AddTodoButton)">
        <AddTodoButton type="1" onClick={() => handleClick('투두 추가 type1')} />
        <AddTodoButton type="2" onClick={() => handleClick('투두 추가 type2')} />
        <AddTodoButton type="3" onClick={() => handleClick('투두 추가 type3')} />
      </Section>

      {/* ---------------------- 대시보드 버튼 ---------------------- */}
      <Section title="대시보드 버튼 (DashboardButton)">
        <DashboardButton
          size="large"
          icon={<Image src="/images/common/ico_crown.svg" alt="crown" width={21} height={16} />}
          arrow={
            <Image src="/images/common/btn_chevron_right.svg" alt="arrow" width={16} height={16} />
          }
          onClick={() => handleClick('대시보드 large')}
        >
          비브리지
        </DashboardButton>

        <DashboardButton
          size="medium"
          icon={<Image src="/images/common/ico_crown.svg" alt="crown" width={21} height={16} />}
          arrow={
            <Image src="/images/common/btn_chevron_right.svg" alt="arrow" width={16} height={16} />
          }
          onClick={() => handleClick('대시보드 medium')}
        >
          비브리지
        </DashboardButton>

        <DashboardButton
          size="small"
          icon={<Image src="/images/common/ico_crown.svg" alt="crown" width={21} height={16} />}
          arrow={
            <Image src="/images/common/btn_chevron_right.svg" alt="arrow" width={16} height={16} />
          }
          onClick={() => handleClick('대시보드 small')}
        >
          비브리지
        </DashboardButton>
      </Section>

      {/* ---------------------- 대시보드 추가 버튼 ---------------------- */}
      <Section title="대시보드 추가 버튼 (DashboardAddButton)">
        <DashboardAddButton type="1" onClick={() => handleClick('대시보드 추가 type1')}>
          새로운 대시보드
        </DashboardAddButton>

        <DashboardAddButton type="2" onClick={() => handleClick('대시보드 추가 type2')}>
          새로운 대시보드
        </DashboardAddButton>

        <DashboardAddButton type="3" onClick={() => handleClick('대시보드 추가 type3')}>
          새로운 대시보드
        </DashboardAddButton>
      </Section>
      {/* ---------------------- 대시보드 삭제 버튼 ---------------------- */}
      <Section title="대시보드 삭제 버튼 (DashboardDeleteButton)">
        <DashboardDeleteButton type="1" onClick={() => handleClick('대시보드 삭제 type1')}>
          대시보드 삭제하기
        </DashboardDeleteButton>

        <DashboardDeleteButton type="2" onClick={() => handleClick('대시보드 삭제 type2')}>
          대시보드 삭제하기
        </DashboardDeleteButton>

        <DashboardDeleteButton type="3" onClick={() => handleClick('대시보드 삭제 type3')}>
          대시보드 삭제하기
        </DashboardDeleteButton>
      </Section>
      {/* ---------------------- 초대 버튼 (수락/거절) ---------------------- */}
      <Section title="초대 응답 버튼 (Invite Buttons)">
        <div style={{ display: 'flex', gap: '12px' }}>
          <InviteAcceptButton type="1" onClick={() => handleClick('초대 수락 1')} />
          <InviteRejectButton type="1" onClick={() => handleClick('초대 거절 1')} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <InviteAcceptButton type="2" onClick={() => handleClick('초대 수락 2')} />
          <InviteRejectButton type="2" onClick={() => handleClick('초대 거절 2')} />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <InviteAcceptButton type="3" onClick={() => handleClick('초대 수락 3')} />
          <InviteRejectButton type="3" onClick={() => handleClick('초대 거절 3')} />
        </div>
      </Section>
      {/* ---------------------- 삭제 버튼 ---------------------- */}
      <Section title="삭제 버튼 (DeleteButton)">
        <DeleteButton type="1" onClick={() => handleClick('삭제 type1')} />
        <DeleteButton type="2" onClick={() => handleClick('삭제 type2')} />
      </Section>
      {/* ---------------------- 입력 버튼 ---------------------- */}
      <Section title="입력 버튼 (InputSubmitButton)">
        <InputSubmitButton type="1" onClick={() => handleClick('입력 type1')}></InputSubmitButton>
        <InputSubmitButton type="2" onClick={() => handleClick('입력 type2')}></InputSubmitButton>
      </Section>
    </div>
  );
}
