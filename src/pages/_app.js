import Header from '@/components/layout/Header/Header';
import '@/styles/globals.scss';

export default function MyApp({ Component, pageProps }) {
  const headerType = Component.headerType || 'default';
  const dashboardName = Component.dashboardName || '';

  return (
    <>
      <Header type={headerType} dashboardName={dashboardName} />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
