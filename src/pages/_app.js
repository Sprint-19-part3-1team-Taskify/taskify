'use client';

import Head from 'next/head';
import Header from '@/components/header/Header';
import SideMenu from '@/components/sidemenu/SideMenu';
import InviteModalContainer from '@/components/modal/InviteModalContainer';

import ModalProvider from '@/context/modalProvider';
import { HeaderProvider, useHeader } from '@/context/HeaderProvider';
import { useModal } from '@/context/modalProvider';

import '@/styles/globals.scss';
import { useRouter } from 'next/router';
import { DashboardProvider } from '@/context/DashboardProvider';
import AuthProvider from '@/context/authProvider';

function GlobalMessageModal() {
  const { message, clearMessage } = useModal();

  if (!message) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10001, // InviteModal보다 높게
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: 24,
          borderRadius: 8,
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <p style={{ marginBottom: 16 }}>{message}</p>
        <button
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#5534DA',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={clearMessage}
        >
          확인
        </button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const router = useRouter();
  const indexPage = ['/'];
  const authPages = ['/signup', '/login'];
  const pagesWithoutSidemenu = [...indexPage, ...authPages];
  const isGuidePage = router.pathname.startsWith('/guide');
  const isUserPage = authPages.includes(router.pathname);
  const shouldSidemenu = !pagesWithoutSidemenu.includes(router.pathname) && !isGuidePage;
  const { sidemenuShow } = useHeader();
  return (
    <main className={`appMain ${shouldSidemenu && 'subPage'} ${isUserPage && 'userPage'}`}>
      <Header />
      {sidemenuShow && <SideMenu />}
      <div className="pageContent">{children}</div>
    </main>
  );
}

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Taskify</title>
      </Head>
      <HeaderProvider>
        <DashboardProvider>
          <AuthProvider>
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
              <InviteModalContainer />
              <GlobalMessageModal />
            </ModalProvider>
          </AuthProvider>
        </DashboardProvider>
      </HeaderProvider>
    </>
  );
}
