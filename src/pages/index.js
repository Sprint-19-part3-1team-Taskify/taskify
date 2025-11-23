import Head from 'next/head';
import { postAuthLogin } from '@/api/auth';
import { postDashboards } from '@/api/dashboards';

export default function Home() {
  const handleLogin = async () => {
    try {
      const res = await postAuthLogin({
        email: 'user@example.com',
        password: 'password123',
      });
      console.log(res);
    } catch (error) {
      // HTTP 전송 오류 처리
      console.error(error);
    }
  };

  const handleCreate = async () => {
    try {
      const res = await postDashboards({
        title: 'New Dashboard',
        color: '#FF5733',
      });
      console.log(res);
    } catch (error) {
      // HTTP 전송 오류 처리
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Taskify - 스마트한 일정 관리</title>
        <meta
          name="description"
          content="팀과 함께하는 스마트한 일정 관리. 할 일을 등록하고, 진행 상황을 공유하며, 효율적으로 프로젝트를 관리하세요."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main>123123123123</main>
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleCreate}>대시보드 생성</button>
      </div>
    </>
  );
}
