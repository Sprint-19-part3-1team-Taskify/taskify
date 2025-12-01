import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useHeader } from '@/context/HeaderProvider';
import { useAuth } from '@/context/authProvider';
import { getDashboards } from '@/api/dashboards';
import { LoginButton } from '@/components/button';
import styles from './index.module.scss';
import { useDashboard } from '@/context/DashboardProvider';

export default function Home() {
  const { user } = useAuth();
  const { myDashboards } = useDashboard();
  const router = useRouter();
  const [dashboardId, setDashboardId] = useState(null);
  const handleClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      const firstDashboard = myDashboards[0];
      if (firstDashboard?.id) {
        router.push(`/dashboard/${firstDashboard.id}`);
      } else {
        router.push('/mydashboard');
      }
    }
  };

  /* HeaderProvider 적용 */
  const { setHeaderConfig } = useHeader();
  useEffect(() => {
    setHeaderConfig({
      headerType: 'default',
      sidemenuShow: false,
    });
  }, [setHeaderConfig]);

  /* UI */
  useEffect(() => {
    document.body.style.cssText = `
      overflow-y: hidden;
    `;
    return () => {
      document.body.style.cssText = '';
    };
  }, []);

  return (
    <div className={styles.landingSection}>
      <section className={styles.section01}>
        <div className={styles.box}>
          <div className={styles.img}>
            <Image src="/images/landing/img_sec01.svg" fill alt="" />
          </div>
          <div className={styles.tit}>
            새로운 일정 관리 <em>Taskify</em>
          </div>
          <LoginButton
            style={{ width: '280px', height: '54px', margin: '111px auto 0' }}
            size="xsmall"
            active
            onClick={handleClick}
          >
            {user ? '대시보드' : '로그인'}
          </LoginButton>
        </div>
      </section>
      <section className={styles.section02}>
        <div className={styles.box}>
          <div className={styles.con}>
            <div className={styles.subTit}>Point 1</div>
            <div className={styles.tit}>
              일의 우선순위를
              <br />
              관리하세요
            </div>
          </div>
          <div className={styles.img}>
            <Image src="/images/landing/img_sec02.svg" fill alt="" />
          </div>
        </div>
      </section>
      <section className={styles.section03}>
        <div className={styles.box}>
          <div className={styles.con}>
            <div className={styles.subTit}>Point 2</div>
            <div className={styles.tit}>
              해야 할 일을
              <br />
              등록하세요
            </div>
          </div>
          <div className={styles.img}>
            <Image src="/images/landing/img_sec03.svg" fill alt="" />
          </div>
        </div>
      </section>
      <section className={styles.section04}>
        <div className={styles.box}>
          <div className={styles.tit}>생산성을 높이는 다양한 설정 ⚡</div>
          <ul>
            <li>
              <div className={styles.img}>
                <div className={styles.i01}>
                  <Image src="/images/landing/img_sec04_01.svg" fill alt="" />
                </div>
              </div>
              <div className={styles.txt}>
                <em>대시보드 설정</em>
                <span>대시보드 사진과 이름을 변경할 수 있어요.</span>
              </div>
            </li>
            <li>
              <div className={styles.img}>
                <div className={styles.i02}>
                  <Image src="/images/landing/img_sec04_02.svg" fill alt="" />
                </div>
              </div>
              <div className={styles.txt}>
                <em>초대</em>
                <span>새로운 팀원을 초대할 수 있어요.</span>
              </div>
            </li>
            <li>
              <div className={styles.img}>
                <div className={styles.i03}>
                  <Image src="/images/landing/img_sec04_03.svg" fill alt="" />
                </div>
              </div>
              <div className={styles.txt}>
                <em>구성원</em>
                <span>구성원을 초대하고 내보낼 수 있어요.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* landingFooter */}
        <div className={styles.landingFooter}>
          <div className={styles.copy}>©codeit - 2023</div>
          <div className={styles.links}>
            <Link href="/">Privacy Policy</Link>
            <Link href="/">FAQ</Link>
          </div>
          <div className={styles.sns}>
            <Link href="/">
              <Image src="/images/landing/ico_email.svg" alt="이메일 보내기" fill />
            </Link>
            <Link href="/">
              <Image src="/images/landing/ico_facebook.svg" alt="페이스북 바로가기" fill />
            </Link>
            <Link href="/">
              <Image src="/images/landing/ico_instagram.svg" alt="인스타그램 바로가기" fill />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
