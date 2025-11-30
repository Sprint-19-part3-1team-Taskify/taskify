import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/authProvider';
import User from '@/components/common/User';
import styles from './header.module.scss';

import { useHeader } from '@/context/HeaderProvider';
import { useModal } from '@/context/modalProvider';
import sideStyles from '@/components/sidemenu/SideMenu.module.scss';

import InviteModalContainer from '@/components/modal/InviteModalContainer';

/**
 * Global Navigation Header Component
 *
 * @param {Object} props
 * @param {"default" | "header3" | "header4" | "header5"} props.type
 *   - default: 로그인/회원가입 영역
 *   - default darkMode={true}: 다크모드용 흰색 로고 + 로그인/회원가입
 *   - header3: 대시보드명 + 관리 + 초대하기 + 프로필
 *   - header4: header3 + 아바타 그룹
 *   - header5: 동적 대시보드명 + 관리 + 초대하기 + 아바타 그룹 + 프로필
 *
 * @param {boolean} [props.darkMode=false]
 *   - type="default"일 때만 적용됨 (흰색 로고 사용)
 *
 * @param {string} [props.dashboardName]
 *   - header3/4/5에서 표시되는 대시보드명
 *
 * ```jsx
 * function MyDashboard() {
 *   return <div>내 대시보드</div>;
 * }
 *
 * MyDashboard.headerType = "header3";       // 헤더 타입 지정
 * MyDashboard.dashboardName = "내 대시보드"; // 대시보드명 지정
 *
 * export default MyDashboard;
 * ```
 *
 * 헤더를 숨기고 싶은 경우:
 *
 * ```jsx
 * function LoginPage() {
 *   return <div>로그인 화면</div>;
 * }
 *
 * LoginPage.headerType = "none"; // Header 숨김
 * LoginPage.dashboardName = "";
 *
 * export default LoginPage;
 * ```
 *
 * @typedef {"default" | "header3" | "header4" | "header5" | "header3Simple" | "none"} HeaderType
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
  } = useHeader();

  const { user, logout } = useAuth();
  const { openModal } = useModal();

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
                  <Link href="/mypage" className={styles.profileLink}>
                    <User value={user?.nickname} type="large" />
                  </Link>
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
                  <Link href="/mypage" className={styles.profileLink}>
                    <User value={user?.nickname} type="large" />
                  </Link>
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

                <div className={styles.avatarGroup}>
                  <div className={styles.avatarStack}>
                    <div className={styles.stackedAvatar} style={{ background: '#FFC85A' }}>
                      A
                    </div>
                    <div className={styles.stackedAvatar} style={{ background: '#9DD7ED' }}>
                      B
                    </div>
                    <div className={styles.stackedAvatar} style={{ background: '#E876EA' }}>
                      C
                    </div>
                    <div className={styles.moreCount}>+2</div>
                  </div>
                </div>

                <div className={styles.profileSection}>
                  <Link href="/mypage" className={styles.profileLink}>
                    <User value={user?.nickname} type="large" />
                  </Link>
                </div>
              </>
            )}

            {/* ================================================== */}
            {/* 5️⃣ header5 - 왕관 조건만 수정 */}
            {/* ================================================== */}
            {headerType === 'header5' && (
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

                <div className={styles.avatarGroup}>
                  <div className={styles.avatarStack}>
                    <div className={styles.stackedAvatar} style={{ background: '#FFC85A' }}>
                      A
                    </div>
                    <div className={styles.stackedAvatar} style={{ background: '#9DD7ED' }}>
                      B
                    </div>
                    <div className={styles.stackedAvatar} style={{ background: '#E876EA' }}>
                      C
                    </div>
                    <div className={styles.stackedAvatar} style={{ background: '#76A5EA' }}>
                      D
                    </div>
                  </div>
                </div>

                <div className={styles.profileSection}>
                  <Link href="/mypage" className={styles.profileLink}>
                    <User value={user?.nickname} type="large" />
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
