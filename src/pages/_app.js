import Head from 'next/head';
import Header from '@/components/header/Header';
import SideMenu from '@/components/sidemenu/SideMenu';
import App from '@/components/app';
import '@/styles/globals.scss';
import { useRouter } from 'next/router';

const indexPage = ['/'];
const authPages = ['/signup', '/login'];
const pagesWithoutSidemenu = [...indexPage, ...authPages];
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isGuidePage = router.pathname.startsWith('/guide');
  const isUserPage = authPages.includes(router.pathname);
  const shouldSidemenu = !pagesWithoutSidemenu.includes(router.pathname) && !isGuidePage;

  const headerType = Component.headerType || 'default';
  const dashboardName = Component.dashboardName || '';

  return (
    <>
      <Head>
        <title>Taskify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App>
        <main className={`appMain ${shouldSidemenu && 'subPage'} ${isUserPage && 'userPage'}`}>
          <Header type={headerType} dashboardName={dashboardName} />
          {shouldSidemenu && <SideMenu show={shouldSidemenu} />}
          <Component {...pageProps}></Component>
        </main>
      </App>
    </>
  );
}
