'use client';

import { useState } from 'react';
import Image from 'next/image';

import {
  LoginButton,
  ModalCancelButton,
  ModalConfirmButton,
  PaginationPairButton,
  DashboardButton,
  AddTodoButton,
  InviteAcceptButton,
  InviteRejectButton,
  DeleteButton,
  InputSubmitButton,
  AddColumnButton,
  DashboardAddButton,
  DashboardDeleteButton,
} from '@/components/button';

export default function ButtonUsageExamplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [log, setLog] = useState('');

  const handleLog = (msg) => setLog(msg);

  return (
    <div className="p-10 space-y-12">
      <h1 className="text-3xl font-bold">Button Usage Examples</h1>

      {log && <div className="p-4 bg-gray-100 border rounded-lg text-lg font-medium">✔ {log}</div>}

      {/* ---------------------- 로그인 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">1. 로그인 플로우 예시</h2>
        <LoginButton size="large" active onClick={() => handleLog('로그인 버튼 클릭')}>
          로그인
        </LoginButton>
      </section>

      {/* ---------------------- 모달 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">2. 모달 예시</h2>

        <button
          className="px-4 py-2 bg-black text-white rounded-lg"
          onClick={() => setIsModalOpen(true)}
        >
          모달 열기
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 w-[300px]">
              <p className="text-lg">정말 삭제하시겠습니까?</p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <ModalConfirmButton onClick={() => setIsModalOpen(false)}>확인</ModalConfirmButton>

                <ModalCancelButton
                  onClick={() => {
                    handleLog('삭제 취소');
                    setIsModalOpen(false);
                  }}
                >
                  취소
                </ModalCancelButton>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ---------------------- 페이지네이션 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">3. 페이지네이션 예시</h2>

        <p>
          현재 페이지: <strong>{page}</strong>
        </p>

        <PaginationPairButton
          size="large"
          prevState={page === 1 ? 'inactive' : 'active'}
          nextState="active"
          prevColorSet={page === 1 ? 'gray' : 'black'}
          nextColorSet="black"
          onPrev={() => page > 1 && setPage(page - 1)}
          onNext={() => setPage(page + 1)}
        />
      </section>

      {/* ---------------------- 대시보드 버튼 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">4. 대시보드 카드 예시</h2>

        <DashboardButton
          size="large"
          icon={<Image src="/images/common/ico_crown.svg" width={21} height={16} alt="crown" />}
          arrow={
            <Image src="/images/common/btn_chevron_right.svg" width={16} height={16} alt="arrow" />
          }
          onClick={() => handleLog('대시보드 이동')}
        >
          마케팅 대시보드
        </DashboardButton>
      </section>

      {/* ---------------------- 초대 응답 UI ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">5. 초대 응답 UI</h2>

        <div style={{ display: 'flex', gap: '12px' }}>
          <InviteAcceptButton onClick={() => handleLog('초대 수락')} />
          <InviteRejectButton onClick={() => handleLog('초대 거절')} />
        </div>
      </section>

      {/* ---------------------- 삭제 버튼 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">6. 삭제 버튼 예시</h2>
        <DeleteButton type="2" onClick={() => handleLog('아이템 삭제')} />
      </section>

      {/* ---------------------- 폼 제출 버튼 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">7. 입력 폼 예시</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLog('폼 제출됨');
          }}
          className="flex gap-3"
        >
          <input type="text" placeholder="내용 입력" className="border p-2 rounded-lg" />
          <InputSubmitButton type="1" />
        </form>
      </section>

      {/* ---------------------- AddTodoButton 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">8. AddTodoButton 예시</h2>

        <AddTodoButton onClick={() => handleLog('할 일 추가 버튼 클릭됨')} />
      </section>

      {/* ---------------------- ColumnAddButton 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">9. AddColumnButton 예시</h2>

        <AddColumnButton onClick={() => handleLog('컬럼 추가 버튼 클릭됨')} />
      </section>

      {/* ---------------------- DashboardAddButton 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">10. DashboardAddButton 예시</h2>

        <DashboardAddButton onClick={() => handleLog('대시보드 추가 버튼 클릭됨')} />
      </section>

      {/* ---------------------- DashboardDeleteButton 예시 ---------------------- */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">11. DashboardDeleteButton 예시</h2>

        <DashboardDeleteButton onClick={() => handleLog('대시보드 삭제하기 클릭됨')} />
      </section>
    </div>
  );
}
