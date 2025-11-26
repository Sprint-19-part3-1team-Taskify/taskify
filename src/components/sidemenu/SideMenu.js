import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/context/modalProvider';
import Modal from '@/components/modal/Modal';
import DashboardLink from '@/components/sidemenu/DashboardLink';
import Input from '@/components/input/Input';
import Color from '@/components/common/Color';
import { PaginationPairButton } from '@/components/button';
import { getDashboards, postDashboards } from '@/api/dashboards';
import styles from './SideMenu.module.scss';
import { useRouter } from 'next/router';

/**
 * SideMenu Component
 * 애플리케이션의 좌측 메뉴 영역을 구성하는 컴포넌트입니다.
 * 로고, 대시보드 생성 버튼, 대시보드 목록을 포함합니다.
 *
 * @component
 * @returns {JSX.Element} SideMenu Component
 *
 * @example
 * function MyDashboard() {
 *  return <div>내 대시보드</div>;
 * }
 * MyDashBoard.sidemenuShow = true;
 **/

const ITEMS_PER_PAGE = 10;
const colorOptions = [
  { colorValue: '#7ac555', colorName: 'green' },
  { colorValue: '#760dde', colorName: 'purple' },
  { colorValue: '#ffa500', colorName: 'orange' },
  { colorValue: '#76a5ea', colorName: 'blue' },
  { colorValue: '#e876ea', colorName: 'pink' },
];
export default function SideMenu({ show }) {
  const router = useRouter();
  const path = router.query.dashboardid;
  const [pageCount, setPageCount] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const lastPage = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const { isOpen, openModal, closeModal } = useModal();
  const [dashboards, setDashboards] = useState([]);
  const [value, setValue] = useState({
    title: '',
    color: '',
  });
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
  // 새 대시보드 생성취소
  const handleModalCancle = (e) => {
    setValue({
      title: '',
      color: '',
    });
    closeModal('createDashboardModal');
  };

  // 새 대시보드 생성시
  const handleModalSubmit = async (e) => {
    if (!value.title || !value.color) {
      return null;
    }

    try {
      await postDashboards({ title: value.title, color: value.color });
      setValue({
        title: '',
        color: '',
      });
      const res = await getDashboards({
        navigationMethod: 'pagination',
        page: 1,
        size: ITEMS_PER_PAGE,
      });
      setDashboards(res.dashboards);
      setTotalCount(res.totalCount);

      closeModal('createDashboardModal');
    } catch (error) {
      console.error(error);
    }
  };
  // 페이징 이전버튼
  const goToPreviousPage = () => {
    setPageCount((prev) => Math.max(prev - 1, 1));
  };
  // 페이징 다음버튼
  const goToNextPage = () => {
    setPageCount((prev) => Math.min(prev + 1, lastPage));
  };

  useEffect(() => {
    const getDashboarData = async () => {
      const res = await getDashboards({
        navigationMethod: 'pagination',
        page: pageCount,
        size: ITEMS_PER_PAGE,
      });
      setDashboards(res.dashboards);
      setTotalCount(res.totalCount);
    };
    getDashboarData();
  }, [pageCount]);
  if (!show) return null;
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
            {dashboards.map((item) => (
              <li key={item.id}>
                <DashboardLink
                  href={`/mydashboard/${item.id}`}
                  name={item.title}
                  color={item.color}
                  owner={item.createdByMe}
                  active={`${item.id}` === path}
                />
              </li>
            ))}
          </ul>
          {totalCount >= 11 && (
            <PaginationPairButton
              size="large"
              prevState={pageCount === 1 ? 'inactive' : 'active'}
              nextState={pageCount === lastPage ? 'inactive' : 'active'}
              prevColorSet={pageCount === 1 ? 'gray' : 'black'}
              nextColorSet={pageCount === lastPage ? 'gray' : 'black'}
              onPrev={goToPreviousPage}
              onNext={goToNextPage}
            />
          )}
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
