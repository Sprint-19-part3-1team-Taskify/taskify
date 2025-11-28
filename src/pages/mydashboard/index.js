'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';

import styles from '@/pages/mydashboard/index.module.scss';

import SideMenu from '@/components/sidemenu/SideMenu';
import { DashboardAddButton, DashboardButton, PaginationPairButton } from '@/components/button';

import InvitedDashboardCardTable from '@/components/cardtable/InvitedDashboardCardTable';
import EmptyInvitedDashboard from '@/components/cardtable/EmptyInvitedDashboard';

import Modal from '@/components/modal/Modal';
import Input from '@/components/input/Input';
import Color from '@/components/common/Color';

import { useDashboard } from '@/context/DashboardProvider';
import { useHeader } from '@/context/HeaderProvider';
import { withAuth } from '@/lib/auth';

/* 선택 가능한 색상 */
const colorOptions = [
  { colorValue: '#7ac555', colorName: 'green' },
  { colorValue: '#760dde', colorName: 'purple' },
  { colorValue: '#ffa500', colorName: 'orange' },
  { colorValue: '#76a5ea', colorName: 'blue' },
  { colorValue: '#e876ea', colorName: 'pink' },
];

/* 페이지 정보 */
function PageInfo({ currentPage, totalPages }) {
  return (
    <span className={styles.pageInfo}>
      {totalPages} 페이지 중 {currentPage} 페이지
    </span>
  );
}

export default function MyDashboard() {
  const router = useRouter();

  /* HeaderProvider 적용 */
  const { setHeaderConfig } = useHeader();

  useEffect(() => {
    setHeaderConfig({
      headerType: 'header3Simple',
      dashboardName: '내 대시보드',
      sidemenuShow: true,
      showCrown: false,
      dashboardId: null,
    });
  }, [setHeaderConfig]);

  /* Header padding 제어 */
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      header.style.paddingLeft = '300px';
    }

    return () => {
      if (header) {
        header.style.paddingLeft = '';
      }
    };
  }, []);

  /* Provider 데이터 */
  const {
    myDashboards,
    invitedDashboards,
    loadingMy,
    loadingInvited,
    createDashboard,
    acceptInvitation,
    rejectInvitation,
  } = useDashboard();

  /* 생성 모달 */
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [value, setValue] = useState({ title: '', color: '' });

  const openCreateModal = () => setIsCreateOpen(true);

  const closeCreateModal = () => {
    setIsCreateOpen(false);
    setValue({ title: '', color: '' });
  };

  const handleChange = (e) => setValue({ ...value, [e.target.name]: e.target.value });

  const handleColorChange = (color) => setValue((prev) => ({ ...prev, color }));

  const handleCreateSubmit = async () => {
    await createDashboard(value);
    closeCreateModal();
  };

  /* 내 대시보드 페이지네이션 */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((myDashboards?.length || 0) / itemsPerPage);

  const visibleMyDashboards = useMemo(() => {
    if (!myDashboards) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return myDashboards.slice(start, start + itemsPerPage);
  }, [myDashboards, currentPage]);

  const handlePrevPage = () => currentPage > 1 && setCurrentPage((v) => v - 1);

  const handleNextPage = () => currentPage < totalPages && setCurrentPage((v) => v + 1);

  /* 초대 수락/거절 */
  const handleAccept = async (id) => {
    await acceptInvitation(id);
  };

  const handleReject = async (id) => {
    await rejectInvitation(id);
  };

  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {/* 상단 : 내 대시보드 */}
          <section className={styles.topSection}>
            <div className={styles.dashboardGrid}>
              {/* 생성 버튼 */}
              <DashboardAddButton onClick={openCreateModal} />

              {/* 대시보드 리스트 */}
              {loadingMy ? (
                <p>로딩중...</p>
              ) : (
                visibleMyDashboards.map((item) => (
                  <DashboardButton
                    key={item.id}
                    color={item.color}
                    dashboardId={item.id}
                    icon={<img src="/images/common/ico_crown.svg" alt="crown" />}
                    arrow={<img src="/images/common/btn_chevron_right.svg" alt="arrow" />}
                    onClick={() => router.push(`/dashboard/${item.id}`)}
                  >
                    {item.title}
                  </DashboardButton>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className={styles.paginationArea}>
                <PageInfo currentPage={currentPage} totalPages={totalPages} />

                <PaginationPairButton
                  size="small"
                  prevColorSet={currentPage === 1 ? 'gray' : 'black'}
                  nextColorSet={currentPage >= totalPages ? 'gray' : 'black'}
                  onPrev={handlePrevPage}
                  onNext={handleNextPage}
                />
              </div>
            )}
          </section>

          {/* 하단 : 초대받은 대시보드 */}
          <section className={styles.invitedSection}>
            {loadingInvited ? (
              <p>로딩중...</p>
            ) : invitedDashboards.length === 0 ? (
              <EmptyInvitedDashboard />
            ) : (
              <InvitedDashboardCardTable
                dashboards={invitedDashboards}
                itemsPerPage={6}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            )}
          </section>
        </div>
      </main>

      {/* 생성 모달 */}
      {isCreateOpen && (
        <Modal
          variant="type1"
          id="createMyDashboardModal"
          isOpen={isCreateOpen}
          closeModal={closeCreateModal}
          onClick={handleCreateSubmit}
          onSubClick={closeCreateModal}
          title="새로운 대시보드"
          secondaryBtn="취소"
          primaryBtn="생성"
        >
          <Input
            label="대시보드 이름"
            type="text"
            name="title"
            placeholder="대시보드 이름을 입력해주세요"
            onChange={handleChange}
            value={value.title}
          />

          <div className="ColorWrap">
            {colorOptions.map(({ colorValue, colorName }) => (
              <Color
                key={colorName}
                value={colorValue}
                color={colorName}
                name="colorGrp"
                onChange={() => handleColorChange(colorValue)}
                selected={value.color}
              />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
export const getServerSideProps = withAuth();
