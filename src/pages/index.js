import { postAuthLogin } from '@/api/auth';
import { postDashboards } from '@/api/dashboards';
import { useAuth } from '@/context/authProvider';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { user, isPending } = useAuth();
  const router = useRouter()


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

  useEffect(() => {
    if(!isPending && user) {
      console.log(user);
      router.push('/mypage')
    }
  }, [user])

  return (
    <>
      <div>
        <main>123123123123</main>
        <button onClick={handleLogin}>로그인</button>
        <button onClick={handleCreate}>대시보드 생성</button>
      </div>
    </>
  );
}
