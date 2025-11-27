'use client';

import styles from './header.module.scss';
import Image from 'next/image';
import Link from 'next/link';

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
 * @returns {JSX.Element} Header Component
 * 이런식으로 사용
 * function MyDashboard() {
  return <div>내 대시보드</div>;
  }

    MyDashboard.headerType = "header3";
    MyDashboard.dashboardName = "내 대시보드";

    export default MyDashboard;
    
 headerType를 "none"으로 설정하여 헤더를 숨길 수도 있습니다.
 예를 들어, 로그인 페이지에서 헤더를 숨기고 싶다면 다음과 같이 설정할 수 있습니다.
    function LoginPage() {
  return <div>로그인 화면</div>;
}

LoginPage.headerType = "none";       // Header 숨기고 싶을 때
LoginPage.dashboardName = "";        // 제목 없음

export default LoginPage;
 
    **/

export default function Header({
  type = 'default', // default, header3, header4, header5
  dashboardName = '내 대시보드',
  darkMode = false,
  profileImage = null,
}) {
  if (type === 'none') return null;
  return (
    <header className={`${styles.header} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.inner}>
        {/* 로고 — default 에서만 표시 */}
        {type === 'default' && (
          <Link href="/" className={styles.logo}>
            <Image src="/images/logo.svg" width={109} height={33} alt="Taskify" priority />
          </Link>
        )}

        {/* 오른쪽 영역 */}
        <nav className={styles.nav}>
          {/* 1️⃣ default: 로그인 + 회원가입 */}
          {type === 'default' && (
            <div className={styles.authGroup}>
              <Link href="/login" className={styles.textBtn}>
                로그인
              </Link>
              <Link href="/signup" className={styles.textBtn}>
                회원가입
              </Link>
            </div>
          )}

          {/* 2️⃣ header3: 내 대시보드 + 관리 + 초대하기 + 프로필 */}
          {type === 'header3' && (
            <>
              <Link href="/my-dashboard" className={styles.dashboardName}>
                {dashboardName}
              </Link>

              <div className={styles.buttonGroup}>
                <Link href="/manage" className={styles.outlineBtn}>
                  <Image src="/images/settings.svg" width={20} height={20} alt="" />
                  관리
                </Link>
                <Link href="/invite" className={styles.outlineBtn}>
                  <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                  초대하기
                </Link>
              </div>

              <div className={styles.profileSection}>
                <div className={styles.avatar}>
                  {profileImage ? (
                    <Image src={profileImage} width={34} height={34} alt="프로필" />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>
                <Link href="/profile" className={styles.profileLink}>
                  프로필
                </Link>
              </div>
            </>
          )}

          {/* 3️⃣ header4: 내 대시보드 + 관리 + 초대하기 + 아바타 그룹 + 프로필 */}
          {type === 'header4' && (
            <>
              <Link href="/my-dashboard" className={styles.dashboardName}>
                {dashboardName}
              </Link>

              <div className={styles.buttonGroup}>
                <Link href="/manage" className={styles.outlineBtn}>
                  <Image src="/images/settings.svg" width={20} height={20} alt="" />
                  관리
                </Link>
                <Link href="/invite" className={styles.outlineBtn}>
                  <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                  초대하기
                </Link>
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
                <div className={styles.avatar}>
                  {profileImage ? (
                    <Image src={profileImage} width={34} height={34} alt="프로필" />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>
                <Link href="/profile" className={styles.profileLink}>
                  프로필
                </Link>
              </div>
            </>
          )}

          {/* 4️⃣ header5: 생성된대시보드 + 관리 + 초대하기 + 아바타 그룹 + 프로필 */}
          {type === 'header5' && (
            <>
              <div className={styles.dashboardNameWithDot}>
                <span className={styles.dashboardName}>생성된대시보드</span>
              </div>

              <div className={styles.buttonGroup}>
                <Link href="/manage" className={styles.outlineBtn}>
                  <Image src="/images/settings.svg" width={20} height={20} alt="" />
                  관리
                </Link>
                <Link href="/invite" className={styles.outlineBtn}>
                  <Image src="/images/add_box.svg" width={20} height={20} alt="" />
                  초대하기
                </Link>
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
                <div className={styles.avatar}>
                  {profileImage ? (
                    <Image src={profileImage} width={34} height={34} alt="프로필" />
                  ) : (
                    <div className={styles.avatarPlaceholder} />
                  )}
                </div>
                <Link href="/profile" className={styles.profileLink}>
                  프로필
                </Link>
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
