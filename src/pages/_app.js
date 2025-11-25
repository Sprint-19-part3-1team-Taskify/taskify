import Head from 'next/head';
import Header from '@/components/header/Header';
import SideMenu from '@/components/sidemenu/SideMenu';
import ModalProvider from '@/context/modalProvider';
import '@/styles/globals.scss';

export default function MyApp({ Component, pageProps }) {
  const headerType = Component.headerType || 'default';
  const sidemenuShow = Component.sidemenuShow;
  const dashboardName = Component.dashboardName || '';
  const mainClassName = Component.mainClassName || '';

  return (
    <>
      <Head>
        <title>Taskify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ModalProvider>
        <main className={`appMain ${mainClassName}`}>
          <Header type={headerType} dashboardName={dashboardName} />
          <SideMenu show={sidemenuShow} />
          <Component {...pageProps}></Component>
        </main>
      </ModalProvider>
    </>
  );
}
