import Header from '@/components/header/Header';
import ModalProvider from '@/context/modalProvider';
import '@/styles/globals.scss';

export default function MyApp({ Component, pageProps }) {
  const headerType = Component.headerType || 'default';
  const dashboardName = Component.dashboardName || '';
  const mainClassName = Component.mainClassName || '';

  return (
    <ModalProvider>
      <main className={`appMain ${mainClassName}`}>
        <Header type={headerType} dashboardName={dashboardName} />
        <Component {...pageProps}></Component>
      </main>
    </ModalProvider>
  );
}
