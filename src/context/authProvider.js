import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getUsersMe, putUsersMe } from '@/api/users';
import { postAuthLogin } from '@/api/auth';
import { useRouter } from 'next/router';

const AuthContext = createContext({
  user: null,
  isPending : true,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
});

export default function AuthProvider({ children }) {
  const [values, setValues] = useState({
    user : null,
    isPending : true
  })

  const getMe = async () => {
    setValues((prevValue) => ({
      ...prevValue,
      isPending : true,
    }))

    let nextUser;

    try {
      const res = await getUsersMe();
      nextUser = res;
    } catch {

    } finally {
      setValues((prevValue) => ({
        ...prevValue,
        user : nextUser,
        isPending : false,
      }))
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
    /*** 로그아웃 */
  }

  async function updateMe({ nickname, profileImageUrl }) {
    try {
      const res = await putUsersMe({ nickname, profileImageUrl });
      const nextUser = res;
      setValues((prevValue) => ({
        ...prevValue,
        user : nextUser,
      }))
    }catch(error) {
      throw error;
    }
  }

  useEffect(() => {
    const initAuth = async () => {
      await getMe();
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
        user : values.user, 
        isPending : values.isPending, 
        getMe, 
        login, 
        logout, 
        updateMe }}>
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
