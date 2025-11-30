import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUsersMe, putUsersMe } from '@/api/users';
import { postAuthLogin, postAuthLogout } from '@/api/auth';
import { useRouter } from 'next/router';

const AuthContext = createContext({
  user: null,
  isPending: true,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
});

export default function AuthProvider({ children }) {
  const router = useRouter();
  const [values, setValues] = useState({
    user: null,
    isPending: true,
  });

  const getMe = async () => {
    setValues((prevValue) => ({
      ...prevValue,
      isPending: true,
    }));

    let nextUser;

    try {
      const res = await getUsersMe();
      nextUser = res;
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      nextUser = null;
    } finally {
      setValues((prevValue) => ({
        ...prevValue,
        user: nextUser,
        isPending: false,
      }));
    }
  };

  async function login({ email, password }) {
    try {
      const res = await postAuthLogin({ email, password });
      await getMe();
    } catch (error) {
      throw error;
    }
  }
  async function logout() {
    try {
      const res = await postAuthLogout();
      setValues({ user: null, isPending: false }); // 로컬 상태 초기화
      router.push('/');
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error(error);
      }
      // throw error;
    }
  }

  async function updateMe({ nickname, profileImageUrl }) {
    try {
      const res = await putUsersMe({ nickname, profileImageUrl });
      const nextUser = res;
      setValues((prevValue) => ({
        ...prevValue,
        user: nextUser,
      }));
    } catch (error) {
      throw error;
    }
  }

  const publicPages = ['/', '/login', '/signup'];

  useEffect(() => {
    // 공개 페이지면 바로 isPending false
    if (publicPages.includes(router.pathname)) {
      setValues({ user: null, isPending: false });
      return;
    }

    // 보호된 페이지에서만 유저 정보 확인
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: values.user,
        isPending: values.isPending,
        getMe,
        login,
        logout,
        updateMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth(required) {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error('반드시 AuthProvider안에서 사용해야합니다.');
  }

  useEffect(() => {
    // 보호 페이지 접근 + user 정보 로딩 완료 + 로그아웃 상태 → 리다이렉트
    // (pending 상태가 끝나야 user 여부 체크 완료 할수 있음)
    if (required && !context.isPending && !context.user) {
      router.push('/login');
    }
  }, [required, context.isPending, context.user]);

  return {
    ...context,
    isLoading: context.isPending,
  };
}
