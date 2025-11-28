'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import DashboardLink from '@/components/sidemenu/DashboardLink';
import Input from '@/components/input/Input';
import Color from '@/components/common/Color';

import { useDashboard } from '@/context/DashboardProvider';
import { useHeader } from '@/context/HeaderProvider';
import { PaginationPairButton } from '@/components/button';

import styles from './SideMenu.module.scss';
/**
 * SideMenu Component
 **/

const ITEMS_PER_PAGE = 10;

const colorOptions = [
  { colorValue: '#7ac555', colorName: 'green' },
  { colorValue: '#760dde', colorName: 'purple' },
  { colorValue: '#ffa500', colorName: 'orange' },
  { colorValue: '#76a5ea', colorName: 'blue' },
  { colorValue: '#e876ea', colorName: 'pink' },
];

export default function SideMenu() {
  const path = usePathname();
  const { isOpen, openModal, closeModal } = useModal();
  const { myDashboards, createDashboard } = useDashboard();
  const { sidemenuShow } = useHeader();

  const [pageCount, setPageCount] = useState(1);
  const [createForm, setCreateForm] = useState({ title: '', color: '' });

  const lastPage = Math.ceil((myDashboards?.length || 0) / ITEMS_PER_PAGE);

  const changeCreateForm = (field, value) => {
    setCreateForm((prev) => ({ ...prev, [field]: value }));
  };

  // ==============================
  // ⭐ 대시보드 생성 + 모달 자동 닫힘
  // ==============================
  const handleCreate = async () => {
    if (!createForm.title) return alert('대시보드 이름을 입력해주세요');

    try {
      await createDashboard({
        title: createForm.title,
        color: createForm.color,
      });

      // 입력 초기화
      setCreateForm({ title: '', color: '' });

      // 생성 직후 모달 닫기
      closeModal('createDashboardModal');
    } catch (err) {
      console.error('❌ 대시보드 생성 실패:', err);
      alert('대시보드 생성 중 오류 발생!');
    }
  };

  const pagedDashboards = useMemo(() => {
    const start = (pageCount - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return myDashboards.slice(start, end);
  }, [myDashboards, pageCount]);

  if (!sidemenuShow) return null;

  const goToPreviousPage = () => setPageCount((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setPageCount((prev) => Math.min(prev + 1, lastPage));

  return (
    <>
      <section className={styles.sideMenu}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.svg" width={109} height={33} alt="Taskify" priority />
        </Link>

        <nav className={styles.nav}>
          <h1 className={styles.title}>Dash Boards</h1>

          <button className={styles.btnCreate} onClick={() => openModal('createDashboardModal')}>
            <span className="blind">대시보드 생성</span>
          </button>

          <ul className={styles.navList}>
            {pagedDashboards.map((item) => {
              if (!item?.id) return null;

              return (
                <li key={item.id}>
                  <DashboardLink
                    href={`/dashboard/${item.id}`}
                    name={item.title}
                    color={item.color}
                    owner={item.createdByMe}
                    active={`/dashboard/${item.id}` === path}
                  />
                </li>
              );
            })}
          </ul>
          <PaginationPairButton
            size="large"
            prevState={pageCount === 1 ? 'inactive' : 'active'}
            nextState={pageCount === lastPage ? 'inactive' : 'active'}
            prevColorSet={pageCount === 1 ? 'gray' : 'black'}
            nextColorSet={pageCount === lastPage ? 'gray' : 'black'}
            onPrev={goToPreviousPage}
            onNext={goToNextPage}
          />
        </nav>
      </section>

      {/* ==============================
          ⭐ 생성 모달
          ============================== */}
      <Modal
        variant="type1"
        id="createDashboardModal"
        isOpen={isOpen('createDashboardModal')}
        closeModal={() => closeModal('createDashboardModal')}
        onClick={handleCreate}
        onSubClick={() => closeModal('createDashboardModal')}
        title="새로운 대시보드"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Input
          label="대시보드 이름"
          type="text"
          name="title"
          placeholder="대시보드 이름을 입력해주세요"
          onChange={(e) => changeCreateForm('title', e.target.value)}
          value={createForm.title}
        />

        <div className="ColorWrap">
          {colorOptions.map(({ colorValue, colorName }) => (
            <Color
              key={colorName}
              value={colorValue}
              color={colorName}
              name="colorGrp"
              onChange={() => changeCreateForm('color', colorValue)}
              selected={createForm.color}
            />
          ))}
        </div>
      </Modal>
    </>
  );
}
