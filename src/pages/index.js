import Head from 'next/head';
import { putAuthPassword } from '@/api/auth';

export default function Home() {
  const handleClick = async () => {
    try {
      const res = await putAuthPassword({
        password: 'oldpassword123',
        newPassword: 'newpassword123',
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
        <main></main>
        <button onClick={handleClick}>테스트 실행</button>
      </div>
    </>
  );
}
