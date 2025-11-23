'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import DashboardLink from '@/components/sidemenu/DashboardLink';
import Input from '@/components/input/Input';
import Color from '@/components/common/Color';
import styles from './SideMenu.module.scss';

/**
 * SideMenu Component
 * 애플리케이션의 좌측 메뉴 영역을 구성하는 컴포넌트입니다.
 * 로고, 대시보드 생성 버튼, 대시보드 목록을 포함합니다.
 *
 * @component
 * @returns {JSX.Element} SideMenu Component
 *
 * @example
 * // dashboard 레이아웃에서 사용됩니다.
 * <SideMenu />
 **/

// 임시데이터
const menu = [
  { href: '/mydashboard/1', name: '비브리지', color: 'green', owner: true },
  { href: '/mydashboard/2', name: '코드잇', color: 'purple' },
  { href: '/mydashboard/3', name: '3분기 계획', color: 'orange', owner: true },
  { href: '/mydashboard/4', name: '회의록', color: 'blue' },
  { href: '/mydashboard/5', name: '중요 문서함', color: 'pink' },
];

export default function SideMenu() {
  const params = usePathname();
  const { isOpen, openModal, closeModal } = useModal();

  const [value, setValue] = useState({
    title: '',
    color: '',
  });

  const colorOptions = [
    { colorValue: '#7ac555', colorName: 'green' },
    { colorValue: '#760dde', colorName: 'purple' },
    { colorValue: '#ffa500', colorName: 'orange' },
    { colorValue: '#76a5ea', colorName: 'blue' },
    { colorValue: '#e876ea', colorName: 'pink' },
  ];
  const handleColorChange = (value) => {
    setValue((prev) => ({
      ...prev,
      color: value,
    }));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleModalSubmit = (e) => {
    // api전송 작성필요
    console.log(value);

    setValue({
      title: '',
      color: '',
    });
  };
  const handleModalCancle = (e) => {
    setValue({
      title: '',
      color: '',
    });
  };
  return (
    <>
      <section className={styles.sideMenu}>
        <Link href="/" className={styles.logo}>
          <Image src="/images/logo.svg" fill alt="Taskify" />
        </Link>
        <nav className={styles.nav}>
          <h1 className={styles.title}>Dash Boards</h1>
          <button className={styles.btnCreate} onClick={() => openModal('createDashboardModal')}>
            <span className="blind">대시보드 생성</span>
          </button>
          <ul className={styles.navList}>
            {menu.map((item) => (
              <li key={item.href}>
                <DashboardLink
                  href={item.href}
                  name={item.name}
                  color={item.color}
                  owner={item.owner}
                  active={item.href === params}
                />
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* 새로운 대시보드 모달 */}
      <Modal
        variant="type1"
        id="createDashboardModal"
        isOpen={isOpen('createDashboardModal')}
        closeModal={closeModal}
        onClick={handleModalSubmit}
        onSubClick={handleModalCancle}
        title="새로운 대시보드"
        secondaryBtn="취소"
        primaryBtn="생성"
      >
        <Input
          label="대시보드 이름"
          type="text"
          id="title"
          name="title"
          placeholder="대시보드 이름을 입력해주세요"
          onChange={handleChange}
          value={value.title}
        />
        <div className="ColorWrap">
          {colorOptions.map((option) => {
            const { colorValue, colorName } = option;
            return (
              <Color
                key={colorName}
                value={colorValue}
                color={colorName}
                name="colorGrp"
                onChange={handleColorChange}
                selected={value.color}
              />
            );
          })}
        </div>
      </Modal>
    </>
  );
}
