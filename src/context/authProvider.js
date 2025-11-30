import { createContext, useContext, useEffect, useState } from 'react';
import { getUsersMe, putUsersMe } from '@/api/users';
import { postAuthLogin } from '@/api/auth';
import { useRouter } from 'next/router';

const AuthContext = createContext({
  user: null,
  isPending: true,
  login: () => {},
  logout: () => {},
  updateMe: () => {},
});

export default function AuthProvider({ children }) {
  const [values, setValues] = useState({
    user: null,
    isPending: true,
  });

  const getMe = async () => {
    setValues((prevValue) => ({
      ...prevValue,
      isPending: true,
    }));

    let nextUser = null;

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
    setValues({
      user: null,
      isPending: false,
    });
  }

  async function updateMe({ nickname, profileImageUrl }) {
    try {
      const res = await putUsersMe({ nickname, profileImageUrl });
      setValues((prevValue) => ({
        ...prevValue,
        user: res,
      }));
    } catch (error) {
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
    if (required && !context.isPending && !context.user) {
      router.push('/login');
    }
  }, [required, context.isPending, context.user, router]);

  return {
    ...context,
    isLoading: context.isPending,
  };
}
