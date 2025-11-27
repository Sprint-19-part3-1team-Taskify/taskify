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
    await getMe();
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
    if (required && !context.user && !context.isPending) {
      router.push('/login')
    }
  }, [context.user, context.isPending, required, router])

  // required가 true일 때 로딩 중이면 isLoading 반환
  if (required && context.isPending) {
    return {
      ...context,
      isLoading: true,
      user: null,
    };
  }

  // required가 true인데 user가 없으면 isRedirecting 반환
  if (required && !context.user) {
    return {
      ...context,
      isRedirecting: true,
      user: null,
    };
  }

  return context;
}
