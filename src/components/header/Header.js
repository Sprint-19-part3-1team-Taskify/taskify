import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/authProvider';
import User from '@/components/common/User';
import styles from './header.module.scss';

import { useHeader } from '@/context/HeaderProvider';
import { useModal } from '@/context/modalProvider';
import sideStyles from '@/components/sidemenu/SideMenu.module.scss';
import Users from '@/components/common/Users';
import UserMenu from '@/components/header/UserMenu';

/**
 * Global Navigation Header Component
 *
 * @param {Object} props*
 * @typedef {"default" | "header3" | "header4" | "header5" | "header3Simple" | "none"} HeaderType
 * props.type
 *   - default: 로그인/회원가입 영역
 *   - default darkMode={true}: 다크모드용 흰색 로고 + 로그인/회원가입
 *   - header3: 대시보드명 + 관리 + 초대하기 + 프로필
 *   - header4: header3 + 아바타 그룹
 *   - header5: 동적 대시보드명 + 관리 + 초대하기 + 아바타 그룹 + 프로필
 *
 * @param {string} [props.dashboardName]
 *   - header3/4/5에서 표시되는 대시보드명
 *
 * @returns {JSX.Element | null} 렌더링된 헤더 요소 (headerType이 none이면 null)
 */

export default function Header() {
  const {
    headerType = 'header3',
    dashboardName = '내 대시보드',
    showCrown = true,
    dashboardId,
    isOwner,
    members = [],
  } = useHeader();

  const { user, logout } = useAuth();
  const { openModal } = useModal();

  // 멤버 표시 (최대 4명 + 더보기)
  const displayMembers = members.slice(0, 4);
  const remainingCount = members.length > 4 ? members.length - 4 : 0;

  if (headerType === 'none') return null;

  return (
    <>
      <header className={`${styles.header}`}>
        <div className={styles.inner}>
          {headerType === 'default' && (
            <Link href="/" className={styles.logo}>
              <Image src="/images/logo.svg" width={109} height={33} alt="Taskify" priority />
            </Link>
          )}

          <nav
            className={`${styles.nav} ${
              headerType === 'header3Simple' ? styles.header3SimpleNav : ''
            }`}
          >
            {headerType === 'default' && (
              <div className={styles.authGroup}>
                {user ? (
                  <>
                    <button onClick={logout} className={styles.textBtn}>
                      로그아웃
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={styles.textBtn}>
                      로그인
                    </Link>
                    <Link href="/signup" className={styles.textBtn}>
                      회원가입
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* ================================================== */}
            {/* 2️⃣ header3 - 여기 왕관 조건만 수정됨 */}
            {/* ================================================== */}
            {headerType === 'header3' && (
              <>
                <Link href="/dashboard" className={styles.dashboardName}>
                  {dashboardName}
                  {showCrown && isOwner && (
                    <span className={sideStyles.crownIcon}>
                      <Image
                        src="/images/dashboard/ico_crown.svg"
                        width={18}
                        height={14}
                        alt="owner"
                      />
                    </span>
                  )}
                </Link>

                <div className={styles.buttonGroup}>
                  <Link href={`/dashboard/${dashboardId}/edit`} className={styles.outlineBtn}>
                    <Image src="/images/settings.svg" width={20} height={20} alt="" />
                    관리
                  </Link>

                  <button
                    className={styles.outlineBtn}
                    type="button"
                    onClick={() => openModal('inviteModal')}
                  >
                    <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                    초대하기
                  </button>
                </div>

                <div className={styles.profileSection}>
                  <UserMenu />
                </div>
              </>
            )}

            {/* ================================================== */}
            {/* 3️⃣ header3Simple - 왕관 조건만 수정 */}
            {/* ================================================== */}
            {headerType === 'header3Simple' && (
              <div className={styles.header3Simple}>
                <Link href="/dashboard" className={styles.dashboardName}>
                  {dashboardName}
                  {showCrown && isOwner && (
                    <span className={sideStyles.crownIcon}>
                      <Image
                        src="/images/dashboard/ico_crown.svg"
                        width={18}
                        height={14}
                        alt="owner"
                      />
                    </span>
                  )}
                </Link>

                <div className={styles.profileSection}>
                  <UserMenu />
                </div>
              </div>
            )}

            {/* ================================================== */}
            {/* 4️⃣ header4 - 왕관 조건만 수정 */}
            {/* ================================================== */}
            {headerType === 'header4' && (
              <>
                <Link href="/dashboard" className={styles.dashboardName}>
                  {dashboardName}
                  {showCrown && isOwner && (
                    <span className={sideStyles.crownIcon}>
                      <Image
                        src="/images/dashboard/ico_crown.svg"
                        width={18}
                        height={14}
                        alt="owner"
                      />
                    </span>
                  )}
                </Link>

                <div className={styles.buttonGroup}>
                  {isOwner && (
                    <Link href={`/dashboard/${dashboardId}/edit`} className={styles.outlineBtn}>
                      <Image src="/images/settings.svg" width={20} height={20} alt="" />
                      관리
                    </Link>
                  )}

                  <button
                    className={styles.outlineBtn}
                    type="button"
                    onClick={() => openModal('inviteModal')}
                  >
                    <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                    초대하기
                  </button>
                </div>

                {/* 대시보드 멤버  */}
                <Users />

                <div className={styles.profileSection}>
                  <UserMenu />
                </div>
              </>
            )}

            {/* ================================================== */}
            {/* 5️⃣ header5 - 왕관 조건만 수정 */}
            {/* ================================================== */}
            {headerType === 'header5' && (
              <>
                <div className={styles.dashboardName}>
                  {dashboardName}
                  {showCrown && isOwner && (
                    <span className={sideStyles.crownIcon}>
                      <Image
                        src="/images/dashboard/ico_crown.svg"
                        width={18}
                        height={14}
                        alt="owner"
                      />
                    </span>
                  )}
                </div>

                <div className={styles.buttonGroup}>
                  {isOwner && (
                    <Link href={`/dashboard/${dashboardId}/edit`} className={styles.outlineBtn}>
                      <Image src="/images/settings.svg" width={20} height={20} alt="" />
                      관리
                    </Link>
                  )}

                  <button
                    className={styles.outlineBtn}
                    type="button"
                    onClick={() => openModal('inviteModal')}
                  >
                    <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                    초대하기
                  </button>
                </div>

                {/* 대시보드 멤버  */}
                <Users />

                <div className={styles.profileSection}>
                  <UserMenu />
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
